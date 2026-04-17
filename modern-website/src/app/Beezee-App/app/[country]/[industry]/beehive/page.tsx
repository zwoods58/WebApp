"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send,
  AlertCircle,
  CheckCircle,
  Bug,
  Lightbulb,
  MessageCircle,
  ThumbsUp,
  Flag
} from 'lucide-react';
import { useParams } from 'next/navigation';

import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/useLanguage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks';

// Type definitions
interface FeedbackForm {
  feedback_type: 'bug_report' | 'feature_request' | 'general_feedback' | 'complaint' | 'compliment';
  title: string;
  description: string;
  email: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function BeehivePage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  const { user, business } = useSupabaseAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<FeedbackForm>({
    feedback_type: 'general_feedback',
    title: '',
    description: '',
    email: business?.email || user?.email || '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const businessId = business?.id || user?.id;
    if (!businessId) {
      showError('Please login to submit feedback');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          business_id: businessId,
          country,
          industry
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Feedback submitted successfully! We appreciate your input.');
        // Reset form
        setFormData({
          feedback_type: 'general_feedback',
          title: '',
          description: '',
          email: business?.email || user?.email || '',
          priority: 'medium'
        });
      } else {
        throw new Error(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'bug_report': return <Bug size={20} className="text-red-500" />;
      case 'feature_request': return <Lightbulb size={20} className="text-yellow-500" />;
      case 'complaint': return <Flag size={20} className="text-orange-500" />;
      case 'compliment': return <ThumbsUp size={20} className="text-green-500" />;
      default: return <MessageCircle size={20} className="text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('feedback.title', 'Share Your Feedback')}
          </h1>
          <p className="text-gray-600">
            {t('feedback.description', 'Help us improve BeeZee by sharing your thoughts, ideas, and concerns')}
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('feedback.type_label', 'Feedback Type')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'bug_report', label: 'Bug Report', icon: 'bug' },
                  { value: 'feature_request', label: 'Feature Request', icon: 'lightbulb' },
                  { value: 'general_feedback', label: 'General Feedback', icon: 'message' },
                  { value: 'complaint', label: 'Complaint', icon: 'flag' },
                  { value: 'compliment', label: 'Compliment', icon: 'thumbsup' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, feedback_type: type.value as any }))}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.feedback_type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {getFeedbackIcon(type.value)}
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('feedback.title_label', 'Title')} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder={t('feedback.title_placeholder', 'Brief summary of your feedback')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('feedback.description_label', 'Description')} *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder={t('feedback.description_placeholder', 'Please provide detailed information about your feedback...')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('feedback.email_label', 'Email Address')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('feedback.email_placeholder', 'your@email.com')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                {t('feedback.priority_label', 'Priority')}
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">{t('feedback.priority_low', 'Low')}</option>
                <option value="medium">{t('feedback.priority_medium', 'Medium')}</option>
                <option value="high">{t('feedback.priority_high', 'High')}</option>
                <option value="urgent">{t('feedback.priority_urgent', 'Urgent')}</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('feedback.submitting', 'Submitting...')}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t('feedback.submit', 'Submit Feedback')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-6 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-0.5" size={18} />
              <div>
                <h3 className="font-medium text-blue-900 text-sm">{t('feedback.response_title', 'We Listen & Respond')}</h3>
                <p className="text-blue-700 text-xs mt-1">
                  {t('feedback.response_desc', 'Every piece of feedback is reviewed by our team and helps us improve BeeZee for everyone.')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-green-600 mt-0.5" size={18} />
              <div>
                <h3 className="font-medium text-green-900 text-sm">{t('feedback.privacy_title', 'Your Privacy Matters')}</h3>
                <p className="text-green-700 text-xs mt-1">
                  {t('feedback.privacy_desc', 'Your feedback is kept confidential and used only to improve our services.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
