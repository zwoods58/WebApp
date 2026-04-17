'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  checks: {
    database: boolean;
    api: boolean;
    rateLimit: boolean;
  };
  uptime: number;
}

interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'invalid_token' | 'brute_force' | 'xss_attempt' | 'sql_injection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  ip: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  endpoint: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  requestCount: number;
  errorRate: number;
}

export default function MonitoringDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('security');

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      const [healthRes, eventsRes, metricsRes] = await Promise.all([
        fetch('/api/admin/monitoring/health'),
        fetch('/api/admin/monitoring/security-events'),
        fetch('/api/admin/monitoring/metrics')
      ]);

      if (healthRes.ok) setHealth(await healthRes.json());
      if (eventsRes.ok) setSecurityEvents(await eventsRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading monitoring data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-muted-foreground">Real-time monitoring and security alerts</p>
      </div>

      {/* Health Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">System Health</h2>
            <p className="text-gray-600">Current system status and uptime</p>
          </div>
          {health && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(health.status)}`} />
              <span className="font-semibold capitalize">{health.status}</span>
            </div>
          )}
        </div>
        {health && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Database</p>
              <p className="text-2xl font-bold">
                {health.checks.database ? '✅' : '❌'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">API</p>
              <p className="text-2xl font-bold">
                {health.checks.api ? '✅' : '❌'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Rate Limiting</p>
              <p className="text-2xl font-bold">
                {health.checks.rateLimit ? '✅' : '❌'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold">
                {Math.floor(health.uptime / 3600)}h
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Security Events
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 font-medium ${activeTab === 'performance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-4 py-2 font-medium ${activeTab === 'errors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Error Logs
          </button>
        </div>

        {/* Security Events Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold">Recent Security Events</h3>
              <p className="text-gray-600">Last 24 hours of security-related events</p>
            </div>
              <div className="space-y-3">
                {securityEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No security events in the last 24 hours
                  </p>
                ) : (
                  securityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.severity === 'critical' || event.severity === 'high' ? 'bg-red-100 text-red-800' : 
                            event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.severity}
                          </span>
                          <span className="px-2 py-1 rounded text-xs border">{event.type}</span>
                        </div>
                        <p className="font-medium">{event.message}</p>
                        <p className="text-sm text-muted-foreground">
                          IP: {event.ip} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold">API Performance Metrics</h3>
              <p className="text-gray-600">Response times and request statistics</p>
            </div>
              <div className="space-y-4">
                {metrics.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No performance data available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {metrics.map((metric, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{metric.endpoint}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            metric.errorRate > 5 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {metric.errorRate.toFixed(1)}% errors
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Avg Response</p>
                            <p className="font-semibold">{metric.avgResponseTime}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">P95 Response</p>
                            <p className="font-semibold">{metric.p95ResponseTime}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Requests</p>
                            <p className="font-semibold">{metric.requestCount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>
        )}

        {/* Error Logs Tab */}
        {activeTab === 'errors' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Error Logs</h3>
              <p className="text-gray-600">Recent application errors and exceptions</p>
            </div>
            <p className="text-gray-500 text-center py-8">
              Error logging integration pending
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">Total Requests (24h)</p>
          <p className="text-3xl font-bold">
            {metrics.reduce((sum, m) => sum + m.requestCount, 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">Avg Response Time</p>
          <p className="text-3xl font-bold">
            {metrics.length > 0
              ? Math.round(metrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / metrics.length)
              : 0}ms
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">Security Events (24h)</p>
          <p className="text-3xl font-bold">{securityEvents.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-2">Error Rate</p>
          <p className="text-3xl font-bold">
            {metrics.length > 0
              ? (metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length).toFixed(1)
              : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}

