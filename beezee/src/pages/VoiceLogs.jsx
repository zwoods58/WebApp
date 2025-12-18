import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Filter, Mic, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import FloatingNavBar from '../components/FloatingNavBar';
import OfflineBanner from '../components/OfflineBanner';
import SwipeToRefresh from '../components/SwipeToRefresh';
import toast from 'react-hot-toast';

export default function VoiceLogs() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all'); // all, booking, task
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const query = supabase
        .from('voice_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      const { data, error } = await query;
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading voice logs:', error);
      toast.error('Failed to load voice logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [user]);

  const filteredLogs = logs.filter((l) => filter === 'all' || l.type === filter);

  if (loading) {
    return (
      <div className="voice-logs-container">
        <OfflineBanner />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <SwipeToRefresh onRefresh={loadLogs}>
      <div className="voice-logs-container">
        <OfflineBanner />
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Voice Logs</h1>
            <p className="text-gray-600 text-sm">Recent voice booking/task attempts</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-2 py-1"
            >
              <option value="all">All</option>
              <option value="booking">Bookings</option>
              <option value="task">Tasks</option>
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="card text-center py-10">
            <Mic size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No voice logs yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="card p-4 flex justify-between gap-3 items-start"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {log.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${log.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.success ? 'Success' : 'Failed'}
                    </span>
                    {log.confidence != null && (
                      <span className="text-xs text-gray-500">conf: {(log.confidence * 100).toFixed(0)}%</span>
                    )}
                  </div>
                  {log.error && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle size={14} />
                      <span>{log.error}</span>
                    </div>
                  )}
                  {log.raw_response && (
                    <details className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                      <summary className="cursor-pointer text-gray-700">Raw response</summary>
                      <pre className="whitespace-pre-wrap break-all text-[11px] mt-1">{log.raw_response}</pre>
                    </details>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <FloatingNavBar />
      </div>
    </SwipeToRefresh>
  );
}


