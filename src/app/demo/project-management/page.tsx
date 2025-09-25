'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  User,
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  Target,
  TrendingUp,
  Activity,
  FileText,
  Settings,
  Bell,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  ArrowRight,
  Star,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  X,
  Download,
  Upload,
  Share2,
  Lock,
  Unlock,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Globe,
  Code,
  Palette,
  Database,
  Smartphone,
  Monitor,
  Server,
  Cloud,
  Shield,
  Award,
  PieChart,
  LineChart,
  TrendingDown,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Heart,
  Flame,
  Snowflake,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react'

const projects = [
  { 
    id: 1, 
    name: 'E-Commerce Platform Redesign', 
    progress: 75, 
    status: 'In Progress', 
    team: 5, 
    deadline: 'Dec 15, 2024',
    priority: 'High',
    budget: 45000,
    spent: 32000,
    client: 'TechCorp Inc.',
    color: 'purple',
    description: 'Complete redesign of the e-commerce platform with modern UI/UX and enhanced performance',
    tags: ['Frontend', 'Backend', 'UI/UX', 'E-commerce'],
    startDate: '2024-10-01',
    estimatedHours: 800,
    completedHours: 600
  },
  { 
    id: 2, 
    name: 'E-commerce Platform', 
    progress: 45, 
    status: 'In Progress', 
    team: 8, 
    deadline: 'Jan 20, 2025',
    priority: 'Critical',
    budget: 75000,
    spent: 28000,
    client: 'RetailMax',
    color: 'blue',
    description: 'Comprehensive e-commerce platform with advanced inventory management and payment processing',
    tags: ['E-commerce', 'Web', 'Payment', 'Inventory'],
    startDate: '2024-11-01',
    estimatedHours: 1200,
    completedHours: 540
  },
  { 
    id: 3, 
    name: 'AI Analytics Dashboard', 
    progress: 100, 
    status: 'Completed', 
    team: 3, 
    deadline: 'Nov 30, 2024',
    priority: 'Medium',
    budget: 25000,
    spent: 25000,
    client: 'DataInsights LLC',
    color: 'green',
    description: 'Advanced analytics dashboard with machine learning insights and predictive modeling',
    tags: ['AI/ML', 'Analytics', 'Dashboard', 'Data Science'],
    startDate: '2024-09-01',
    estimatedHours: 400,
    completedHours: 400
  },
  { 
    id: 4, 
    name: 'Cloud Migration Project', 
    progress: 20, 
    status: 'Planning', 
    team: 4, 
    deadline: 'Feb 10, 2025',
    priority: 'High',
    budget: 60000,
    spent: 5000,
    client: 'Enterprise Solutions',
    color: 'orange',
    description: 'Migration of legacy systems to cloud infrastructure with zero downtime',
    tags: ['Cloud', 'DevOps', 'Migration', 'Infrastructure'],
    startDate: '2024-12-01',
    estimatedHours: 1000,
    completedHours: 200
  }
]

const tasks = [
  { 
    id: 1, 
    title: 'Design user interface mockups', 
    project: 'E-Commerce Platform Redesign', 
    assignee: 'Sarah Johnson', 
    due: 'Dec 10, 2024', 
    priority: 'High', 
    status: 'In Progress',
    estimatedHours: 40,
    completedHours: 25,
    description: 'Create high-fidelity mockups for all user interfaces including product pages, checkout flow, and admin dashboard',
    tags: ['Design', 'UI/UX', 'Mockups'],
    created: '2024-11-15',
    updated: '2024-12-01'
  },
  { 
    id: 2, 
    title: 'Set up development environment', 
    project: 'E-commerce Platform', 
    assignee: 'Mike Chen', 
    due: 'Dec 12, 2024', 
    priority: 'Medium', 
    status: 'Completed',
    estimatedHours: 16,
    completedHours: 16,
    description: 'Configure development environment with all necessary tools, dependencies, and security protocols',
    tags: ['DevOps', 'Setup', 'Environment'],
    created: '2024-11-20',
    updated: '2024-12-05'
  },
  { 
    id: 3, 
    title: 'Write API documentation', 
    project: 'Cloud Migration Project', 
    assignee: 'Alex Rodriguez', 
    due: 'Dec 18, 2024', 
    priority: 'Low', 
    status: 'To Do',
    estimatedHours: 24,
    completedHours: 0,
    description: 'Comprehensive API documentation with examples, authentication, and error handling',
    tags: ['Documentation', 'API', 'Technical Writing'],
    created: '2024-12-01',
    updated: '2024-12-01'
  },
  { 
    id: 4, 
    title: 'Test payment processing', 
    project: 'E-Commerce Platform Redesign', 
    assignee: 'Emma Wilson', 
    due: 'Dec 14, 2024', 
    priority: 'High', 
    status: 'In Progress',
    estimatedHours: 32,
    completedHours: 18,
    description: 'Comprehensive testing of payment gateway integration including edge cases and security validation',
    tags: ['Testing', 'Payments', 'Security'],
    created: '2024-11-25',
    updated: '2024-12-03'
  }
]

