import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle, ChevronLeft, Edit, Download, X, MapPin, Phone } from 'lucide-react';
import { format, isPast, isToday, isFuture, parseISO, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import SwipeToRefresh from '../components/SwipeToRefresh';
import FloatingNavBar from '../components/FloatingNavBar';
import AddBookingModal from '../components/AddBookingModal';
import AddTaskModal from '../components/AddTaskModal';
import { useTranslation } from 'react-i18next';
import EmptyState from '../components/EmptyState';
import BeeZeeLogo from '../components/BeeZeeLogo';

export default function Bookings() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, today
  const [view, setView] = useState('bookings'); // bookings, tasks
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user) {
      loadBookings();
      loadTasks();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {}
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm(t('bookings.confirmDelete', 'Delete this booking?'))) return;
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      setBookings(bookings.filter((b) => b.id !== id));
      toast.success(t('bookings.deleted', 'Deleted'));
    } catch (error) {
      toast.error(t('bookings.deleteFailed', 'Failed'));
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)));
      toast.success(t('tasks.completed', 'Completed'));
    } catch (error) {
      toast.error(t('tasks.completeFailed', 'Failed'));
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.appointment_time}`);
    if (filter === 'today') return isToday(appointmentDateTime);
    if (filter === 'upcoming') return isFuture(appointmentDateTime) || isToday(appointmentDateTime);
    if (filter === 'past') return isPast(appointmentDateTime) && !isToday(appointmentDateTime);
    return true;
  });

  const filteredTasks = tasks.filter((task) => {
    if (task.completed && filter !== 'all') return false;
    if (filter === 'all') return true;
    if (!task.due_date) return filter === 'upcoming';
    const dueDate = parseISO(task.due_date);
    if (filter === 'today') return isToday(dueDate);
    if (filter === 'upcoming') return isFuture(dueDate) || isToday(dueDate);
    if (filter === 'past') return isPast(dueDate) && !isToday(dueDate);
    return true;
  });

  const groupedBookings = filteredBookings.reduce((groups, booking) => {
    const date = booking.appointment_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(booking);
    return groups;
  }, {});

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = task.due_date || 'No Due Date';
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  return (
    <SwipeToRefresh onRefresh={async () => { await loadBookings(); await loadTasks(); }}>
      <div className="bookings-container pb-24">
        {/* Modern Header */}
        <div className="reports-header-section pt-4">
          <div className="px-4 pb-2">
            <BeeZeeLogo />
          </div>
          <div className="reports-title-row">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-400">
                <ChevronLeft size={24} strokeWidth={3} />
              </button>
              <h1 className="reports-title">{view === 'bookings' ? t('bookings.title', 'Bookings') : t('tasks.title', 'Tasks')}</h1>
            </div>
            <button
              onClick={() => (view === 'bookings' ? setIsBookingModalOpen(true) : setIsTaskModalOpen(true))}
              className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>

          {/* View Tabs */}
          <div className="reports-tabs-container">
            <button
              onClick={() => setView('bookings')}
              className={`reports-tab-button ${view === 'bookings' ? 'active' : ''}`}
            >
              <Calendar size={16} strokeWidth={3} />
              {t('bookings.title', 'Bookings')}
            </button>
            <button
              onClick={() => setView('tasks')}
              className={`reports-tab-button ${view === 'tasks' ? 'active' : ''}`}
            >
              <CheckCircle2 size={16} strokeWidth={3} />
              {t('tasks.title', 'Tasks')}
            </button>
          </div>

          {/* Filter Scroll */}
          <div className="date-range-scroll">
            {['all', 'today', 'upcoming', 'past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`date-range-pill ${filter === f ? 'active' : ''}`}
              >
                {t(`common.${f}`, f.charAt(0).toUpperCase() + f.slice(1))}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="px-4 mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
            </div>
          ) : (view === 'bookings' ? filteredBookings : filteredTasks).length === 0 ? (
            <EmptyState
              type={view === 'bookings' ? 'bookings' : 'tasks'}
              title={view === 'bookings' ? t('bookings.noBookings', 'No Bookings') : t('tasks.noTasks', 'No Tasks')}
              description={t('common.noDataDesc', 'Everything is clear for now.')}
              actionLabel={t('common.add', 'Add New')}
              onAction={() => view === 'bookings' ? setIsBookingModalOpen(true) : setIsTaskModalOpen(true)}
            />
          ) : (
            <div className="space-y-8 pb-10">
              {Object.entries(view === 'bookings' ? groupedBookings : groupedTasks).map(([date, items]) => (
                <div key={date} className="space-y-4 animate-slide-up">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      {date === 'No Due Date' ? 'Someday' : isToday(new Date(date)) ? t('common.today', 'Today') : format(new Date(date), 'EEEE, MMM dd')}
                    </h3>
                    <div className="h-[1px] flex-1 bg-gray-50 ml-4" />
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white p-5 rounded-[28px] border border-gray-50 shadow-sm transition-all ${item.completed ? 'opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${view === 'bookings' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                              {view === 'bookings' ? <Calendar size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-gray-900 mb-0.5">{item.client_name || item.title}</h3>
                              <div className="flex items-center gap-2">
                                <Clock size={10} className="text-gray-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {view === 'bookings' ? item.appointment_time : (item.due_time || 'No time')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {view === 'tasks' && !item.completed && (
                              <button onClick={() => handleCompleteTask(item.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-full">
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                            <button onClick={() => view === 'bookings' ? setEditingBooking(item) : setEditingTask(item)} className="p-2 text-gray-300 hover:text-gray-900">
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>

                        {view === 'bookings' && (
                          <div className="grid grid-cols-1 gap-2">
                            {item.service && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('common.service', 'Service')}</span>
                                <span className="text-xs font-bold text-gray-700">{item.service}</span>
                              </div>
                            )}
                            {item.location && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                                <MapPin size={12} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">{item.location}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <FloatingNavBar />
        <AddBookingModal isOpen={isBookingModalOpen} onClose={() => { setIsBookingModalOpen(false); setEditingBooking(null); }} onSubmit={loadBookings} initialData={editingBooking} />
        <AddTaskModal isOpen={isTaskModalOpen} onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }} onSubmit={loadTasks} initialData={editingTask} />
      </div>
    </SwipeToRefresh>
  );
}
