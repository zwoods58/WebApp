'use client'

import { useState, useEffect } from 'react'
import { Settings, Users, Bell, Shield, Database, Mail, Phone, Globe, Save, Eye, EyeOff } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SALES'
  status: 'ACTIVE' | 'INACTIVE'
  lastLogin: string
  createdAt: string
}

interface SystemSettings {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyWebsite: string
  timezone: string
  currency: string
  dateFormat: string
  emailNotifications: boolean
  smsNotifications: boolean
  autoAssignLeads: boolean
  leadScoringEnabled: boolean
  dealProbabilityEnabled: boolean
  dataRetentionDays: number
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: 'AtarWebb',
    companyEmail: 'admin@atarwebb.com',
    companyPhone: '+1 (555) 123-4567',
    companyWebsite: 'https://atarwebb.com',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    smsNotifications: false,
    autoAssignLeads: true,
    leadScoringEnabled: true,
    dealProbabilityEnabled: true,
    dataRetentionDays: 365
  })

  useEffect(() => {
    // Empty users data - no mock data
    setUsers([])
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    alert('Settings saved successfully!')
  }

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: 'New User',
      email: 'newuser@atarwebb.com',
      role: 'SALES',
      status: 'ACTIVE',
      lastLogin: 'Never',
      createdAt: new Date().toISOString()
    }
    setUsers([...users, newUser])
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
        : user
    ))
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          System Settings
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 rounded-lg p-1">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'integrations', label: 'Integrations', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Email</label>
                  <input
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Phone</label>
                  <input
                    type="tel"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Website</label>
                  <input
                    type="url"
                    value={settings.companyWebsite}
                    onChange={(e) => setSettings({...settings, companyWebsite: e.target.value})}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">System Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="input"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="input"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
                    className="input"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">CRM Features</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Auto-assign leads</label>
                    <p className="text-xs text-slate-400">Automatically assign new leads to available sales reps</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoAssignLeads}
                      onChange={(e) => setSettings({...settings, autoAssignLeads: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Lead scoring</label>
                    <p className="text-xs text-slate-400">Enable automatic lead scoring based on activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.leadScoringEnabled}
                      onChange={(e) => setSettings({...settings, leadScoringEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Deal probability</label>
                    <p className="text-xs text-slate-400">Show probability percentages for deals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.dealProbabilityEnabled}
                      onChange={(e) => setSettings({...settings, dealProbabilityEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">User Management</h3>
              <button onClick={handleAddUser} className="btn-primary flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="font-medium text-white">{user.name}</td>
                        <td className="text-slate-300">{user.email}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="text-slate-300">{formatDate(user.lastLogin)}</td>
                        <td>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`px-2 py-1 rounded text-xs ${
                                user.status === 'ACTIVE'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Email Notifications</label>
                    <p className="text-xs text-slate-400">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-slate-300">SMS Notifications</label>
                    <p className="text-xs text-slate-400">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Password Policy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Data Retention</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Data Retention Period (Days)</label>
                <input
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => setSettings({...settings, dataRetentionDays: parseInt(e.target.value)})}
                  className="input w-32"
                  min="30"
                  max="3650"
                />
                <p className="text-xs text-slate-400 mt-1">Data older than this period will be automatically deleted</p>
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Email Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">SMTP Server</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">SMTP Port</label>
                  <input
                    type="number"
                    className="input w-32"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Username</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="App password"
                  />
                </div>
                <button className="btn-primary">Test Connection</button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">SMS Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Twilio Account SID</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Twilio Auth Token</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Your auth token"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Twilio Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="+1234567890"
                  />
                </div>
                <button className="btn-primary">Test SMS</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