const teamMembers = [
  { 
    name: 'Sarah Johnson', 
    role: 'UI/UX Designer', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', 
    status: 'online',
    email: 'sarah.johnson@company.com',
    phone: '(555) 123-4567',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
    projects: 3,
    tasks: 12,
    performance: 95
  },
  { 
    name: 'Mike Chen', 
    role: 'Backend Developer', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', 
    status: 'online',
    email: 'mike.chen@company.com',
    phone: '(555) 234-5678',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
    projects: 4,
    tasks: 18,
    performance: 92
  },
  { 
    name: 'Alex Rodriguez', 
    role: 'Frontend Developer', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', 
    status: 'away',
    email: 'alex.rodriguez@company.com',
    phone: '(555) 345-6789',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    projects: 2,
    tasks: 8,
    performance: 88
  },
  { 
    name: 'Emma Wilson', 
    role: 'QA Engineer', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', 
    status: 'online',
    email: 'emma.wilson@company.com',
    phone: '(555) 456-7890',
    skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing'],
    projects: 3,
    tasks: 15,
    performance: 90
  },
  { 
    name: 'David Kim', 
    role: 'Project Manager', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', 
    status: 'offline',
    email: 'david.kim@company.com',
    phone: '(555) 567-8901',
    skills: ['Agile', 'Scrum', 'Jira', 'Leadership'],
    projects: 5,
    tasks: 25,
    performance: 96
  }
]

const metrics = [
  { label: 'Active Projects', value: '12', change: '+2', trend: 'up', color: 'purple' },
  { label: 'Completed Tasks', value: '156', change: '+23', trend: 'up', color: 'green' },
  { label: 'Team Members', value: '24', change: '+3', trend: 'up', color: 'blue' },
  { label: 'On-Time Delivery', value: '94%', change: '+5%', trend: 'up', color: 'orange' }
]

const recentActivities = [
  { id: 1, user: 'Sarah Johnson', action: 'completed task "Design user interface mockups"', time: '2 hours ago', type: 'task' },
  { id: 2, user: 'Mike Chen', action: 'added comment to "E-commerce Platform" project', time: '4 hours ago', type: 'comment' },
  { id: 3, user: 'Emma Wilson', action: 'created new task "Test payment processing"', time: '6 hours ago', type: 'task' },
  { id: 4, user: 'David Kim', action: 'updated project timeline for "E-Commerce Platform"', time: '1 day ago', type: 'project' },
  { id: 5, user: 'Alex Rodriguez', action: 'uploaded files to "Cloud Migration Project"', time: '2 days ago', type: 'file' }
]

const notifications = [
  { id: 1, title: 'Project Deadline Approaching', message: 'E-Commerce Platform Redesign due in 3 days', time: '1 hour ago', type: 'deadline', read: false },
  { id: 2, title: 'Task Completed', message: 'Sarah Johnson completed "Design user interface mockups"', time: '2 hours ago', type: 'task', read: false },
  { id: 3, title: 'New Team Member', message: 'Welcome Lisa Park to the team!', time: '1 day ago', type: 'team', read: true },
  { id: 4, title: 'Budget Alert', message: 'E-commerce Platform project is 80% through budget', time: '2 days ago', type: 'budget', read: true }
]

export default function ProjectManagementDemo() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesPriority = filterPriority === 'all' || task.priority.toLowerCase() === filterPriority.toLowerCase()
    return matchesSearch && matchesStatus && matchesPriority
  })

  const filteredProjects = projects.filter(project => {
    return project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           project.client.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500'
      case 'in progress': return 'bg-blue-500'
      case 'to do': return 'bg-gray-500'
      case 'planning': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getProjectColor = (color: string) => {
    switch (color) {
      case 'purple': return 'from-purple-500 to-purple-700'
      case 'blue': return 'from-blue-500 to-blue-700'
      case 'green': return 'from-green-500 to-green-700'
      case 'orange': return 'from-orange-500 to-orange-700'
      default: return 'from-gray-500 to-gray-700'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${getProjectColor(metric.color)} text-white shadow-lg`}>
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {metric.change}
              </div>
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
              {metric.value}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Active Projects
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getProjectColor(project.color)}`}></div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {project.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getProjectColor(project.color)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{project.team}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{project.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'task' ? 'bg-green-100 text-green-600' :
                activity.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'project' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {activity.type === 'task' ? <CheckSquare className="h-5 w-5" /> :
                 activity.type === 'comment' ? <MessageSquare className="h-5 w-5" /> :
                 activity.type === 'project' ? <Target className="h-5 w-5" /> :
                 <FileText className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      {/* Task Filters */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="all">All Status</option>
              <option value="to do">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={`px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tasks ({filteredTasks.length})
          </h3>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>New Task</span>
          </button>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {task.title}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Project: <span className="font-medium">{task.project}</span>
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Assignee: <span className="font-medium">{task.assignee}</span>
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Due: <span className="font-medium">{task.due}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} text-white`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} text-white`}>
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round((task.completedHours / task.estimatedHours) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {task.completedHours} / {task.estimatedHours} hours
                  </span>
                  <div className="flex space-x-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTeam = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Team Members
          </h3>
          <button
            onClick={() => setShowTeamModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
          >
            <UserPlus className="h-5 w-5" />
            <span>Invite Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'away' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Performance</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.performance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${member.performance}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.projects}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Projects</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.tasks}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tasks</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Project Analytics
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Project Status Distribution
            </h4>
            <div className="space-y-3">
              {['Completed', 'In Progress', 'Planning'].map((status, index) => {
                const count = projects.filter(p => p.status === status).length
                const percentage = (count / projects.length) * 100
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{status}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' :
                            index === 1 ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Team Performance
            </h4>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{member.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                        style={{ width: `${member.performance}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.performance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-indigo-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/portfolio" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ProjectFlow
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Project Management Dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5 text-gray-400" /> : <Moon className="h-5 w-5 text-gray-400" />}
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-400" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw className={`h-5 w-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'tasks', name: 'Tasks', icon: CheckSquare },
              { id: 'team', name: 'Team', icon: Users },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>

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
                  <div key={notification.id} className={`p-4 rounded-xl ${notification.read ? 'bg-gray-50' : 'bg-purple-50'} border border-gray-200`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-400' : 'bg-purple-500'}`}></div>
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600">Updating...</p>
          </div>
        </div>
      )}
    </div>
  )
}