"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  full_name?: string;
  business_name?: string;
  country?: string;
  phone_number?: string;
  default_industry?: string;
}

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    country: '',
    default_industry: 'retail'
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data && !error) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        business_name: data.business_name || '',
        country: data.country || '',
        default_industry: data.default_industry || 'retail'
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        ...formData,
        phone_number: user.phone,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      setEditing(false);
      fetchProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900 mb-6"
        >
          Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {profile?.full_name || 'User'}
                </div>
                <div className="text-sm text-gray-500">
                  {user.phone}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {editing ? <X size={20} /> : <Edit2 size={20} />}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  <option value="ke">Kenya</option>
                  <option value="ng">Nigeria</option>
                  <option value="gh">Ghana</option>
                  <option value="ug">Uganda</option>
                  <option value="tz">Tanzania</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Industry
                </label>
                <select
                  value={formData.default_industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, default_industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="retail">Retail</option>
                  <option value="food">Food Service</option>
                  <option value="salon">Salon</option>
                  <option value="transport">Transport</option>
                  <option value="freelance">Freelance</option>
                  <option value="repairs">Repairs</option>
                  <option value="tailor">Tailor</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Business Name</div>
                <div className="font-medium text-gray-900">
                  {profile?.business_name || 'Not set'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Country</div>
                <div className="font-medium text-gray-900">
                  {profile?.country?.toUpperCase() || 'Not set'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Default Industry</div>
                <div className="font-medium text-gray-900 capitalize">
                  {profile?.default_industry || 'retail'}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <button className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Settings</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full p-4 bg-white rounded-xl border border-red-200 flex items-center justify-between hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-600" />
              <span className="font-medium text-red-600">Sign Out</span>
            </div>
            <span className="text-red-400">→</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
