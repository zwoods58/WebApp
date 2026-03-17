"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { localStorageManager } from '@/utils/localStorageManager';

// Helper function to get current user ID from our custom auth
const getCurrentUserId = (): string | null => {
  try {
    console.log('🔍 Checking authentication status...');
    
    // Method 1: Check sessionData (original system)
    let sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session.isLoggedIn && session.userId) {
          console.log('✅ Found user ID in sessionData:', session.userId);
          return session.userId;
        }
      } catch (e) {
        console.log('❌ Failed to parse sessionData:', e);
      }
    }
    
    // Method 2: Check beezee-user-data
    const beezeeUserData = localStorage.getItem('beezee-user-data');
    if (beezeeUserData) {
      try {
        const userData = JSON.parse(beezeeUserData);
        const userId = userData?.userId || userData?.id || userData?.sub;
        if (userId) {
          console.log('✅ Found user ID in beezee-user-data:', userId);
          return userId;
        }
      } catch (e) {
        console.log('❌ Failed to parse beezee-user-data:', e);
      }
    }
    
    // Method 3: Check beezee-auth
    const beezeeAuth = localStorage.getItem('beezee-auth');
    if (beezeeAuth) {
      try {
        const authData = JSON.parse(beezeeAuth);
        const userId = authData?.userId || authData?.id || authData?.sub;
        if (userId) {
          console.log('✅ Found user ID in beezee-auth:', userId);
          return userId;
        }
      } catch (e) {
        console.log('❌ Failed to parse beezee-auth:', e);
      }
    }
    
    // Method 4: Check beezee-business-auth (our new business auth system)
    const businessAuth = localStorage.getItem('beezee_business_auth');
    if (businessAuth) {
      try {
        const authData = JSON.parse(businessAuth);
        const businessId = authData.business?.id || authData.session?.businessId;
        if (businessId) {
          console.log('✅ Using business ID as user ID:', businessId);
          return businessId;
        }
      } catch (e) {
        console.log('❌ Failed to parse beezee_business_auth:', e);
      }
    }
    
    // Method 5: Check beezee-business-profile
    const businessProfile = localStorage.getItem('beezee-business-profile');
    if (businessProfile) {
      try {
        const profileData = JSON.parse(businessProfile);
        const userId = profileData?.userId || profileData?.id || profileData?.user_id;
        if (userId) {
          console.log('✅ Found user ID in beezee-business-profile:', userId);
          return userId;
        }
      } catch (e) {
        console.log('❌ Failed to parse beezee-business-profile:', e);
      }
    }
    
    // Method 5: Check isLoggedIn and create temporary session
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      console.log('⚠️ User is logged in but no user ID found');
      console.log('🔧 Creating temporary user ID...');
      
      // Create a temporary user ID based on available data
      const tempUserId = 'temp-user-' + Date.now();
      console.log('📝 Created temporary user ID:', tempUserId);
      
      // Create sessionData for future use
      const tempSession = {
        isLoggedIn: true,
        userId: tempUserId,
        email: 'temp@example.com',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('sessionData', JSON.stringify(tempSession));
      console.log('✅ Created temporary sessionData');
      return tempUserId;
    }
    
    // Method 6: Last resort - check if there's any user data at all
    console.log('🔍 Checking for any user data in localStorage...');
    const allKeys = Object.keys(localStorage);
    const userRelatedKeys = allKeys.filter(key => 
      key.toLowerCase().includes('user') || 
      key.toLowerCase().includes('auth') || 
      key.toLowerCase().includes('session') ||
      key.toLowerCase().includes('login')
    );
    
    console.log('📋 Found user-related keys:', userRelatedKeys);
    
    // Try to extract from any user-related key
    for (const key of userRelatedKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const userId = data?.userId || data?.id || data?.user_id || data?.sub;
        if (userId) {
          console.log('✅ Found user ID in', key, ':', userId);
          
          // Create sessionData for consistency
          const session = {
            isLoggedIn: true,
            userId: userId,
            email: data?.email || 'extracted@example.com',
            loginTime: new Date().toISOString()
          };
          
          localStorage.setItem('sessionData', JSON.stringify(session));
          console.log('✅ Created sessionData from', key);
          return userId;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
    
    console.log('❌ No user ID found in any authentication method');
    console.log('🔍 Available localStorage keys:', allKeys);
    console.log('🔧 User needs to log in or authentication system needs fixing');
    
    return null;
  } catch (error) {
    console.error('❌ Error in getCurrentUserId():', error);
    return null;
  }
};

interface BeehiveRequest {
  id: string;
  business_id: string;
  industry: string;
  country: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  is_featured: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface BeehiveVote {
  id: string;
  request_id: string;
  user_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

interface UseBeehiveProps {
  industry: string;
  country: string;
}

export function useBeehive({ industry, country }: UseBeehiveProps) {
  const [requests, setRequests] = useState<BeehiveRequest[]>([]);
  const [myVotes, setMyVotes] = useState<BeehiveVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch requests filtered by industry and country
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching beehive requests for:', { industry, country });

      // Try API route first (bypasses RLS and foreign key issues)
      try {
        const response = await fetch('/api/beehive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list',
            industry: industry,
            country: country
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Fetched requests via API route:', result.data?.length || 0);
          setRequests(result.data || []);
          return;
        } else {
          console.log('⚠️ API route failed, trying direct database');
        }
      } catch (apiError: any) {
        console.log('⚠️ API route error:', apiError.message);
      }

      // Fallback to direct database query
      const { data, error } = await supabase
        .from('beehive_requests')
        .select('*')
        .eq('industry', industry)
        .eq('country', country)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('⚠️ RLS error fetching requests, trying alternative approach');
        console.log('Error details:', error);
        
        // If RLS blocks us, try to get all requests and filter client-side
        const { data: allRequests, error: allError } = await supabase
          .from('beehive_requests')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (allError) {
          throw allError;
        }
        
        // Filter requests client-side
        const filteredRequests = allRequests?.filter(request => 
          request.industry === industry && request.country === country
        ) || [];
        
        console.log('✅ Fetched requests via client-side filtering:', filteredRequests.length);
        setRequests(filteredRequests);
      } else {
        console.log('✅ Fetched requests via direct query:', data?.length || 0);
        setRequests(data || []);
      }
    } catch (err: any) {
      console.error('Error fetching beehive requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's votes
  const fetchMyVotes = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from('beehive_votes')
        .select('*')
        .eq('business_id', userId);

      if (error) throw error;
      setMyVotes(data || []);
    } catch (err: any) {
      console.error('Error fetching votes:', err);
    }
  };

