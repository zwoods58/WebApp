import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateGrowthRate } from '../../utils/reportHelpers';

export default function ReportCard({ 
  title, 
  amount, 
  type = 'neutral', 
  isFullWidth = false, 
  isCurrency = true, 
  transactionCount = null,
  previousAmount = null // For calculating growth percentage
}) {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  const isProfit = type === 'profit';

  const getColors = () => {
    if (isIncome) return { bg: '#F0FDF4', accent: '#166534', iconBg: '#BBF7D0' };
    if (isExpense) return { bg: '#FEF2F2', accent: '#991B1B', iconBg: '#FECACA' };
    if (isProfit) return { bg: '#F8FBFF', accent: '#2C2C2E', iconBg: '#E0F2FE' };
    return { bg: 'white', accent: '#2C2C2E', iconBg: '#F1F5F9' };
  };

  const colors = getColors();
  
  // Calculate growth percentage if previous amount is provided
  const growth = previousAmount !== null && previousAmount !== undefined 
    ? calculateGrowthRate(amount || 0, previousAmount)
    : null;

  return (
    <div 
      className={`report-card ${isFullWidth ? 'full-width' : ''} animate-slide-up`}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="report-card-label" style={{ color: colors.accent }}>{title}</span>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.iconBg, color: colors.accent }}>
            {isIncome ? <TrendingUp size={16} /> : isExpense ? <TrendingDown size={16} /> : <Minus size={16} />}
          </div>
        </div>
        <div className="report-card-amount" style={{ color: colors.accent }}>
          {isCurrency ? 'R' : ''}
          {Number(amount || 0).toLocaleString(undefined, { 
            minimumFractionDigits: isCurrency ? 2 : 0, 
            maximumFractionDigits: isCurrency ? 2 : 0 
          })}
        </div>
        <div className="flex items-center justify-between mt-1">
          {transactionCount !== null && (
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: colors.accent }}>
              {transactionCount} Transactions
            </div>
          )}
          {growth && (
            <div className={`flex items-center gap-1 text-[10px] font-black ${growth.isPositive ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
              {growth.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{growth.formatted}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
