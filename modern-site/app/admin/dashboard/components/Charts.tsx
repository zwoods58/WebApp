'use client'

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#14b8a6', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']

export function RevenueTrendChart({ data }: { data: Array<{ date: string; revenue: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number | string) => `$${Number(value).toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} name="Revenue" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function UserGrowthChart({ data }: { data: Array<{ date: string; users: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="users" fill="#3b82f6" name="New Users" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function SubscriptionStatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

