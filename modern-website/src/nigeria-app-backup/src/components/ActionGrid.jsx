export default function ActionGrid({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm 
                     flex flex-col items-center gap-3 active:scale-95 transition-transform
                     ${action.hidden ? 'voice-recorder-hidden' : ''}
                     ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.bgColor} ${action.textColor}`}>
            {action.icon}
          </div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
