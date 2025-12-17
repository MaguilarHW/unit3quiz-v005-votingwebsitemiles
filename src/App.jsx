import { useState, useEffect } from "react";
import "./App.css";
import DrugChart from "./components/DrugChart";
import DrugSelector from "./components/DrugSelector";
import { parseCSV, processData, filterDataByDrug } from "./utils/csvParser";

function App() {
  const [processedData, setProcessedData] = useState(null);
  const [selectedDrug, setSelectedDrug] = useState("All");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load and process CSV data
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/overdoseRates (1).csv");
        if (!response.ok) {
          throw new Error("Failed to fetch CSV data");
        }
        const csvText = await response.text();
        const rawData = await parseCSV(csvText);
        const processed = processData(rawData);
        setProcessedData(processed);
        setChartData(filterDataByDrug(processed, "All"));
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Update chart data when drug selection changes
    if (processedData) {
      const filtered = filterDataByDrug(processedData, selectedDrug);
      setChartData(filtered);
    }
  }, [selectedDrug, processedData]);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <p>Loading overdose data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Drug Overdose Deaths Analysis</h1>
        <p className="subtitle">
          Provisional Drug Overdose Death Counts for Specific Drugs
        </p>
      </header>

      <main className="main-content">
        <div className="controls-section">
          <DrugSelector
            drugs={processedData?.drugs || []}
            selectedDrug={selectedDrug}
            onDrugChange={setSelectedDrug}
          />
        </div>

        <div className="chart-section">
          <DrugChart data={chartData} selectedDrug={selectedDrug} />
        </div>

        <section className="statement-section">
          <h2>Statement of Intent</h2>
          <div className="statement-content">
            <p>
              The data presented above reveals a critical public health crisis
              affecting our nation. Drug overdose deaths have reached alarming
              levels, with trends showing persistent increases across multiple
              substance categories including opioids, cocaine, heroin, and
              synthetic drugs.
            </p>
            <p>
              As a public servant committed to the health and safety of our
              communities, I believe we must take immediate and comprehensive
              action. This crisis demands a multi-faceted approach that
              includes:
            </p>
            <ul>
              <li>
                <strong>Enhanced Prevention Programs:</strong> Implementing
                evidence-based prevention strategies in schools and communities
                to reduce substance abuse initiation.
              </li>
              <li>
                <strong>Expanded Treatment Access:</strong> Ensuring that all
                individuals struggling with substance use disorders have access
                to quality, affordable treatment and recovery services.
              </li>
              <li>
                <strong>Harm Reduction Initiatives:</strong> Supporting programs
                such as naloxone distribution and supervised consumption sites
                that save lives and connect people to care.
              </li>
              <li>
                <strong>Mental Health Integration:</strong> Addressing the
                underlying mental health conditions that often co-occur with
                substance use disorders.
              </li>
              <li>
                <strong>Data-Driven Policy:</strong> Using comprehensive data
                like this to inform policy decisions and allocate resources
                where they are most needed.
              </li>
            </ul>
            <p>
              The numbers we see are not just statistics—they represent lives
              lost, families shattered, and communities in crisis. We have a
              moral obligation to act decisively. I am committed to working
              across party lines to implement solutions that will save lives and
              help our communities heal.
            </p>
            <p className="data-source">
              <strong>Data Source:</strong>{" "}
              <a
                href="https://catalog.data.gov/dataset/provisional-drug-overdose-death-counts-for-specific-drugs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Provisional Drug Overdose Death Counts for Specific Drugs
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/MaguilarHW/unit3quiz-v005-votingwebsitemiles"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
