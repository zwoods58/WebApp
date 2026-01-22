import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, addWeeks, subWeeks, isSameDay, isWithinInterval } from 'date-fns';

/**
 * Custom Date Range Picker Component
 * Allows users to select custom date ranges for report filtering
 */
export default function DateRangePicker({ isOpen, onClose, onApply, initialStartDate, initialEndDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(initialStartDate || null);
  const [selectedEndDate, setSelectedEndDate] = useState(initialEndDate || null);
  const [selectingEnd, setSelectingEnd] = useState(false);

  const quickRanges = [
    {
      label: 'Today',
      getValue: () => {
        const today = new Date();
        return { start: today, end: today };
      }
    },
    {
      label: 'This Week',
      getValue: () => {
        const today = new Date();
        return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
      }
    },
    {
      label: 'Last Week',
      getValue: () => {
        const today = new Date();
        const lastWeek = subWeeks(today, 1);
        return { start: startOfWeek(lastWeek, { weekStartsOn: 1 }), end: endOfWeek(lastWeek, { weekStartsOn: 1 }) };
      }
    },
    {
      label: 'This Month',
      getValue: () => {
        const today = new Date();
        return { start: startOfMonth(today), end: endOfMonth(today) };
      }
    },
    {
      label: 'Last Month',
      getValue: () => {
        const today = new Date();
        const lastMonth = subMonths(today, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      }
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return { start: sevenDaysAgo, end: today };
      }
    },
    {
      label: 'Last 30 Days',
      getValue: () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return { start: thirtyDaysAgo, end: today };
      }
    },
    {
      label: 'Last 90 Days',
      getValue: () => {
        const today = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        return { start: ninetyDaysAgo, end: today };
      }
    }
  ];

  const handleQuickRange = (range) => {
    const { start, end } = range.getValue();
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setSelectingEnd(false);
  };

  const handleDateClick = (date) => {
    if (!selectingEnd) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setSelectingEnd(true);
    } else {
      if (selectedStartDate && date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
      setSelectingEnd(false);
    }
  };

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      onApply(selectedStartDate, selectedEndDate);
      onClose();
    }
  };

  const handleClear = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectingEnd(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateSelected = (date) => {
    if (!selectedStartDate && !selectedEndDate) return false;
    if (selectedStartDate && isSameDay(date, selectedStartDate)) return true;
    if (selectedEndDate && isSameDay(date, selectedEndDate)) return true;
    if (selectedStartDate && selectedEndDate && isWithinInterval(date, { start: selectedStartDate, end: selectedEndDate })) return true;
    return false;
  };

  const isDateStartOrEnd = (date) => {
    if (selectedStartDate && isSameDay(date, selectedStartDate)) return 'start';
    if (selectedEndDate && isSameDay(date, selectedEndDate)) return 'end';
    return false;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="date-range-picker-modal" role="dialog" aria-modal="true">
        <div className="date-picker-header">
          <h3>Select Date Range</h3>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="date-picker-content">
          {/* Quick Ranges */}
          <div className="quick-ranges-section">
            <h4>Quick Select</h4>
            <div className="quick-ranges-grid">
              {quickRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickRange(range)}
                  className="quick-range-button"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="month-nav-button"
              >
                <ChevronLeft size={16} />
              </button>
              <h4>{format(currentMonth, 'MMMM yyyy')}</h4>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="month-nav-button"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="calendar-grid">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="day-header">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div key={index} className="calendar-day-container">
                  {date && (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`calendar-day ${isDateSelected(date) ? 'selected' : ''} ${isDateStartOrEnd(date) ? `date-${isDateStartOrEnd(date)}` : ''}`}
                    >
                      {format(date, 'd')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Range Display */}
          <div className="selected-range-display">
            <div className="range-inputs">
              <div className="range-input">
                <label>Start Date</label>
                <div className="date-display">
                  {selectedStartDate ? format(selectedStartDate, 'MMM dd, yyyy') : 'Select start date'}
                </div>
              </div>
              <div className="range-separator">-</div>
              <div className="range-input">
                <label>End Date</label>
                <div className="date-display">
                  {selectedEndDate ? format(selectedEndDate, 'MMM dd, yyyy') : 'Select end date'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="date-picker-actions">
            <button onClick={handleClear} className="clear-button">
              Clear
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedStartDate || !selectedEndDate}
              className="apply-button"
            >
              <Check size={16} />
              Apply Range
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
