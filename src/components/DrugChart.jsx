import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DrugChart({ data, selectedDrug }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p>No data available to display</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        {selectedDrug === 'All' ? 'All Drug Overdose Deaths' : `${selectedDrug} Overdose Deaths`}
      </h3>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="label" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={Math.max(0, Math.floor(data.length / 15))}
            stroke="#666"
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            label={{ value: 'Number of Deaths', angle: -90, position: 'insideLeft' }}
            stroke="#666"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px'
            }}
            formatter={(value) => [Math.round(value).toLocaleString(), 'Deaths']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Deaths"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DrugChart;

