import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DrugChart({ data, selectedDrug }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
          <XAxis 
            dataKey="label" 
            angle={-45}
            textAnchor="end"
            height={100}
            interval={Math.max(0, Math.floor(data.length / 15))}
            stroke="rgba(255, 255, 255, 0.8)"
            tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.9)' }}
          />
          <YAxis 
            label={{ 
              value: 'Number of Deaths', 
              angle: -90, 
              position: 'left',
              offset: 10,
              style: { 
                fill: 'rgba(255, 255, 255, 0.9)', 
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                textAnchor: 'middle'
              }
            }}
            stroke="rgba(255, 255, 255, 0.8)"
            tick={{ fill: 'rgba(255, 255, 255, 0.9)' }}
            width={50}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              color: '#ffffff',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
            }}
            labelStyle={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: '600' }}
            formatter={(value) => [Math.round(value).toLocaleString(), 'Deaths']}
          />
          <Legend 
            wrapperStyle={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              paddingTop: '10px',
              paddingBottom: '0px'
            }}
            verticalAlign="top"
            height={36}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#ffffff" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#ffffff', strokeWidth: 2, stroke: 'rgba(102, 126, 234, 0.5)' }}
            activeDot={{ r: 7, fill: '#ffffff', strokeWidth: 3, stroke: '#667eea' }}
            name="Deaths"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DrugChart;

