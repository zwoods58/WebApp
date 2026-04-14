"use client";

import React, { useState, useEffect } from 'react';
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
  Trash2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToast } from '@/hooks/useToast';
import BeehiveRequestModal, { RequestFormData } from '@/components/universal/BeehiveRequestModal';
import BeehiveComments from '@/components/universal/BeehiveComments';

// Type definitions
interface BeehiveRequest {
  id: string;
  business_id: string;
  user_id?: string;
  country: string;
  industry: string;
  title: string;
  description: string;
  category?: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  is_featured: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function BeehivePage() {
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  const { t } = useLanguage();
  const { user, business } = useUnifiedAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  // Simplified state management
  const [requests, setRequests] = useState<BeehiveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new_feature' | 'improvement' | 'bug_fix' | 'integration'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});

  // Simplified data fetching with polling
  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams({ country, industry });
      if (selectedFilter !== 'all') params.append('category', selectedFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await fetch(`/api/requests?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setRequests(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      showError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  // Polling effect
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [country, industry, selectedFilter, searchTerm]);

  const handleVote = async (requestId: string, voteType: 'up' | 'down') => {
    const businessId = business?.id || user?.id;
    if (!businessId) {
      showWarning('Please login to vote');
      return;
    }

    // Set loading state for this specific request
    setVotingLoading(prev => ({ ...prev, [requestId]: true }));

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          voteType, 
          business_id: businessId 
        })
      });
      
      if (res.ok) {
        await fetchRequests(); // Simple refresh - no complex state
        showSuccess('Vote recorded!');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      showError('Failed to record vote');
    } finally {
      setVotingLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleAddRequest = () => {
    setEditingRequest(null);
    setShowModal(true);
  };

  const handleSubmitRequest = async (data: RequestFormData) => {
    try {
      const businessId = business?.id || user?.id;
      if (!businessId) {
        showWarning('Please login to create a request');
        return;
      }

      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          business_id: businessId,
          country,
          industry
        })
      });

      if (res.ok) {
        await fetchRequests();
        setShowModal(false);
        showSuccess('Request created successfully!');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create request');
      }
    } catch (error) {
      console.error('Failed to create request:', error);
      showError('Failed to create request');
    }
  };

  const handleDeleteRequest = async () => {
    if (!editingRequest) return;
    
    const businessId = business?.id || user?.id;
    if (!businessId) return;

    try {
      const res = await fetch('/api/requests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: editingRequest.id,
          business_id: businessId
        })
      });

      if (res.ok) {
        await fetchRequests();
        setShowModal(false);
        setEditingRequest(null);
        showSuccess('Request deleted successfully!');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
      showError('Failed to delete request');
    }
  };

  const isRequestOwner = (request: any): boolean => {
    const businessId = business?.id || user?.id;
    return businessId === request.business_id;
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

  const filteredRequests = requests.filter((request: BeehiveRequest) => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || request.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-y-auto">
      <Header industry={industry} country={country} />

      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900 fade-in">
            {t('beehive.title', 'BeeHive Community')}
          </h1>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 fade-in">
          {t('beehive.description', 'Share ideas and help improve BeeZee for everyone')}
        </p>

        {/* Search and Filter */}
        <div className="fade-in mt-8">
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
            ].map((filter: { value: string; label: string }) => (
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
        </div>

        {/* Add Request Button */}
        <div className="fade-in mt-6">
          <button
            onClick={handleAddRequest}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {t('beehive.add_request', 'Add New Request')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="fade-in mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <div className="text-lg font-bold text-blue-600">{requests.length}</div>
            <div className="text-xs text-gray-600">{t('beehive.total_requests', 'Total')}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <div className="text-lg font-bold text-green-600">{requests.filter((r: BeehiveRequest) => r.status === 'completed').length}</div>
            <div className="text-xs text-gray-600">{t('beehive.completed', 'Done')}</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
            <div className="text-lg font-bold text-yellow-600">{requests.filter((r: BeehiveRequest) => r.status === 'in_progress').length}</div>
            <div className="text-xs text-gray-600">{t('beehive.in_progress', 'In Progress')}</div>
          </div>
        </div>

        {/* Requests List */}
        <div className="fade-in mt-8 space-y-4 mb-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="fade-in">
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
            </div>
          ) : (
            filteredRequests.map((request: BeehiveRequest, index: number) => {
              const timeAgo = new Date(request.created_at).toLocaleDateString();
              
              return (
                <div key={request.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                        ?
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
                            onClick={() => {
                              setEditingRequest(request);
                              setShowModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title={t('common.edit', 'Edit')}
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span className={`text-xs font-medium ${getCategoryColor(request.category || 'general')} px-2 py-1 rounded-lg`}>
                          {t(`beehive.${request.category || 'general'}`, (request.category || 'general').replace('_', ' '))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(request.id, 'up')}
                        disabled={votingLoading[request.id]}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs ${
                          votingLoading[request.id]
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp size={14} />
                        <span className="font-medium">{request.upvotes_count || 0}</span>
                      </button>
                      <button
                        onClick={() => handleVote(request.id, 'down')}
                        disabled={votingLoading[request.id]}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs ${
                          votingLoading[request.id]
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsDown size={14} />
                        <span className="font-medium">{request.downvotes_count || 0}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(request.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors text-xs ${
                          expandedComments === request.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <MessageSquare size={14} />
                        <span>{request.comments_count || 0}</span>
                      </button>
                    </div>
                    <div className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {t(`beehive.${request.priority}`, request.priority)}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {expandedComments === request.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 max-h-96 overflow-y-auto">
                      <BeehiveComments
                        requestId={request.id}
                        onCommentAdded={() => {
                          console.log('Refreshing beehive data after comment added');
                          fetchRequests();
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
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
