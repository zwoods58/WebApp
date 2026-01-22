import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Globe, Clock, XCircle, LogOut, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { AuthService } from '../../services/AuthService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ActiveSessions() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revokingId, setRevokingId] = useState(null);
    const currentUserId = useAuthStore.getState().user?.id;

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            // We query business_sessions directly for the user
            // Note: RLS policies on business_sessions should allow user to see their own
            const { data, error } = await supabase
                .from('user_sessions')
                .select('*')
                .eq('user_id', currentUserId)
                .eq('is_active', true)
                .order('last_used_at', { ascending: false });

            if (error) throw error;
            setSessions(data || []);
        } catch (error) {
            console.error('Failed to load sessions:', error);
            toast.error('Could not load active devices');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (sessionId) => {
        if (!confirm('Revoke access for this device? It will be logged out immediately.')) return;

        setRevokingId(sessionId);
        try {
            // We use the logout endpoint or a direct DB update (AuthService.logout normally handles current)
            // For a specific session ID, we might need a dedicated Edge Function or RLS-allowed update
            const { error } = await supabase
                .from('user_sessions')
                .update({ is_active: false })
                .eq('id', sessionId);

            if (error) throw error;

            setSessions(prev => prev.filter(s => s.id !== sessionId));
            toast.success('Device access revoked');
        } catch (error) {
            toast.error('Failed to revoke session');
        } finally {
            setRevokingId(null);
        }
    };

    const handleRevokeAllOther = async () => {
        if (!confirm('Logout ALL other devices? This will keep only your current session active.')) return;

        setLoading(true);
        try {
            await AuthService.logout(true); // true = allDevices, but AuthService.logout(true) usually clears self too
            // Actually, our auth-logout endpoint with exceptCurrent: true is what we want
            const accessToken = sessionStorage.getItem('beezee_access_token');
            const { data, error } = await supabase.functions.invoke('auth-logout', {
                headers: { Authorization: `Bearer ${accessToken}` },
                body: { exceptCurrent: true }
            });

            if (error) throw error;

            toast.success('Other devices logged out successfully');
            loadSessions(); // Refresh
        } catch (error) {
            toast.error('Failed to logout other devices');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-10 border-b">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-xl font-bold">Security & Sessions</h1>
                    <p className="text-xs text-gray-500">Manage devices logged into your account</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Device Policy Overview */}
                <div className="bg-blue-600 rounded-3xl p-6 text-white text-center shadow-lg shadow-blue-200">
                    <Shield className="mx-auto mb-3 opacity-80" size={40} />
                    <h2 className="text-lg font-bold">Active Device Control</h2>
                    <p className="text-sm opacity-90 mt-1">
                        You can revoke access for any device remotely. If you lose your phone, use your backup email to recover your account and kill all sessions.
                    </p>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Devices</h3>
                        {sessions.length > 1 && (
                            <button
                                onClick={handleRevokeAllOther}
                                className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-full"
                            >
                                LOGOUT OTHERS
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            <p className="font-bold">Syncing Security Data...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-10 text-center border-2 border-dashed border-gray-100">
                            <AlertCircle className="mx-auto mb-4 text-gray-300" size={40} />
                            <p className="text-gray-400 font-medium">No active sessions found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div key={session.id} className="bg-white p-5 rounded-[32px] border border-gray-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            {session.device_info?.platform?.toString().toLowerCase().includes('win') ? <Globe size={20} /> : <Smartphone size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900 text-sm">
                                                    {session.device_info?.userAgent?.toString().split(')')[0]?.split('(')[1] || 'Unknown Device'}
                                                </h4>
                                                {session.is_current && (
                                                    <span className="text-[8px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Current</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-1">
                                                <Clock size={10} />
                                                <span>Last used {new Date(session.last_used_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{session.ip_address || '0.0.0.0'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!session.is_current && (
                                        <button
                                            onClick={() => handleRevoke(session.id)}
                                            disabled={revokingId === session.id}
                                            className="p-3 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            {revokingId === session.id ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Remote Logout Notice */}
                <div className="bg-orange-50 p-5 rounded-[32px] border border-orange-100 flex gap-4">
                    <Shield className="text-orange-500 flex-shrink-0" size={24} />
                    <div>
                        <p className="text-xs font-bold text-orange-900 mb-1">Lost your device?</p>
                        <p className="text-[10px] text-orange-800 leading-relaxed font-medium">
                            If your account is logged in on a device you no longer have, use the <b>Revoke</b> button to immediately invalidate all access from that device.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
