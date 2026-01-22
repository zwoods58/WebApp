import { format, isToday } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function GroupedList({ groupedItems, renderItem, emptyMessage }) {
  const { t } = useTranslation();

  if (Object.keys(groupedItems).length === 0) {
    return <p className="text-center text-gray-500 py-10">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-8 pb-10">
      {Object.entries(groupedItems).map(([date, items]) => (
        <div key={date} className="space-y-4 animate-slide-up">
          {/* Date Header */}
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {isToday(new Date(date)) ? t('common.today', 'Today') : format(new Date(date), 'MMMM dd')}
            </h3>
            <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
          </div>
          
          {/* Items */}
          <div className="space-y-3">
            {items.map(renderItem)}
          </div>
        </div>
      ))}
    </div>
  );
}
