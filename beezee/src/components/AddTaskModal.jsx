import { useState, useRef, useEffect } from 'react';
import { X, AlertCircle, Calendar, Clock, FileText, Mic, Info, Repeat, StopCircle } from 'lucide-react';
import VoiceBookingRecorder from './VoiceBookingRecorder';
import { useTranslation } from 'react-i18next';

/**
 * Add Task Modal Component
 * Bottom sheet modal for adding tasks/reminders
 */
export default function AddTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData = null // For edit mode
}) {
  const isEditMode = !!initialData;
  const { t } = useTranslation();
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [recurrence, setRecurrence] = useState('none'); // none, daily, weekly, monthly
  const [recurrenceUntil, setRecurrenceUntil] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  const priorities = [
    { value: 'low', label: t('common.low', 'Low'), color: 'text-gray-500' },
    { value: 'medium', label: t('common.medium', 'Medium'), color: 'text-blue-500' },
    { value: 'high', label: t('common.high', 'High'), color: 'text-orange-500' },
    { value: 'urgent', label: t('common.urgent', 'Urgent'), color: 'text-red-500' },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode: pre-fill with existing data
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setDueDate(initialData.due_date || '');
        setDueTime(initialData.due_time || '');
        setPriority(initialData.priority || 'medium');
        setRecurrence(initialData.recurrence_frequency || 'none');
        setRecurrenceUntil(initialData.recurrence_until || '');
        setShowVoiceRecorder(false); // disable voice in edit mode
      } else {
        // Add mode: reset to defaults
        setTitle('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setPriority('medium');
        setRecurrence('none');
        setRecurrenceUntil('');
        setShowVoiceRecorder(false);
      }
      
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      // Reset form when closing
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setShowVoiceRecorder(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialData]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.touches ? e.touches[0].clientY : e.clientY);
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = currentY - dragStartY;
    if (diff > 100) {
      onClose();
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      return;
    }
    onSubmit({
      title,
      description: description || null,
      due_date: dueDate || null,
      due_time: dueTime || null,
      priority,
      completed: false,
      recurrence_frequency: recurrence === 'none' ? null : recurrence,
      recurrence_until: recurrenceUntil || null,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  const handleVoiceTaskCreated = async (taskData) => {
    // If we have required fields, save directly
    if (taskData.title) {
      try {
        await onSubmit({
          ...taskData,
          completed: false,
        });
        setShowVoiceRecorder(false);
        onClose();
      } catch (error) {
        console.error('Error saving voice task:', error);
        // Fallback to pre-filling form
        setTitle(taskData.title || '');
        setDescription(taskData.description || '');
        setDueDate(taskData.due_date || '');
        setDueTime(taskData.due_time || '');
        setPriority(taskData.priority || 'medium');
        setShowVoiceRecorder(false);
      }
    } else {
      // Pre-fill form
      setTitle(taskData.title || '');
      setDescription(taskData.description || '');
      setDueDate(taskData.due_date || '');
      setDueTime(taskData.due_time || '');
      setPriority(taskData.priority || 'medium');
      setShowVoiceRecorder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="transaction-entry-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div
          className="modal-drag-handle"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseMove={handleDrag}
          onTouchMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchEnd={handleDragEnd}
        />
        
        <div className="modal-header-section">
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label={t('common.cancel', 'Close modal')}
          >
            <X size={24} />
          </button>
          <h2 id="task-modal-title" className="modal-title">
            <AlertCircle size={28} className="modal-title-icon" />
            {isEditMode ? t('tasks.editTask', 'Edit Task') : t('tasks.addTask', 'Add Task')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          {/* Voice Option (only for Add mode) */}
          {!isEditMode && (
            <div className="form-field">
              <button
                type="button"
                onClick={() => setShowVoiceRecorder(true)}
                className="voice-prompt-button w-full"
              >
                <Mic size={24} />
                <span>{t('tasks.useVoice', 'Use Voice to Add Task')}</span>
              </button>
              {showVoiceRecorder && (
                <div className="mt-4">
                  <VoiceBookingRecorder
                    onTaskCreated={handleVoiceTaskCreated}
                    onCancel={() => setShowVoiceRecorder(false)}
                    type="task"
                  />
                </div>
              )}
            </div>
          )}

          {/* Task Title */}
          <div className="form-field">
            <label htmlFor="taskTitle" className="form-label">
              <FileText size={16} className="inline mr-2" />
              {t('tasks.taskTitle', 'Task Title')} *
            </label>
            <input
              id="taskTitle"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('tasks.enterTaskTitle', 'e.g., Call John')}
              className="description-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="form-field">
              <label htmlFor="dueDate" className="form-label">
                <Calendar size={16} className="inline mr-2" />
                {t('common.dueDate', 'Due Date')}
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="description-input"
              />
            </div>

            {/* Due Time */}
            <div className="form-field">
              <label htmlFor="dueTime" className="form-label">
                <Clock size={16} className="inline mr-2" />
                {t('common.dueTime', 'Time')}
              </label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="description-input"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="form-field">
            <label className="form-label">{t('common.priority', 'Priority')}</label>
            <div className="category-pills">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`category-pill ${priority === p.value ? 'active' : ''}`}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div className="form-field">
            <label className="form-label">
              <Repeat size={16} className="inline mr-2" />
              {t('common.repeat', 'Repeat')}
            </label>
            <div className="category-pills">
              {['none', 'daily', 'weekly', 'monthly'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`category-pill ${recurrence === r ? 'active' : ''}`}
                  onClick={() => setRecurrence(r)}
                >
                  {t(`common.${r}`, r.charAt(0).toUpperCase() + r.slice(1))}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-field">
            <label htmlFor="taskDescription" className="form-label">
              <FileText size={16} className="inline mr-2" />
              {t('common.description', 'Description')}
            </label>
            <textarea
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('common.descriptionPlaceholder', 'Add task details...')}
              className="description-input"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="save-transaction-button"
            disabled={!title}
          >
            {isEditMode ? t('common.save', 'Update Task') : t('tasks.addTask', 'Save Task')}
          </button>
        </form>
      </div>
    </>
  );
}
