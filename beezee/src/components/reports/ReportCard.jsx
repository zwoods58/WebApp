import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ReportCard({ title, amount, icon, color = 'primary', highlight = false, trend = null }) {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      amount: 'text-green-600',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      amount: 'text-red-600',
    },
    primary: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      text: 'text-primary-600',
      amount: 'text-primary-600',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`card ${colors.bg} ${colors.border} ${highlight ? 'ring-2 ring-primary-400' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.amount}`}>
            R{amount.toFixed(2)}
          </p>
        </div>
        <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-sm">
          {trend > 0 ? (
            <>
              <ArrowUp size={16} className="text-green-500" />
              <span className="text-green-600 font-medium">+{trend}%</span>
            </>
          ) : (
            <>
              <ArrowDown size={16} className="text-red-500" />
              <span className="text-red-600 font-medium">{trend}%</span>
            </>
          )}
          <span className="text-gray-500 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
}


