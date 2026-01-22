import Card from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard Component - Displays financial statistics
 * 
 * Optimized for:
 * - Large, readable numbers
 * - Color-coded borders
 * - Optional trend indicators
 */

export default function StatCard({
  label,
  value,
  type = 'neutral', // 'income', 'expense', 'neutral'
  trend,
  trendLabel,
  onClick,
  className = '',
}) {
  const variant = type === 'income' ? 'stat-income' : 
                  type === 'expense' ? 'stat-expense' : 
                  'stat-info';
  
  const valueColorClass = type === 'income' ? 'text-success-600' :
                          type === 'expense' ? 'text-danger-600' :
                          'text-neutral-800';
  
  // Format currency
  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `R${(absAmount / 1000000).toFixed(1)}M`;
    } else if (absAmount >= 1000) {
      return `R${(absAmount / 1000).toFixed(1)}K`;
    }
    return `R${absAmount.toFixed(2)}`;
  };
  
  const formattedValue = typeof value === 'number' ? formatCurrency(value) : value;
  
  return (
    <Card 
      variant={variant}
      hoverable={!!onClick}
      onClick={onClick}
      className={className}
    >
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${valueColorClass}`}>
        {formattedValue}
      </div>
      
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-small">
          {trend > 0 && (
            <>
              <TrendingUp size={16} className="text-success-600" />
              <span className="text-success-600">+{trend}%</span>
            </>
          )}
          {trend < 0 && (
            <>
              <TrendingDown size={16} className="text-danger-600" />
              <span className="text-danger-600">{trend}%</span>
            </>
          )}
          {trend === 0 && (
            <>
              <Minus size={16} className="text-neutral-500" />
              <span className="text-neutral-600">0%</span>
            </>
          )}
          {trendLabel && <span className="text-neutral-600">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
}


