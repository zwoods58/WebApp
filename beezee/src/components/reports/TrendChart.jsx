import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export default function TrendChart({ data, period }) {
  if (!data || data.length === 0) {
    return null;
  }

  // Format data for chart
  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    income: item.income || 0,
    expenses: item.expenses || 0,
    profit: (item.income || 0) - (item.expenses || 0),
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Daily Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => `R${value.toFixed(2)}`}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Money In"
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Money Out"
            dot={{ fill: '#EF4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#F59E0B" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Profit/Loss"
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
          <p className="text-xs text-gray-600">Money In</p>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
          <p className="text-xs text-gray-600">Money Out</p>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-primary-500 rounded-full mx-auto mb-1"></div>
          <p className="text-xs text-gray-600">Profit/Loss</p>
        </div>
      </div>
    </div>
  );
}


