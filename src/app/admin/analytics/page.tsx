'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, Target, Calendar, Phone, Mail, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

interface AnalyticsData {
  totalLeads: number
  totalDeals: number
  pipelineValue: number
  conversionRate: number
  monthlyGrowth: number
  topSources: Array<{ source: string; count: number; percentage: number }>
  leadStatusDistribution: Array<{ status: string; count: number; percentage: number }>
  dealStageDistribution: Array<{ stage: string; count: number; value: number }>
  monthlyTrends: Array<{ month: string; leads: number; deals: number; revenue: number }>
  salesRepPerformance: Array<{ name: string; leads: number; deals: number; revenue: number; conversion: number }>
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    // Empty analytics data - no mock data
    const emptyData: AnalyticsData = {
      totalLeads: 0,
      totalDeals: 0,
      pipelineValue: 0,
      conversionRate: 0,
      monthlyGrowth: 0,
      topSources: [],
      leadStatusDistribution: [],
      dealStageDistribution: [],
      monthlyTrends: [],
      salesRepPerformance: []
    }

    setAnalyticsData(emptyData)
    setIsLoading(false)
  }, [selectedPeriod])

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AdminLayout currentPage="analytics">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Analytics Dashboard
          </h1>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-48"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-white">{analyticsData?.totalLeads}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{analyticsData?.monthlyGrowth}%</span>
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
                <p className="text-3xl font-bold text-white">{analyticsData?.totalDeals}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+8.2%</span>
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
                <p className="text-3xl font-bold text-white">{formatCurrency(analyticsData?.pipelineValue || 0)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+15.3%</span>
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
                <p className="text-3xl font-bold text-white">{formatPercentage(analyticsData?.conversionRate || 0)}</p>
                <div className="flex items-center mt-2">
                  <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-red-400 text-sm">-2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lead Sources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
            <div className="space-y-3">
              {analyticsData?.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-slate-300">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{source.count}</span>
                    <span className="text-slate-400 text-sm">({source.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Status Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Status Distribution</h3>
            <div className="space-y-3">
              {analyticsData?.leadStatusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'NEW' ? 'bg-blue-400' :
                      status.status === 'CONTACTED' ? 'bg-yellow-400' :
                      status.status === 'QUALIFIED' ? 'bg-green-400' :
                      status.status === 'PROPOSAL' ? 'bg-purple-400' :
                      status.status === 'CLOSED_WON' ? 'bg-emerald-400' :
                      'bg-red-400'
                    }`}></div>
                    <span className="text-slate-300">{status.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{status.count}</span>
                    <span className="text-slate-400 text-sm">({status.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Rep Performance */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Sales Rep Performance</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Sales Rep</th>
                  <th>Leads</th>
                  <th>Deals</th>
                  <th>Revenue</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.salesRepPerformance.map((rep, index) => (
                  <tr key={index}>
                    <td className="font-medium text-white">{rep.name}</td>
                    <td className="text-slate-300">{rep.leads}</td>
                    <td className="text-slate-300">{rep.deals}</td>
                    <td className="text-green-400 font-medium">{formatCurrency(rep.revenue)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rep.conversion >= 15 ? 'bg-green-100 text-green-800' :
                        rep.conversion >= 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatPercentage(rep.conversion)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Trends</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Leads</th>
                  <th>Deals</th>
                  <th>Revenue</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.monthlyTrends.map((trend, index) => (
                  <tr key={index}>
                    <td className="font-medium text-white">{trend.month}</td>
                    <td className="text-slate-300">{trend.leads}</td>
                    <td className="text-slate-300">{trend.deals}</td>
                    <td className="text-green-400 font-medium">{formatCurrency(trend.revenue)}</td>
                    <td>
                      <div className="flex items-center">
                        {index > 0 && trend.revenue > analyticsData.monthlyTrends[index - 1].revenue ? (
                          <ArrowUp className="h-4 w-4 text-green-400" />
                        ) : index > 0 ? (
                          <ArrowDown className="h-4 w-4 text-red-400" />
                        ) : (
                          <Activity className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

