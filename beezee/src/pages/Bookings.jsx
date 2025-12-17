import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle, ChevronLeft, User, Phone, Mail, MapPin, X, Edit, WifiOff, Download } from 'lucide-react';
import { format, isPast, isToday, isFuture, parseISO, startOfDay, addDays, addWeeks, addMonths, differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';
import SwipeToRefresh from '../components/SwipeToRefresh';
import FloatingNavBar from '../components/FloatingNavBar';
import AddBookingModal from '../components/AddBookingModal';
import AddTaskModal from '../components/AddTaskModal';
import { useOfflineStore } from '../store/offlineStore';
import { useTranslation } from 'react-i18next';

export default function Bookings() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { isOnline, syncPending } = useOfflineStore();
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
      toast.error(t('common.noData', 'Failed to load bookings'));
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
        .order('due_date', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Don't show error toast for tasks as it's optional
    }
  };

  const handleRefresh = async () => {
    await Promise.all([loadBookings(), loadTasks()]);
  };

  const exportTaskToICS = (task) => {
    const title = task.title || 'Task';
    const date = task.due_date || format(new Date(), 'yyyy-MM-dd');
    const startTime = (task.due_time || '09:00').replace(':','');
    const endTimeStr = (task.due_time ? task.due_time : '10:00').replace(':','');
    const start = `${date}T${startTime}00`;
    const endTime = `${date}T${endTimeStr}00`;
    const description = task.description || '';
    const uid = `${task.id || Date.now()}@beezee`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BeeZee//Tasks//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `SUMMARY:${title}`,
      `DTSTART:${start}`,
      `DTEND:${endTime}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-${task.id || 'event'}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBookingToICS = (booking) => {
    const title = booking.service ? `${booking.client_name || 'Client'} - ${booking.service}` : booking.client_name || 'Booking';
    const start = `${booking.appointment_date}T${(booking.appointment_time || '09:00').replace(':', '')}00`;
    const endTime = (() => {
      if (!booking.appointment_time) return `${booking.appointment_date}T100000`;
      const [h, m] = booking.appointment_time.split(':').map(Number);
      const dateObj = new Date(`${booking.appointment_date}T${booking.appointment_time}:00`);
      dateObj.setHours(h, m + 60, 0, 0);
      const hh = `${dateObj.getHours()}`.padStart(2, '0');
      const mm = `${dateObj.getMinutes()}`.padStart(2, '0');
      return `${booking.appointment_date}T${hh}${mm}00`;
    })();
    const description = booking.notes || '';
    const location = booking.location || '';
    const uid = `${booking.id || Date.now()}@beezee`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BeeZee//Bookings//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `SUMMARY:${title}`,
      `DTSTART:${start}`,
      `DTEND:${endTime}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.id || 'event'}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completeOverdueTasks = async () => {
    const now = startOfDay(new Date());
    const overdueIds = tasks
      .filter((t) => !t.completed && t.due_date && isPast(startOfDay(parseISO(t.due_date))) && !isToday(parseISO(t.due_date)))
      .map((t) => t.id);
    if (!overdueIds.length) return;
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .in('id', overdueIds);
      if (error) throw error;
      setTasks(tasks.map((t) => overdueIds.includes(t.id) ? { ...t, completed: true, completed_at: new Date().toISOString() } : t));
      toast.success(t('tasks.overdueCompleted', 'Overdue tasks marked as complete.'));
    } catch (error) {
      console.error('Error completing overdue tasks:', error);
      toast.error(t('tasks.completeFailed', 'Failed to complete overdue tasks'));
    }
  };

  const deleteCompletedTasks = async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (!completedIds.length) return;
    if (!confirm(t('tasks.confirmDeleteCompleted', 'Delete all completed tasks?'))) return;
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedIds);
      if (error) throw error;
      setTasks(tasks.filter((t) => !completedIds.includes(t.id)));
      toast.success(t('tasks.completedDeleted', 'Completed tasks deleted.'));
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
      toast.error(t('tasks.deleteFailed', 'Failed to delete completed tasks'));
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm(t('bookings.confirmDelete', 'Are you sure you want to delete this booking?'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBookings(bookings.filter((b) => b.id !== id));
      toast.success(t('bookings.deleted', 'Booking deleted'));
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error(t('bookings.deleteFailed', 'Failed to delete booking'));
    }
  };

  const handleDeleteCompletedBookings = async () => {
    const completedIds = bookings.filter((b) => {
      const dt = parseISO(`${b.appointment_date}T${b.appointment_time || '00:00'}`);
      return isPast(dt);
    }).map((b) => b.id);
    if (!completedIds.length) return;
    if (!confirm(t('bookings.confirmDeletePast', 'Delete all past bookings?'))) return;
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .in('id', completedIds);
      if (error) throw error;
      setBookings(bookings.filter((b) => !completedIds.includes(b.id)));
      toast.success(t('bookings.pastDeleted', 'Past bookings deleted.'));
    } catch (error) {
      console.error('Error deleting past bookings:', error);
      toast.error(t('bookings.deletePastFailed', 'Failed to delete past bookings'));
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
      toast.success(t('tasks.completed', 'Task completed'));
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error(t('tasks.completeFailed', 'Failed to complete task'));
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm(t('tasks.confirmDelete', 'Are you sure you want to delete this task?'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(tasks.filter((t) => t.id !== id));
      toast.success(t('tasks.deleted', 'Task deleted'));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(t('tasks.deleteFailed', 'Failed to delete task'));
    }
  };

  const handleAddBooking = async (bookingData) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setBookings([...bookings, data]);
      setIsBookingModalOpen(false);
      toast.success(t('bookings.added', 'Booking added successfully!'));
    } catch (error) {
      console.error('Error adding booking:', error);
      toast.error(t('bookings.addFailed', 'Failed to add booking'));
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTasks([...tasks, data]);
      setIsTaskModalOpen(false);
      toast.success(t('tasks.added', 'Task added successfully!'));
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(t('tasks.addFailed', 'Failed to add task'));
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    try {
      const { id, user_id, created_at, ...updateData } = bookingData;
      
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', editingBooking.id)
        .select()
        .single();

      if (error) throw error;

      setBookings(bookings.map((b) => (b.id === editingBooking.id ? data : b)));
      setEditingBooking(null);
      setIsBookingModalOpen(false);
      toast.success(t('bookings.updated', 'Booking updated successfully!'));
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error(t('bookings.updateFailed', 'Failed to update booking'));
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const { id, user_id, created_at, completed_at, ...updateData } = taskData;
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', editingTask.id)
        .select()
        .single();

      if (error) throw error;

      setTasks(tasks.map((t) => (t.id === editingTask.id ? data : t)));
      setEditingTask(null);
      setIsTaskModalOpen(false);
      toast.success(t('tasks.updated', 'Task updated successfully!'));
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(t('tasks.updateFailed', 'Failed to update task'));
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsBookingModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    
    const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.appointment_time}`);
    
    if (filter === 'today') return isToday(appointmentDateTime);
    if (filter === 'upcoming') return isFuture(appointmentDateTime) || isToday(appointmentDateTime);
    if (filter === 'past') return isPast(appointmentDateTime) && !isToday(appointmentDateTime);
    
    return true;
  });

  // Filter tasks
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

  const getBookingStatus = (booking) => {
    const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.appointment_time}`);
    
    if (isPast(appointmentDateTime) && !isToday(appointmentDateTime)) {
      return { label: t('common.past', 'Past'), icon: CheckCircle2, color: 'text-gray-500' };
    }
    if (isToday(appointmentDateTime)) {
      return { label: t('common.today', 'Today'), icon: AlertCircle, color: 'text-orange-500' };
    }
    return { label: t('common.upcoming', 'Upcoming'), icon: Clock, color: 'text-blue-500' };
  };

  // Group bookings by date
  const groupedBookings = filteredBookings.reduce((groups, booking) => {
    const date = booking.appointment_date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {});

  // Group tasks by date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = task.due_date || 'No Due Date';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="spinner"></div>
        </div>
        <FloatingNavBar />
      </div>
    );
  }

  return (
    <SwipeToRefresh onRefresh={handleRefresh}>
      <div className="bookings-container">
        <div className="space-y-6">
          {/* Header */}
          <div className="bookings-header">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
                aria-label={t('common.back', 'Go back')}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {view === 'bookings' ? t('bookings.title', 'Bookings') : t('tasks.title', 'Tasks')}
                </h1>
                <p className="text-gray-600">
                  {view === 'bookings' 
                    ? `${filteredBookings.length} ${t('common.total', 'total')}`
                    : `${filteredTasks.length} ${t('common.total', 'total')} ${t('tasks.title', 'tasks')}`
                  }
                </p>
              </div>
              <button
                onClick={() => (view === 'bookings' ? setIsBookingModalOpen(true) : setIsTaskModalOpen(true))}
                className="btn btn-primary flex items-center gap-2"
                aria-label={view === 'bookings' ? t('bookings.addBooking', 'Add booking') : t('tasks.addTask', 'Add task')}
              >
                <Plus size={18} />
                {view === 'bookings' ? t('common.add', 'Add') : t('common.add', 'Add')}
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {view === 'tasks' && filteredTasks.length > 0 && (
            <div className="flex justify-end gap-3 mx-4">
              <button onClick={completeOverdueTasks} className="text-sm text-gray-700 underline hover:text-gray-900">
                {t('tasks.completeOverdue', 'Complete all overdue tasks')}
              </button>
              <button onClick={deleteCompletedTasks} className="text-sm text-gray-700 underline hover:text-gray-900">
                {t('tasks.deleteCompleted', 'Delete completed tasks')}
              </button>
            </div>
          )}

          {view === 'bookings' && filteredBookings.length > 0 && (
            <div className="flex justify-end gap-3 mx-4">
              <button onClick={handleDeleteCompletedBookings} className="text-sm text-gray-700 underline hover:text-gray-900">
                {t('bookings.deletePast', 'Delete past bookings')}
              </button>
            </div>
          )}

          {/* View Toggle */}
          <div className="bookings-view-toggle">
            <button
              onClick={() => setView('bookings')}
              className={`bookings-view-button ${view === 'bookings' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              {t('bookings.title', 'Bookings')}
            </button>
            <button
              onClick={() => setView('tasks')}
              className={`bookings-view-button ${view === 'tasks' ? 'active' : ''}`}
            >
              <AlertCircle size={18} />
              {t('tasks.title', 'Tasks')}
            </button>
          </div>

          {/* Filters */}
          <div className="bookings-filters">
            <button
              onClick={() => setFilter('all')}
              className={`bookings-filter-button ${filter === 'all' ? 'active' : ''}`}
            >
              {t('common.all', 'All')}
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`bookings-filter-button ${filter === 'today' ? 'active' : ''}`}
            >
              {t('common.today', 'Today')}
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`bookings-filter-button ${filter === 'upcoming' ? 'active' : ''}`}
            >
              {t('common.upcoming', 'Upcoming')}
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`bookings-filter-button ${filter === 'past' ? 'active' : ''}`}
            >
              {t('common.past', 'Past')}
            </button>
          </div>

          {/* Content */}
          {view === 'bookings' ? (
            filteredBookings.length === 0 ? (
              <div className="bookings-empty-state">
                <Calendar size={64} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">{t('bookings.noBookings', 'No bookings yet')}</p>
                <button onClick={() => setIsBookingModalOpen(true)} className="btn btn-primary">
                  <Plus size={20} className="inline mr-2" />
                  {t('bookings.addBooking', 'Add Booking')}
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {Object.entries(groupedBookings).map(([date, dateBookings]) => (
                  <div key={date} className="booking-date-group">
                    <h3 className="booking-date-label">
                      {date === 'No Due Date' ? t('common.noDueDate', 'No Due Date') : format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                    </h3>
                    <div className="space-y-2">
                      {dateBookings.map((booking) => {
                        const status = getBookingStatus(booking);
                        const StatusIcon = status.icon;
                        const appointmentDateTime = parseISO(`${booking.appointment_date}T${booking.appointment_time}`);

                        return (
                          <div key={booking.id} className="booking-card">
                            <div className="booking-card-header">
                              <div className="booking-card-title-section">
                                <div className="booking-card-icon">
                                  <Calendar size={20} />
                                </div>
                                <div className="booking-card-title-content">
                                  <h3 className="booking-card-title">{booking.client_name || 'Client'}</h3>
                                  <div className="booking-card-status">
                                    <StatusIcon size={14} className={status.color} />
                                    <span className={status.color}>{status.label}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="booking-card-actions">
                                <button
                                  onClick={() => handleEditBooking(booking)}
                                  className="booking-card-action-button"
                                  aria-label={t('common.edit', 'Edit')}
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  className="booking-card-delete"
                                  aria-label={t('common.delete', 'Delete')}
                                >
                                  <X size={18} />
                                </button>
                                <button
                                  onClick={() => exportBookingToICS(booking)}
                                  className="booking-card-action-button"
                                  aria-label="Export"
                                >
                                  <Download size={18} />
                                </button>
                              </div>
                            </div>

                            <div className="booking-card-details">
                              <div className="booking-detail-item">
                                <Clock size={16} className="booking-detail-icon" />
                                <span>{format(appointmentDateTime, 'EEEE, MMMM dd, yyyy')}</span>
                                <span className="booking-detail-time">{format(appointmentDateTime, 'h:mm a')}</span>
                              </div>

                              {booking.service && (
                                <div className="booking-detail-item">
                                  <span className="booking-detail-label">{t('common.service', 'Service')}:</span>
                                  <span>{booking.service}</span>
                                </div>
                              )}

                              {booking.location && (
                                <div className="booking-detail-item">
                                  <MapPin size={16} className="booking-detail-icon" />
                                  <span>{booking.location}</span>
                                </div>
                              )}

                              {booking.client_phone && (
                                <div className="booking-detail-item">
                                  <Phone size={16} className="booking-detail-icon" />
                                  <span>{booking.client_phone}</span>
                                </div>
                              )}

                              {booking.notes && (
                                <div className="booking-detail-item">
                                  <span className="booking-detail-label">{t('common.notes', 'Notes')}:</span>
                                  <span className="booking-notes">{booking.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredTasks.length === 0 ? (
              <div className="bookings-empty-state">
                <AlertCircle size={64} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">{t('tasks.noTasks', 'No tasks yet')}</p>
                <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary">
                  <Plus size={20} className="inline mr-2" />
                  {t('tasks.addTask', 'Add Task')}
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {Object.entries(groupedTasks).map(([date, dateTasks]) => (
                  <div key={date} className="booking-date-group">
                    <h3 className="booking-date-label">
                      {date === 'No Due Date' ? t('common.noDueDate', 'No Due Date') : format(new Date(date), 'EEEE, MMMM dd, yyyy')}
                    </h3>
                    <div className="space-y-2">
                      {dateTasks.map((task) => {
                        const dueDate = task.due_date ? parseISO(task.due_date) : null;
                        const isOverdue = dueDate && isPast(startOfDay(dueDate)) && !isToday(startOfDay(dueDate)) && !task.completed;
                        const taskDateTime = task.due_date && task.due_time ? parseISO(`${task.due_date}T${task.due_time}`) : null;

                        return (
                          <div key={task.id} className={`booking-card ${task.completed ? 'task-completed' : ''} ${isOverdue ? 'task-overdue' : ''}`}>
                            <div className="booking-card-header">
                              <div className="booking-card-title-section">
                                <div className="booking-card-icon">
                                  <AlertCircle size={20} />
                                </div>
                                <div className="booking-card-title-content">
                                  <h3 className="booking-card-title">{task.title}</h3>
                                  {taskDateTime && (
                                    <div className="booking-card-status">
                                      <Clock size={14} className={isOverdue ? 'text-red-500' : 'text-gray-500'} />
                                      <span className={isOverdue ? 'text-red-500' : 'text-gray-500'}>
                                        {format(taskDateTime, 'MMM dd, yyyy h:mm a')}
                                      </span>
                                    </div>
                                  )}
                                  {!taskDateTime && dueDate && (
                                    <div className="booking-card-status">
                                      <Clock size={14} className={isOverdue ? 'text-red-500' : 'text-gray-500'} />
                                      <span className={isOverdue ? 'text-red-500' : 'text-gray-500'}>
                                        {format(dueDate, 'MMM dd, yyyy')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="booking-card-actions">
                                {!task.completed && (
                                  <button
                                    onClick={() => handleCompleteTask(task.id)}
                                    className="booking-card-action-button"
                                    aria-label={t('tasks.complete', 'Complete')}
                                  >
                                    <CheckCircle2 size={18} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="booking-card-action-button"
                                  aria-label={t('common.edit', 'Edit')}
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="booking-card-delete"
                                  aria-label={t('common.delete', 'Delete')}
                                >
                                  <X size={18} />
                                </button>
                                <button onClick={() => exportTaskToICS(task)} className="booking-card-action-button">
                                  <Download size={18} />
                                </button>
                              </div>
                            </div>

                            {task.description && (
                              <div className="booking-card-details">
                                <p className="booking-notes">{task.description}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <FloatingNavBar />

        {/* Modals */}
        <AddBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setEditingBooking(null);
          }}
          onSubmit={editingBooking ? handleUpdateBooking : handleAddBooking}
          initialData={editingBooking}
        />

        <AddTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialData={editingTask}
        />
      </div>
    </SwipeToRefresh>
  );
}
