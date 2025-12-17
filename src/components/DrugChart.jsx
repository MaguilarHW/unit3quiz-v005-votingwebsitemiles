import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DrugChart({ data, selectedDrug }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p style={{ color: '#6b7280' }}>
          No data available to display
        </p>
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
          margin={{ top: 5, right: 30, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="label" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={Math.max(0, Math.floor(data.length / 15))}
            stroke="#6b7280"
            tick={{ fontSize: 11, fill: '#374151' }}
          />
          <YAxis 
            label={{ 
              value: 'Number of Deaths', 
              angle: -90, 
              position: 'left',
              offset: 10,
              style: { 
                fill: '#1e3a8a', 
                fontWeight: '600',
                textAnchor: 'middle'
              }
            }}
            stroke="#6b7280"
            tick={{ fill: '#374151' }}
            width={50}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff',
              border: '2px solid #1e3a8a',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              color: '#1e3a8a'
            }}
            labelStyle={{ color: '#1e3a8a', fontWeight: '700' }}
            formatter={(value) => [Math.round(value).toLocaleString(), 'Deaths']}
          />
          <Legend 
            wrapperStyle={{ 
              color: '#374151', 
              fontWeight: '600',
              paddingTop: '10px',
              paddingBottom: '0px'
            }}
            verticalAlign="top"
            height={36}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#dc2626" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#dc2626', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 7, fill: '#dc2626', strokeWidth: 3, stroke: '#1e3a8a' }}
            name="Deaths"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DrugChart;

