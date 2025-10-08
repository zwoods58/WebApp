'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Bell, Search, Settings, User, Menu, X, TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart, Calendar, Mail, MessageSquare, FileText, Download, Filter, MoreVertical, Plus, Eye, Edit, Trash2, Clock, Zap, Shield, Award, Target, ArrowUpRight, ArrowDownRight, ChevronRight, Star, CheckCircle, AlertCircle, Info, Play, Pause, RefreshCw } from 'lucide-react'

const stats = [
  { 
    name: 'Total Revenue', 
    value: '$2,847,231', 
    change: '+18.5%', 
    changeType: 'positive', 
    icon: DollarSign, 
    trend: 'vs last month',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'from-emerald-50 to-teal-50'
  },
  { 
    name: 'Active Users', 
    value: '12,847', 
    change: '+12.2%', 
    changeType: 'positive', 
    icon: Users, 
    trend: 'new this month',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'from-blue-50 to-cyan-50'
  },
  { 
    name: 'Conversion Rate', 
    value: '4.24%', 
    change: '+2.1%', 
    changeType: 'positive', 
    icon: TrendingUp, 
    trend: 'improvement',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-purple-50 to-pink-50'
  },
  { 
    name: 'Bounce Rate', 
    value: '18.5%', 
    change: '-6.3%', 
    changeType: 'negative', 
    icon: Activity, 
    trend: 'better engagement',
    color: 'from-orange-500 to-red-600',
    bgColor: 'from-orange-50 to-red-50'
  },
  { 
    name: 'Avg. Session', 
    value: '4m 32s', 
    change: '+15.2%', 
    changeType: 'positive', 
    icon: Clock, 
    trend: 'user retention',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'from-indigo-50 to-purple-50'
  },
  { 
    name: 'Page Views', 
    value: '1.2M', 
    change: '+22.1%', 
    changeType: 'positive', 
    icon: BarChart3, 
    trend: 'this month',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'from-rose-50 to-pink-50'
  }
]

const recentActivities = [
  { id: 1, user: 'Sarah Johnson', action: 'created a new project', time: '2 minutes ago', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', type: 'project' },
  { id: 2, user: 'Mike Chen', action: 'updated dashboard settings', time: '15 minutes ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', type: 'settings' },
  { id: 3, user: 'Emily Davis', action: 'shared a report', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', type: 'report' },
  { id: 4, user: 'Alex Rodriguez', action: 'completed task', time: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', type: 'task' }
]

const projects = [
  { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75, team: 4, deadline: 'Dec 15, 2024', priority: 'high', budget: '$15,000', spent: '$11,250' },
  { id: 2, name: 'E-commerce Integration', status: 'Planning', progress: 30, team: 6, deadline: 'Jan 20, 2025', priority: 'medium', budget: '$25,000', spent: '$7,500' },
  { id: 3, name: 'API Integration', status: 'Completed', progress: 100, team: 3, deadline: 'Nov 30, 2024', priority: 'low', budget: '$8,000', spent: '$8,000' },
  { id: 4, name: 'Database Migration', status: 'In Progress', progress: 60, team: 2, deadline: 'Dec 10, 2024', priority: 'high', budget: '$12,000', spent: '$7,200' }
]

const notifications = [
  { id: 1, title: 'New user registered', message: 'Sarah Johnson joined your team', time: '5 min ago', unread: true, type: 'user' },
  { id: 2, title: 'Project deadline approaching', message: 'Website Redesign due in 3 days', time: '1 hour ago', unread: true, type: 'deadline' },
  { id: 3, title: 'System update completed', message: 'All systems are now running on v2.1', time: '2 hours ago', unread: false, type: 'system' },
  { id: 4, title: 'Weekly report ready', message: 'Your analytics report is available', time: '1 day ago', unread: false, type: 'report' }
]

const teamMembers = [
  { id: 1, name: 'Sarah Johnson', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', status: 'online', lastActive: '2 min ago' },
  { id: 2, name: 'Mike Chen', role: 'Lead Developer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', status: 'online', lastActive: '5 min ago' },
  { id: 3, name: 'Emily Davis', role: 'UX Designer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', status: 'away', lastActive: '1 hour ago' },
  { id: 4, name: 'Alex Rodriguez', role: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', status: 'offline', lastActive: '3 hours ago' }
]

const subscriptionPlans = [
  { name: 'Starter', price: 29, features: ['Up to 5 projects', 'Basic analytics', 'Email support'], current: false },
  { name: 'Professional', price: 79, features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Team collaboration'], current: true },
  { name: 'Enterprise', price: 199, features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'Advanced security'], current: false }
]

export default function SaasDashboardDemo() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showBilling, setShowBilling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Planning': return 'bg-yellow-100 text-yellow-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />
      case 'deadline': return <AlertCircle className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
      case 'report': return <FileText className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Link href="/portfolio" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Portfolio</span>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DataFlow Pro
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <Bell className="h-5 w-5" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'projects', label: 'Projects', icon: FileText },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'billing', label: 'Billing', icon: DollarSign }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div
                    key={stat.name}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`p-8 bg-gradient-to-br ${stat.bgColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-1 text-sm font-semibold ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.changeType === 'positive' ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            <span>{stat.change}</span>
                          </div>
                          <p className="text-xs text-gray-500">{stat.trend}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-gray-600 font-medium">{stat.name}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span>Last 30 days</span>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive chart would be here</p>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(project.priority)}`}>
                          {project.priority} priority
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Team Size</p>
                        <p className="font-semibold text-gray-900">{project.team} members</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Deadline</p>
                        <p className="font-semibold text-gray-900">{project.deadline}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Budget</p>
                        <p className="font-semibold text-gray-900">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Spent</p>
                        <p className="font-semibold text-gray-900">{project.spent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Plus className="h-4 w-4" />
                <span>Invite Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-2 border-white rounded-full ${
                      member.status === 'online' ? 'bg-green-500' :
                      member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-600 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.lastActive}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">User Engagement</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-500">Engagement metrics chart</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
                <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-500">Performance analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div key={plan.name} className={`bg-white rounded-3xl shadow-lg p-8 border-2 transition-all duration-300 ${
                  plan.current ? 'border-indigo-500 shadow-indigo-100' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  {plan.current && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                      Current Plan
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.current
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105'
                  }`}>
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-2xl border transition-all duration-300 ${
                    notification.unread 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Account</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      Security
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      Notifications
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      Theme
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      Language
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      Data Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}