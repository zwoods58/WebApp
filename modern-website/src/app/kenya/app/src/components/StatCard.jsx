export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend = null,
  className = ''
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100 text-blue-500',
    orange: 'bg-orange-50 border-orange-100 text-orange-500',
    green: 'bg-green-50 border-green-100 text-green-500',
    red: 'bg-red-50 border-red-100 text-red-500',
  };

  return (
    <div className={`p-5 rounded-[28px] border shadow-sm ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest block opacity-80">
          {label}
        </span>
        {Icon && <Icon size={16} className="opacity-60" />}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-black text-gray-900">{value}</span>
        {trend && (
          <span className={`text-xs font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}
