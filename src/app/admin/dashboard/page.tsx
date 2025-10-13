'use client'

import { useState, useEffect } from 'react'
import { Users, DollarSign, TrendingUp, Target, Calendar, Phone, Mail, BarChart3, Settings, Activity, ArrowUp, ArrowDown, Eye, Plus, Bell } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import NotificationsPanel from '@/components/NotificationsPanel'

interface DashboardStats {
  totalLeads: number
  totalDeals: number
  pipelineValue: number
  conversionRate: number
  monthlyGrowth: number
  weeklyGrowth: number
  activeUsers: number
  completedTasks: number
  leadGrowth: number
  dealGrowth: number
  pipelineGrowth: number
  conversionGrowth: number
}

interface IndustryBreakdown {
  [key: string]: number
}

interface SourceBreakdown {
  [key: string]: number
}

interface RecentActivity {
  id: string
  type: 'lead' | 'deal' | 'task' | 'call'
  description: string
  user: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
}

interface QuickAction {
  title: string
  description: string
  icon: any
  href: string
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [industryBreakdown, setIndustryBreakdown] = useState<IndustryBreakdown>({})
  const [sourceBreakdown, setSourceBreakdown] = useState<SourceBreakdown>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const notifications = await response.json()
          const unread = notifications.filter((n: any) => !n.read).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentActivity(data.recentActivity)
          setIndustryBreakdown(data.industryBreakdown || {})
          setSourceBreakdown(data.sourceBreakdown || {})
        } else {
          // Fallback to empty data if API fails
          const emptyStats: DashboardStats = {
            totalLeads: 0,
            totalDeals: 0,
            pipelineValue: 0,
            conversionRate: 0,
            monthlyGrowth: 0,
            weeklyGrowth: 0,
            activeUsers: 0,
            completedTasks: 0,
            leadGrowth: 0,
            dealGrowth: 0,
            pipelineGrowth: 0,
            conversionGrowth: 0
          }
          setStats(emptyStats)
          setRecentActivity([])
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
        // Fallback to empty data
        const emptyStats: DashboardStats = {
          totalLeads: 0,
          totalDeals: 0,
          pipelineValue: 0,
          conversionRate: 0,
          monthlyGrowth: 0,
          weeklyGrowth: 0,
          activeUsers: 0,
          completedTasks: 0,
          leadGrowth: 0,
          dealGrowth: 0,
          pipelineGrowth: 0,
          conversionGrowth: 0
        }
        setStats(emptyStats)
        setRecentActivity([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminStats()
  }, [])

  const quickActions: QuickAction[] = [
    {
      title: 'Manage Leads',
      description: 'View and manage all leads',
      icon: Users,
      href: '/admin/leads',
      color: 'bg-blue-600'
    },
    {
      title: 'Deals Pipeline',
      description: 'Track sales pipeline',
      icon: DollarSign,
      href: '/admin/deals',
      color: 'bg-green-600'
    },
    {
      title: 'Task Management',
      description: 'Manage team tasks',
      icon: Target,
      href: '/admin/tasks',
      color: 'bg-purple-600'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-cyan-600'
    },
    {
      title: 'Import Leads',
      description: 'Bulk import leads',
      icon: Plus,
      href: '/admin/import',
      color: 'bg-orange-600'
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-slate-600'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return Users
      case 'deal': return DollarSign
      case 'task': return Target
      case 'call': return Phone
      default: return Activity
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'info': return 'text-blue-400'
      default: return 'text-slate-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AdminLayout currentPage="dashboard">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative btn-secondary flex items-center space-x-2"
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-white">{stats?.totalLeads}</p>
                <div className="flex items-center mt-2">
                  {stats && stats.leadGrowth >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${stats && stats.leadGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats && stats.leadGrowth >= 0 ? '+' : ''}{stats?.leadGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Deals</p>
                <p className="text-3xl font-bold text-white">{stats?.totalDeals}</p>
                <div className="flex items-center mt-2">
                  {stats && stats.dealGrowth >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${stats && stats.dealGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats && stats.dealGrowth >= 0 ? '+' : ''}{stats?.dealGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Pipeline Value</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(stats?.pipelineValue || 0)}</p>
                <div className="flex items-center mt-2">
                  {stats && stats.pipelineGrowth >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${stats && stats.pipelineGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats && stats.pipelineGrowth >= 0 ? '+' : ''}{stats?.pipelineGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">{formatPercentage(stats?.conversionRate || 0)}</p>
                <div className="flex items-center mt-2">
                  {stats && stats.conversionGrowth >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${stats && stats.conversionGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats && stats.conversionGrowth >= 0 ? '+' : ''}{stats?.conversionGrowth}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-slate-400">{action.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Lead Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Industry Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(industryBreakdown).length > 0 ? (
                Object.entries(industryBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([industry, count]) => (
                    <div key={industry} className="flex items-center justify-between">
                      <span className="text-slate-300">{industry}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(count / stats?.totalLeads!) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-slate-400 text-center py-4">No industry data available</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
            <div className="space-y-3">
              {Object.entries(sourceBreakdown).length > 0 ? (
                Object.entries(sourceBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-slate-300">{source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(count / stats?.totalLeads!) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-slate-400 text-center py-4">No source data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${getActivityColor(activity.status)}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-400">{activity.user}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Active Users</span>
                <span className="text-white font-medium">{stats?.activeUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Completed Tasks</span>
                <span className="text-white font-medium">{stats?.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Weekly Growth</span>
                <span className="text-green-400 font-medium">+{stats?.weeklyGrowth}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">System Status</span>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Last Backup</span>
                <span className="text-slate-400 text-sm">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <NotificationsPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </AdminLayout>
  )
}


