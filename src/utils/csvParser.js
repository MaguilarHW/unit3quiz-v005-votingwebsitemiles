import Papa from 'papaparse';

/**
 * Parse CSV file and extract drug overdose data
 * @param {string} csvText - Raw CSV text content
 * @returns {Array} Array of parsed data objects
 */
export function parseCSV(csvText) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Clean up header names
        return header.trim();
      },
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Process raw CSV data and extract unique drugs and monthly data
 * @param {Array} rawData - Raw parsed CSV data
 * @returns {Object} Processed data with drugs list and monthly aggregates
 */
export function processData(rawData) {
  const drugsMap = new Map();
  const monthlyData = new Map(); // Key: "Year-Month-Drug", Value: sum of data values
  
  // Filter out non-drug indicators
  const excludedIndicators = [
    'Number of Deaths',
    'Number of Drug Overdose Deaths',
    'Percent with drugs specified',
    'Natural', // Incomplete entry
    'Opioids (T40.0-T40.4' // Incomplete entry
  ];
  
  rawData.forEach(row => {
    let indicator = row['Indicator']?.trim();
    const dataValue = row['Data Value']?.trim();
    const year = row['Year']?.trim();
    const month = row['Month']?.trim();
    
    // Skip rows without valid data
    if (!indicator || !dataValue || !year || !month) return;
    
    // Clean up indicator (remove leading quotes)
    indicator = indicator.replace(/^["']|["']$/g, '');
    
    // Skip excluded indicators
    if (excludedIndicators.some(excluded => indicator.includes(excluded))) return;
    
    // Skip non-numeric data values (like suppressed data)
    const numericValue = parseFloat(dataValue);
    if (isNaN(numericValue)) return;
    
    // Extract drug name (remove ICD codes if present)
    let drugName = indicator.split('(')[0].trim();
    
    // Clean up drug name
    drugName = drugName.replace(/^["']|["']$/g, '').trim();
    
    // Skip if drug name is empty or too short
    if (!drugName || drugName.length < 2) return;
    
    // Store unique drugs
    if (!drugsMap.has(drugName)) {
      drugsMap.set(drugName, {
        name: drugName,
        fullName: indicator
      });
    }
    
    // Aggregate monthly data by drug
    const key = `${year}-${month}-${drugName}`;
    if (monthlyData.has(key)) {
      monthlyData.set(key, monthlyData.get(key) + numericValue);
    } else {
      monthlyData.set(key, numericValue);
    }
  });
  
  // Convert to arrays and sort drugs alphabetically
  const drugs = Array.from(drugsMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Group monthly data by drug
  const drugMonthlyData = {};
  monthlyData.forEach((value, key) => {
    const parts = key.split('-');
    const year = parts[0];
    const month = parts[1];
    const drug = parts.slice(2).join('-'); // Handle drug names with hyphens
    
    if (!drugMonthlyData[drug]) {
      drugMonthlyData[drug] = [];
    }
    drugMonthlyData[drug].push({
      year: parseInt(year),
      month: month,
      value: value,
      dateKey: `${year}-${month}`
    });
  });
  
  // Sort monthly data by year and month
  Object.keys(drugMonthlyData).forEach(drug => {
    drugMonthlyData[drug].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  });
  
  return {
    drugs,
    drugMonthlyData
  };
}

/**
 * Filter data by selected drug
 * @param {Object} processedData - Processed data from processData()
 * @param {string} selectedDrug - Selected drug name (or 'All' for all drugs)
 * @returns {Array} Filtered monthly data for charting
 */
export function filterDataByDrug(processedData, selectedDrug) {
  if (selectedDrug === 'All' || !selectedDrug) {
    // Aggregate all drugs by month
    const aggregated = new Map();
    
    Object.values(processedData.drugMonthlyData).forEach(drugData => {
      drugData.forEach(({ dateKey, value, month, year }) => {
        if (aggregated.has(dateKey)) {
          aggregated.set(dateKey, {
            value: aggregated.get(dateKey).value + value,
            month,
            year
          });
        } else {
          aggregated.set(dateKey, { value, month, year });
        }
      });
    });
    
    return Array.from(aggregated.entries())
      .map(([dateKey, { value, month, year }]) => ({
        dateKey,
        value,
        label: `${month.substring(0, 3)} ${year}`,
        month,
        year
      }))
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
  } else {
    // Return data for specific drug
    const drugData = processedData.drugMonthlyData[selectedDrug] || [];
    return drugData.map(({ dateKey, value, month, year }) => ({
      dateKey,
      value,
      label: `${month.substring(0, 3)} ${year}`,
      month,
      year
    }));
  }
}

