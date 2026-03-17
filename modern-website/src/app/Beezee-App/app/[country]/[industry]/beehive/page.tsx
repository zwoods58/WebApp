"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/LanguageContext';
import { useBeehive } from '@/hooks/useBeehive';
import { useAuth } from '@/contexts/AuthContext';
import BeehiveRequestModal, { RequestFormData } from '@/components/universal/BeehiveRequestModal';
import BeehiveComments from '@/components/universal/BeehiveComments';

export default function BeehivePage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new_feature' | 'improvement' | 'bug_fix' | 'integration'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);

  // Use Supabase hook for BeeHive data filtered by industry and country
  const { requests, loading, addRequest, updateRequest, deleteRequest, voteOnRequest, hasVoted } = useBeehive({ industry, country });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || request.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleVote = async (requestId: string, voteType: 'up' | 'down') => {
    try {
      await voteOnRequest(requestId, voteType);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAddRequest = () => {
    setEditingRequest(null);
    setShowModal(true);
  };

  const handleEditRequest = (request: any) => {
    setEditingRequest(request);
    setShowModal(true);
  };

  const handleSubmitRequest = async (data: RequestFormData) => {
    try {
      if (editingRequest) {
        await updateRequest(editingRequest.id, data);
      } else {
        await addRequest(data);
      }
      setShowModal(false);
      setEditingRequest(null);
    } catch (error) {
      console.error('Failed to submit request:', error);
      throw error;
    }
  };

  const handleDeleteRequest = async () => {
    if (!editingRequest) return;
    try {
      await deleteRequest(editingRequest.id);
      setShowModal(false);
      setEditingRequest(null);
    } catch (error) {
      console.error('Failed to delete request:', error);
      throw error;
    }
  };

  const isRequestOwner = (request: any): boolean => {
    return user?.id === request.user_id;
  };

  const toggleComments = (requestId: string) => {
    setExpandedComments(expandedComments === requestId ? null : requestId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'new_feature': return 'bg-green-100 text-green-700';
      case 'improvement': return 'bg-blue-100 text-blue-700';
      case 'bug_fix': return 'bg-red-100 text-red-700';
      case 'integration': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={16} />;
      case 'in_progress': return <Clock className="text-yellow-600" size={16} />;
      case 'active': return <AlertCircle className="text-blue-600" size={16} />;
      default: return <AlertCircle className="text-gray-600" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {t('beehive.title', 'BeeHive Community')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-6"
        >
          {t('beehive.description', 'Share ideas and help improve BeeZee for everyone')}
        </motion.p>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('beehive.search_placeholder', 'Search requests...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: t('beehive.all', 'All') },
              { value: 'new_feature', label: t('beehive.new_features', 'New Features') },
              { value: 'improvement', label: t('beehive.improvements', 'Improvements') },
              { value: 'bug_fix', label: t('beehive.bug_fixes', 'Bug Fixes') },
              { value: 'integration', label: t('beehive.integrations', 'Integrations') }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Add Request Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={handleAddRequest}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {t('beehive.add_request', 'Add New Request')}
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <div className="text-lg font-bold text-blue-600">{requests.length}</div>
            <div className="text-xs text-gray-600">{t('beehive.total_requests', 'Total')}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <div className="text-lg font-bold text-green-600">{requests.filter(r => r.status === 'completed').length}</div>
            <div className="text-xs text-gray-600">{t('beehive.completed', 'Done')}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <div className="text-lg font-bold text-yellow-600">{requests.filter(r => r.status === 'in_progress').length}</div>
            <div className="text-xs text-gray-600">{t('beehive.in_progress', 'In Progress')}</div>
          </div>
        </motion.div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {filteredRequests.map((request, index) => {
            const userVote = hasVoted(request.id);
            const timeAgo = new Date(request.created_at).toLocaleDateString();
            
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{t('beehive.community_member', 'Community Member')}</div>
                      <div className="text-xs text-gray-500">{timeAgo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRequestOwner(request) && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditRequest(request)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title={t('common.edit', 'Edit')}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      <span className={`text-xs font-medium ${getCategoryColor(request.category)} px-2 py-1 rounded-lg`}>
                        {t(`beehive.${request.category}`, request.category.replace('_', ' '))}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVote(request.id, 'up')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                        userVote.voted && userVote.voteType === 'up'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp size={16} />
                      <span className="text-sm font-medium">{request.upvotes_count}</span>
                    </button>
                    <button
                      onClick={() => handleVote(request.id, 'down')}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                        userVote.voted && userVote.voteType === 'down'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsDown size={16} />
                      <span className="text-sm font-medium">{request.downvotes_count}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(request.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                        expandedComments === request.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <MessageSquare size={16} />
                      <span className="text-sm">{request.comments_count}</span>
                    </button>
                  </div>
                  <div className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {t(`beehive.${request.priority}`, request.priority)}
                  </div>
                </div>

                {/* Comments Section */}
                {expandedComments === request.id && (
                  <BeehiveComments
                    requestId={request.id}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('beehive.no_requests', 'No requests found')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('beehive.no_requests_description', 'Be the first to share an idea!')}
            </p>
            <button
              onClick={handleAddRequest}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              {t('beehive.add_first_request', 'Add First Request')}
            </button>
          </motion.div>
        )}
      </div>

      {/* Request Modal */}
      <BeehiveRequestModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRequest(null);
        }}
        onSubmit={handleSubmitRequest}
        onDelete={editingRequest ? handleDeleteRequest : undefined}
        editMode={!!editingRequest}
        initialData={editingRequest ? {
          title: editingRequest.title,
          description: editingRequest.description,
          category: editingRequest.category,
          priority: editingRequest.priority
        } : undefined}
      />

      <BottomNav industry={industry} country={country} />
    </div>
  );
}