  // Add new request
  const addRequest = async (requestData: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Get business ID from multiple sources
      let businessId = null;
      
      // Method 1: Check userProfile
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        try {
          const profileData = JSON.parse(userProfile);
          businessId = profileData?.businessId || profileData?.id || profileData?.business_id;
          if (businessId) {
            console.log('✅ Retrieved business ID from userProfile:', businessId);
          }
        } catch (e) {
          console.log('❌ Failed to parse userProfile:', e);
        }
      }
      
      // Method 2: Check sessionData
      if (!businessId) {
        const sessionData = localStorage.getItem('sessionData');
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData);
            businessId = session?.businessId || session?.id || session?.business_id;
            if (businessId) {
              console.log('✅ Retrieved business ID from sessionData:', businessId);
            }
          } catch (e) {
            console.log('❌ Failed to parse sessionData:', e);
          }
        }
      }
      
      // Method 3: Check beezee-business-profile
      if (!businessId) {
        const businessProfile = localStorage.getItem('beezee-business-profile');
        if (businessProfile) {
          try {
            const profileData = JSON.parse(businessProfile);
            businessId = profileData?.businessId || profileData?.id || profileData?.business_id;
            if (businessId) {
              console.log('✅ Retrieved business ID from beezee-business-profile:', businessId);
            }
          } catch (e) {
            console.log('❌ Failed to parse beezee-business-profile:', e);
          }
        }
      }
      
      // Method 4: Check beezee-user-data
      if (!businessId) {
        const beezeeUserData = localStorage.getItem('beezee-user-data');
        if (beezeeUserData) {
          try {
            const userData = JSON.parse(beezeeUserData);
            businessId = userData?.businessId || userData?.id || userData?.business_id;
            if (businessId) {
              console.log('✅ Retrieved business ID from beezee-user-data:', businessId);
            }
          } catch (e) {
            console.log('❌ Failed to parse beezee-user-data:', e);
          }
        }
      }
      
      // Method 5: Use userId as fallback
      if (!businessId && userId) {
        businessId = userId;
        console.log('✅ Using userId as businessId fallback:', businessId);
      }
      
      console.log('🏢 Final business ID:', businessId);

      console.log('🏢 Using business ID:', businessId);

      // Use API route to bypass RLS
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addRequest',
          userId,
          data: {
            ...requestData,
            industry,
            country,
            user_id: userId,
            business_id: businessId,
            status: 'open',
            upvotes_count: 0,
            downvotes_count: 0,
            comments_count: 0,
            is_featured: false,
            metadata: {}
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create request');
      }

      const result = await response.json();
      
      // Refresh requests
      await fetchRequests();
      return result.data;
    } catch (err: any) {
      console.error('Error adding request:', err);
      throw err;
    }
  };

  // Vote on a request
  const voteOnRequest = async (requestId: string, voteType: 'up' | 'down') => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Use API route to bypass RLS and handle foreign key constraints
      const response = await fetch('/api/beehive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'voteOnRequest',
          userId,
          data: { requestId, voteType }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to vote');
      }

      // Refresh data
      await Promise.all([fetchRequests(), fetchMyVotes()]);
    } catch (err: any) {
      console.error('Error voting:', err);
      throw err;
    }
  };

  // Update existing request
  const updateRequest = async (requestId: string, updates: {
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
  }) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('beehive_requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('user_id', userId); // Only allow updating own requests

      if (error) throw error;
      
      // Refresh requests
      await fetchRequests();
    } catch (err: any) {
      console.error('Error updating request:', err);
      throw err;
    }
  };

  // Delete request
  const deleteRequest = async (requestId: string) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('beehive_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', userId); // Only allow deleting own requests

      if (error) throw error;
      
      // Refresh requests
      await fetchRequests();
    } catch (err: any) {
      console.error('Error deleting request:', err);
      throw err;
    }
  };

  // Check if user voted on a request
  const hasVoted = (requestId: string): { voted: boolean; voteType?: 'up' | 'down' } => {
    const vote = myVotes.find(v => v.request_id === requestId);
    return {
      voted: !!vote,
      voteType: vote?.vote_type
    };
  };

  // Check if user owns a request
  const isOwner = (requestId: string): boolean => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return false;
    
    // This would need the current user ID - we'll add it
    return false; // Placeholder - will be enhanced with user context
  };

  // Subscribe to real-time updates
  useEffect(() => {
    fetchRequests();
    fetchMyVotes();

    // Set up real-time subscription
    const channel = supabase
      .channel('beehive_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'beehive_requests',
          filter: `industry=eq.${industry},country=eq.${country}`
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [industry, country]);

  return {
    requests,
    myVotes,
    loading,
    error,
    addRequest,
    updateRequest,
    deleteRequest,
    voteOnRequest,
    hasVoted,
    isOwner,
    refreshRequests: fetchRequests
  };
}
