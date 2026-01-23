import { Link } from 'react-router-dom';
import { format, isToday, parseISO } from 'date-fns';
import { Calendar, Clock, ChevronRight, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScheduleSection({ bookings = [], onComplete, onCancel, maxItems = 3 }) {
    const { t } = useTranslation();

    // Filter for upcoming/scheduled and today's bookings
    const upcomingBookings = bookings
        .filter(b => {
            const date = parseISO(b.appointment_date);
            return !isNaN(date.getTime()) && b.status === 'scheduled';
        })
        .sort((a, b) => new Date(a.appointment_date + 'T' + a.appointment_time) - new Date(b.appointment_date + 'T' + b.appointment_time))
        .slice(0, maxItems);

    if (upcomingBookings.length === 0) return null;

    return (
        <div className="px-4 mt-8 mb-10">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">
                    {t('dashboard.schedule', 'Today\'s Schedule')}
                </h2>
                <Link to="/dashboard/bookings" className="flex items-center gap-1 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                    {t('dashboard.viewAll', 'View All')}
                    <ChevronRight size={12} strokeWidth={3} />
                </Link>
            </div>

            <div className="space-y-4">
                {upcomingBookings.map((booking) => {
                    const isTodayBooking = isToday(parseISO(booking.appointment_date));

                    return (
                        <div
                            key={booking.id}
                            className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-md flex flex-col gap-4 active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isTodayBooking ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400'}`}>
                                        <Calendar size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 mb-1 leading-none">
                                            {booking.client_name}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-gray-400" />
                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                                    {booking.appointment_time}
                                                </span>
                                            </div>
                                            {booking.service_cost && (
                                                <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg">
                                                    <span className="text-[11px] font-black text-green-600">R{booking.service_cost}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${isTodayBooking ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                                        {isTodayBooking ? t('common.today', 'Today') : format(parseISO(booking.appointment_date), 'MMM dd')}
                                    </span>
                                    <span className="text-[11px] font-bold text-gray-500 italic max-w-[100px] truncate">
                                        {booking.service}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                                <button
                                    onClick={() => onComplete?.(booking)}
                                    className="flex-1 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[11px] tracking-widest shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all"
                                >
                                    <Check size={18} strokeWidth={4} />
                                    Complete
                                </button>
                                <button
                                    onClick={() => onCancel?.(booking)}
                                    className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
