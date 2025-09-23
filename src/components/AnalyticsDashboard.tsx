'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import DynamicDataService from '@/lib/dynamic-data-service'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  revenue: number
  newClients: number
  activeProjects: number
  completedProjects: number
  pendingInvoices: number
}

interface AnalyticsDashboardProps {
  onGenerateReport?: () => void
}

interface ChartData {
  name: string
  value: number
  color?: string
  [key: string]: any
}

interface TimeSeriesData {
  date: string
  visitors: number
  pageViews: number
  revenue: number
  conversions: number
}

interface DeviceData {
  device: string
  visitors: number
  percentage: number
  color: string
  name: string
  value: number
}

interface ProjectStatusData {
  status: string
  count: number
  color: string
}

interface RevenueData {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface ClientAcquisitionData {
  source: string
  clients: number
  conversion: number
  color: string
}

export default function AnalyticsDashboard({ onGenerateReport }: AnalyticsDashboardProps = {}) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
    revenue: 0,
    newClients: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingInvoices: 0
  })
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [deviceData, setDeviceData] = useState<DeviceData[]>([])
  const [projectStatusData, setProjectStatusData] = useState<ProjectStatusData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [clientAcquisitionData, setClientAcquisitionData] = useState<ClientAcquisitionData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  // Load real data from Supabase
  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true)
      try {
        // Load all data in parallel
        const [
          analyticsData,
          timeSeriesData,
          deviceData,
          projectStatusData,
          revenueData,
          clientAcquisitionData
        ] = await Promise.all([
          DynamicDataService.getAnalyticsData(),
          DynamicDataService.getTimeSeriesData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365),
          DynamicDataService.getDeviceData(),
          DynamicDataService.getProjectStatusData(),
          DynamicDataService.getRevenueData(),
          DynamicDataService.getClientAcquisitionData()
        ])

        setAnalyticsData(analyticsData)
        setTimeSeriesData(timeSeriesData)
        setDeviceData(deviceData)
        setProjectStatusData(projectStatusData)
        setRevenueData(revenueData)
        setClientAcquisitionData(clientAcquisitionData)

        // Track page view
        await DynamicDataService.trackPageView('analytics')
      } catch (error) {
        console.error('Error loading analytics data:', error)
        // Fallback to empty data
        setAnalyticsData({
          pageViews: 0,
          uniqueVisitors: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          conversionRate: 0,
          revenue: 0,
          newClients: 0,
          activeProjects: 0,
          completedProjects: 0,
          pendingInvoices: 0
        })
      } finally {
        setLoading(false)
      }
    }

    loadRealData()
  }, [timeRange])

  const refreshData = async () => {
    setLoading(true)
    try {
      // Reload all data
      const [
        analyticsData,
        timeSeriesData,
        deviceData,
        projectStatusData,
        revenueData,
        clientAcquisitionData
      ] = await Promise.all([
        DynamicDataService.getAnalyticsData(),
        DynamicDataService.getTimeSeriesData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365),
        DynamicDataService.getDeviceData(),
        DynamicDataService.getProjectStatusData(),
        DynamicDataService.getRevenueData(),
        DynamicDataService.getClientAcquisitionData()
      ])

      setAnalyticsData(analyticsData)
      setTimeSeriesData(timeSeriesData)
      setDeviceData(deviceData)
      setProjectStatusData(projectStatusData)
      setRevenueData(revenueData)
      setClientAcquisitionData(clientAcquisitionData)

      // Track refresh event
      await DynamicDataService.trackEvent('analytics_refresh', { timeRange })
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    {
      title: 'Page Views',
      value: analyticsData.pageViews.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Unique Visitors',
      value: analyticsData.uniqueVisitors.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue',
      value: `$${analyticsData.revenue.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.conversionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Bounce Rate',
      value: `${analyticsData.bounceRate}%`,
      change: '-3.2%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avg Session',
      value: `${Math.floor(analyticsData.avgSessionDuration / 60)}m ${analyticsData.avgSessionDuration % 60}s`,
      change: '+5.7%',
      trend: 'up',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          {onGenerateReport && (
            <button
              onClick={onGenerateReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className={`flex items-center text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Over Time</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Visitors</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Page Views</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="pageViews" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData as any}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="visitors"
                  label={({ device, percentage }) => `${device}: ${percentage}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                <Bar dataKey="profit" fill="#ffc658" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData as any} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Acquisition */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Client Acquisition Sources</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={clientAcquisitionData as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="clients" name="Clients" />
                <YAxis dataKey="conversion" name="Conversion %" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="clients" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
          <div className="space-y-4">
            {[
              { page: '/', views: 2450, change: '+12%' },
              { page: '/services', views: 1890, change: '+8%' },
              { page: '/portfolio', views: 1560, change: '+15%' },
              { page: '/about', views: 980, change: '+5%' },
              { page: '/contact', views: 720, change: '+22%' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.page}</p>
                  <p className="text-sm text-gray-600">{item.views.toLocaleString()} views</p>
                </div>
                <span className="text-sm text-green-600 font-medium">{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New client signed up', time: '2 hours ago', type: 'success' },
              { action: 'Project completed', time: '4 hours ago', type: 'info' },
              { action: 'Invoice sent', time: '6 hours ago', type: 'warning' },
              { action: 'Payment received', time: '1 day ago', type: 'success' },
              { action: 'Meeting scheduled', time: '2 days ago', type: 'info' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'success' ? 'bg-green-500' :
                  item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter Data
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-4 w-4 mr-2" />
              Custom View
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
