import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function TrendChart({ data, title }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return null;
  }

  // Format data for chart with net profit and percentage growth
  const chartData = data.map((item, index) => {
    const income = Number(item.income) || 0;
    const expenses = Number(item.expense || item.expenses) || 0;
    const netProfit = income - expenses;
    
    // Calculate percentage growth from previous day
    let growthPercentage = 0;
    if (index > 0) {
      const prevIncome = Number(data[index - 1].income) || 0;
      const prevExpenses = Number(data[index - 1].expense || data[index - 1].expenses) || 0;
      const prevNetProfit = prevIncome - prevExpenses;
      if (prevNetProfit !== 0) {
        growthPercentage = ((netProfit - prevNetProfit) / Math.abs(prevNetProfit)) * 100;
      } else if (netProfit > 0) {
        growthPercentage = 100;
      }
    }
    
    return {
      date: format(parseISO(item.date), 'dd MMM'),
      income,
      expenses,
      netProfit,
      growthPercentage: Math.round(growthPercentage * 10) / 10, // Round to 1 decimal
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const netProfitEntry = payload.find(p => p.dataKey === 'netProfit');
      const growthEntry = chartData.find(d => d.date === label);
      
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 min-w-[160px]">
          <p className="font-black text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'netProfit') return null; // Skip net profit from main list
            return (
              <div key={index} className="flex items-center justify-between gap-4 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-50" style={{ color: entry.color }}>
                  {entry.name}
                </span>
                <span className="text-sm font-black text-gray-900">
                  R{Math.abs(entry.value).toLocaleString()}
                </span>
              </div>
            );
          })}
          {netProfitEntry && (
            <div className="flex items-center justify-between gap-4 mb-1 pt-2 border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-50" style={{ color: netProfitEntry.color }}>
                Net Profit
              </span>
              <span className={`text-sm font-black ${netProfitEntry.value >= 0 ? 'text-[#67C4A7]' : 'text-[#FF9B9B]'}`}>
                R{Math.abs(netProfitEntry.value).toLocaleString()}
              </span>
            </div>
          )}
          {growthEntry && growthEntry.growthPercentage !== 0 && (
            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Growth
              </span>
              <span className={`text-xs font-black ${growthEntry.growthPercentage >= 0 ? 'text-[#67C4A7]' : 'text-[#FF9B9B]'}`}>
                {growthEntry.growthPercentage >= 0 ? '+' : ''}{growthEntry.growthPercentage}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mx-2 animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          {title || t('reports.cashFlow', 'Cash Flow')}
        </h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#67C4A7]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Income</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#FF9B9B]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expenses</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#A8D5E2]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Net Profit</span>
          </div>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="5%" stopColor="#67C4A7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#67C4A7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="5%" stopColor="#FF9B9B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF9B9B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNetProfit" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="5%" stopColor="#A8D5E2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A8D5E2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Income"
              stroke="#67C4A7" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses"
              stroke="#FF9B9B" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorExpense)" 
            />
            <Area 
              type="monotone" 
              dataKey="netProfit" 
              name="Net Profit"
              stroke="#A8D5E2" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fillOpacity={0} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
