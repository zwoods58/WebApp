"use client";

import React, { useState, useEffect } from 'react';
import { X, Send, Trash2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface BeehiveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RequestFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  editMode?: boolean;
  initialData?: RequestFormData;
}

export interface RequestFormData {
  title: string;
  description: string;
  category: 'new_feature' | 'improvement' | 'bug_fix' | 'integration';
  priority: 'low' | 'medium' | 'high';
}

export default function BeehiveRequestModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  editMode = false,
  initialData
}: BeehiveRequestModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<RequestFormData>({
    title: '',
    description: '',
    category: 'new_feature',
    priority: 'medium'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RequestFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'new_feature',
        priority: 'medium'
      });
    }
    setErrors({});
    setCurrentStep(1);
  }, [initialData, isOpen]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4);
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<Record<keyof RequestFormData, string>> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        newErrors.title = t('beehive.error_title_required', 'Title is required');
      } else if (formData.title.trim().length < 5) {
        newErrors.title = t('beehive.error_title_min', 'Title must be at least 5 characters');
      }
    }

    if (currentStep === 2) {
      if (!formData.description.trim()) {
        newErrors.description = t('beehive.error_description_required', 'Description is required');
      } else if (formData.description.trim().length < 10) {
        newErrors.description = t('beehive.error_description_min', 'Description must be at least 10 characters');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RequestFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('beehive.error_title_required', 'Title is required');
    } else if (formData.title.trim().length < 5) {
      newErrors.title = t('beehive.error_title_min', 'Title must be at least 5 characters');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('beehive.error_description_required', 'Description is required');
    } else if (formData.description.trim().length < 10) {
      newErrors.description = t('beehive.error_description_min', 'Description must be at least 10 characters');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      // Validate current step and move to next
      if (!validateCurrentStep()) return;
      handleNextStep();
      return;
    }
    
    // Final submission - validate all fields
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsSubmitting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Failed to delete request:', error);
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm overflow-y-auto animate-scale-in bg-[var(--color-background-primary)] rounded-2xl p-4">
          {/* Apple-style Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
            <div className="flex-1" />
            <div className="text-center flex-1">
              <h2 className="text-lg font-semibold text-black">
                {currentStep === 1 ? 'Title' : currentStep === 2 ? 'Details' : currentStep === 3 ? 'Category & Priority' : 'Review'}
              </h2>
              <p className="text-xs text-gray-500">
                Step {currentStep}/4
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-black" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto max-h-[calc(85vh-120px)]">
            {/* Step 1: Title */}
            {currentStep === 1 && (
              <div className="py-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('beehive.title', 'Title')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 bg-white/50 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('beehive.title_placeholder', 'Brief title for your request')}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle size={12} />
                      <span>{errors.title}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-gray-200/50 rounded-lg font-medium text-black hover:bg-gray-300/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <div className="py-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('beehive.description', 'Description')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-3 py-2 bg-white/50 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('beehive.description_placeholder', 'Describe your request in detail')}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                      <AlertCircle size={12} />
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 px-4 py-2 bg-gray-200/50 rounded-lg font-medium text-black hover:bg-gray-300/50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Category & Priority */}
            {currentStep === 3 && (
              <div className="py-4 space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('beehive.category', 'Category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="new_feature">{t('beehive.new_feature', 'New Feature')}</option>
                    <option value="improvement">{t('beehive.improvement', 'Improvement')}</option>
                    <option value="bug_fix">{t('beehive.bug_fix', 'Bug Fix')}</option>
                    <option value="integration">{t('beehive.integration', 'Integration')}</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    {t('beehive.priority', 'Priority')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          formData.priority === priority
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200/50 text-black hover:bg-gray-300/50'
                        }`}
                      >
                        {t(`beehive.${priority}`, priority.charAt(0).toUpperCase() + priority.slice(1))}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 px-4 py-2 bg-gray-200/50 rounded-lg font-medium text-black hover:bg-gray-300/50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="py-4 space-y-4">
                <div className="bg-gray-50/50 rounded-lg p-3 space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">Title:</span>
                    <p className="text-sm font-medium text-black">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Description:</span>
                    <p className="text-sm text-black">{formData.description}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Category:</span>
                    <p className="text-sm text-black">{t(`beehive.${formData.category}`, formData.category)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Priority:</span>
                    <p className="text-sm text-black">{t(`beehive.${formData.priority}`, formData.priority)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 px-4 py-2 bg-gray-200/50 rounded-lg font-medium text-black hover:bg-gray-300/50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? t('common.submitting', 'Submitting...') : t('common.submit', 'Submit')}</span>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-white/20 bg-gray-200/30">
            {editMode && onDelete ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <Trash2 size={18} />
                <span className="font-medium">{t('common.delete', 'Delete')}</span>
              </button>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200/50 rounded-lg font-medium text-black hover:bg-gray-300/50 transition-colors"
                disabled={isSubmitting}
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                <span>{isSubmitting ? t('common.submitting', 'Submitting...') : t('common.submit', 'Submit')}</span>
              </button>
            </div>
          </div>
        </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-60">
          <div className="bg-gray-100/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/20 animate-fade-in">
            <h3 className="text-lg font-bold text-black mb-2">
              {t('beehive.delete_confirm', 'Delete this request?')}
            </h3>
            <p className="text-black/70 mb-6">
              {t('beehive.delete_confirm_message', 'This action cannot be undone.')}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-2 bg-gray-200/50 rounded-lg font-medium text-black hover:bg-gray-300/50 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {t('common.delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
