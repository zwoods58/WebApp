import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = {
  income: ['#67C4A7', '#86D9C1', '#A5EEDB', '#C4F3F5'], // Brand success greens
  expense: ['#FF9B9B', '#FFB4B4', '#FFCDCD', '#FFE6E6'], // Brand warning corals
  neutral: ['#A8D5E2', '#BDE3EE', '#D2F1FA', '#E7F9FF'], // Brand blues
};

export default function CategoryBreakdown({ categories, title, type = 'income' }) {
  const { t } = useTranslation();

  if (!categories || categories.length === 0) {
    return null;
  }

  // Handle both data formats (array of {name, income, expense} or just {name, value})
  const chartData = categories
    .map(c => ({
      name: c.name,
      value: c.value || (type === 'expense' ? c.expense : c.income) || 0
    }))
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) return null;

  const activeColors = COLORS[type] || COLORS.neutral;

  // Calculate total for percentage calculations
  const total = chartData.reduce((sum, c) => sum + c.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100">
          <p className="font-bold text-gray-900 mb-1">{payload[0].name}</p>
          <p className="text-sm font-black text-blue-500">R{value.toLocaleString()}</p>
          <p className="text-xs font-bold text-gray-400 mt-1">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-slide-up">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mx-4">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            {title || (type === 'expense' ? t('reports.expenseBreakdown', 'Expense Breakdown') : t('reports.incomeBreakdown', 'Income Sources'))}
          </h3>
          <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${type === 'expense' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
            {type === 'expense' ? 'Spending' : 'Value'}
          </div>
        </div>

        <div className="h-[280px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={8}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-xl font-black text-gray-900">
              R{chartData.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="mt-8 space-y-3">
          {chartData.slice(0, 5).map((cat, index) => {
            const percentage = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={cat.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-white">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeColors[index % activeColors.length] }} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 truncate max-w-[150px]">{cat.name}</span>
                    <span className="text-[10px] font-bold text-gray-400">{percentage}%</span>
                  </div>
                </div>
                <span className="text-sm font-black text-gray-900">R{cat.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
