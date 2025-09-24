'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Stethoscope,
  Heart,
  Pill,
  Shield,
  Bell,
  Search,
  Filter,
  Plus,
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
  Globe,
  Code,
  Palette,
  Database,
  Smartphone,
  Monitor,
  Server,
  Cloud,
  Award,
  PieChart,
  LineChart,
  TrendingDown,
  TrendingUp,
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
  Flame,
  Snowflake,
  Sun,
  Moon,
  Sparkles,
  Thermometer,
  Syringe,
  Microscope,
  Brain,
  Bone,
  Eye as EyeIcon,
  Ear,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle as XCircleIcon,
  Loader2 as Loader2Icon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Share2 as Share2Icon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  UserPlus as UserPlusIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Globe as GlobeIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Database as DatabaseIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Server as ServerIcon,
  Cloud as CloudIcon,
  Shield as ShieldIcon,
  Award as AwardIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingDown as TrendingDownIcon,
  MoreHorizontal as MoreHorizontalIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Hexagon as HexagonIcon,
  Octagon as OctagonIcon,
  Diamond as DiamondIcon,
  Flame as FlameIcon,
  Snowflake as SnowflakeIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sparkles as SparklesIcon
} from 'lucide-react'

const patients = [
  {
    id: 1,
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    lastVisit: '2024-12-01',
    nextAppointment: '2024-12-15',
    status: 'Active',
    conditions: ['Hypertension', 'Diabetes Type 2'],
    medications: ['Metformin', 'Lisinopril'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    emergencyContact: 'Jane Smith (555) 123-4568',
    insurance: 'Blue Cross Blue Shield',
    primaryDoctor: 'Dr. Sarah Wilson',
    lastVitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 180,
      height: 72
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    phone: '(555) 234-5678',
    email: 'sarah.johnson@email.com',
    lastVisit: '2024-11-28',
    nextAppointment: '2024-12-20',
    status: 'Active',
    conditions: ['Asthma', 'Seasonal Allergies'],
    medications: ['Albuterol', 'Loratadine'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    bloodType: 'A+',
    allergies: ['Pollen', 'Dust'],
    emergencyContact: 'Mike Johnson (555) 234-5679',
    insurance: 'Aetna',
    primaryDoctor: 'Dr. Michael Brown',
    lastVitals: {
      bloodPressure: '110/70',
      heartRate: 68,
      temperature: 98.4,
      weight: 135,
      height: 65
    }
  },
  {
    id: 3,
    name: 'Robert Davis',
    age: 58,
    gender: 'Male',
    phone: '(555) 345-6789',
    email: 'robert.davis@email.com',
    lastVisit: '2024-11-25',
    nextAppointment: '2024-12-18',
    status: 'Active',
    conditions: ['High Cholesterol', 'Arthritis'],
    medications: ['Atorvastatin', 'Ibuprofen'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    bloodType: 'B+',
    allergies: ['Latex'],
    emergencyContact: 'Linda Davis (555) 345-6790',
    insurance: 'Cigna',
    primaryDoctor: 'Dr. Sarah Wilson',
    lastVitals: {
      bloodPressure: '135/85',
      heartRate: 75,
      temperature: 98.8,
      weight: 195,
      height: 70
    }
  },
  {
    id: 4,
    name: 'Emily Wilson',
    age: 28,
    gender: 'Female',
    phone: '(555) 456-7890',
    email: 'emily.wilson@email.com',
    lastVisit: '2024-12-03',
    nextAppointment: '2024-12-22',
    status: 'Active',
    conditions: ['Migraine', 'Anxiety'],
    medications: ['Sumatriptan', 'Sertraline'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    bloodType: 'AB+',
    allergies: ['None'],
    emergencyContact: 'Tom Wilson (555) 456-7891',
    insurance: 'UnitedHealth',
    primaryDoctor: 'Dr. Michael Brown',
    lastVitals: {
      bloodPressure: '105/65',
      heartRate: 70,
      temperature: 98.2,
      weight: 125,
      height: 64
    }
  }
]

const appointments = [
  {
    id: 1,
    patient: 'John Smith',
    doctor: 'Dr. Sarah Wilson',
    date: '2024-12-15',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'Scheduled',
    duration: 30,
    notes: 'Blood pressure check and medication review',
    room: 'Room 101'
  },
  {
    id: 2,
    patient: 'Sarah Johnson',
    doctor: 'Dr. Michael Brown',
    date: '2024-12-20',
    time: '2:30 PM',
    type: 'Consultation',
    status: 'Scheduled',
    duration: 45,
    notes: 'Asthma management and allergy testing',
    room: 'Room 205'
  },
  {
    id: 3,
    patient: 'Robert Davis',
    doctor: 'Dr. Sarah Wilson',
    date: '2024-12-18',
    time: '9:15 AM',
    type: 'Annual Checkup',
    status: 'Scheduled',
    duration: 60,
    notes: 'Complete physical examination and lab work',
    room: 'Room 101'
  },
  {
    id: 4,
    patient: 'Emily Wilson',
    doctor: 'Dr. Michael Brown',
    date: '2024-12-22',
    time: '11:45 AM',
    type: 'Follow-up',
    status: 'Scheduled',
    duration: 30,
    notes: 'Migraine treatment review',
    room: 'Room 205'
  }
]

const medicalRecords = [
  {
    id: 1,
    patient: 'John Smith',
    date: '2024-12-01',
    type: 'Visit',
    doctor: 'Dr. Sarah Wilson',
    diagnosis: 'Hypertension - Well Controlled',
    treatment: 'Continue current medication, lifestyle counseling',
    notes: 'Patient reports good adherence to medication. Blood pressure within target range.',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 180
    },
    prescriptions: ['Lisinopril 10mg daily', 'Metformin 500mg twice daily'],
    followUp: '3 months'
  },
  {
    id: 2,
    patient: 'Sarah Johnson',
    date: '2024-11-28',
    type: 'Visit',
    doctor: 'Dr. Michael Brown',
    diagnosis: 'Asthma - Stable',
    treatment: 'Continue inhaler, environmental modifications',
    notes: 'Patient doing well with current treatment. No recent exacerbations.',
    vitals: {
      bloodPressure: '110/70',
      heartRate: 68,
      temperature: 98.4,
      weight: 135
    },
    prescriptions: ['Albuterol inhaler as needed', 'Loratadine 10mg daily'],
    followUp: '6 months'
  }
]

const labResults = [
  {
    id: 1,
    patient: 'John Smith',
    date: '2024-12-01',
    type: 'Blood Work',
    status: 'Completed',
    results: {
      glucose: '95 mg/dL',
      cholesterol: '180 mg/dL',
      hba1c: '6.2%',
      creatinine: '1.0 mg/dL'
    },
    notes: 'All values within normal range. Diabetes well controlled.',
    doctor: 'Dr. Sarah Wilson'
  },
  {
    id: 2,
    patient: 'Robert Davis',
    date: '2024-11-25',
    type: 'Lipid Panel',
    status: 'Completed',
    results: {
      totalCholesterol: '220 mg/dL',
      ldl: '140 mg/dL',
      hdl: '45 mg/dL',
      triglycerides: '175 mg/dL'
    },
    notes: 'Cholesterol levels elevated. Consider statin therapy.',
    doctor: 'Dr. Sarah Wilson'
  }
]

const medications = [
  {
    id: 1,
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    patient: 'John Smith',
    prescribed: '2024-10-15',
    refills: 3,
    status: 'Active',
    sideEffects: ['Nausea', 'Diarrhea'],
    interactions: ['Alcohol', 'Contrast dye']
  },
  {
    id: 2,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    patient: 'John Smith',
    prescribed: '2024-10-15',
    refills: 5,
    status: 'Active',
    sideEffects: ['Dry cough', 'Dizziness'],
    interactions: ['Potassium supplements', 'NSAIDs']
  },
  {
    id: 3,
    name: 'Albuterol',
    dosage: '90mcg',
    frequency: 'As needed',
    patient: 'Sarah Johnson',
    prescribed: '2024-11-01',
    refills: 2,
    status: 'Active',
    sideEffects: ['Tremor', 'Nervousness'],
    interactions: ['Beta-blockers', 'Diuretics']
  }
]

const notifications = [
  { id: 1, title: 'Appointment Reminder', message: 'John Smith has an appointment tomorrow at 10:00 AM', time: '2 hours ago', type: 'appointment', read: false },
  { id: 2, title: 'Lab Results Ready', message: 'Blood work results for Robert Davis are available', time: '4 hours ago', type: 'lab', read: false },
  { id: 3, title: 'Medication Refill Due', message: 'Sarah Johnson needs a refill for Albuterol', time: '1 day ago', type: 'medication', read: true },
  { id: 4, title: 'New Patient Registration', message: 'Lisa Park has been registered as a new patient', time: '2 days ago', type: 'patient', read: true }
]

const metrics = [
  { label: 'Total Patients', value: '1,247', change: '+23', trend: 'up', color: 'green' },
  { label: 'Today\'s Appointments', value: '18', change: '+3', trend: 'up', color: 'blue' },
  { label: 'Active Medications', value: '342', change: '+12', trend: 'up', color: 'purple' },
  { label: 'Lab Results Pending', value: '8', change: '-2', trend: 'down', color: 'orange' }
]

export default function HealthcareDemo() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.phone.includes(searchQuery)
    const matchesStatus = filterStatus === 'all' || patient.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'in progress': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const renderDashboard = () => (
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
              <div className={`p-3 rounded-full bg-gradient-to-r ${
                metric.color === 'green' ? 'from-green-500 to-green-700' :
                metric.color === 'blue' ? 'from-blue-500 to-blue-700' :
                metric.color === 'purple' ? 'from-purple-500 to-purple-700' :
                'from-orange-500 to-orange-700'
              } text-white shadow-lg`}>
                <Stethoscope className="h-6 w-6" />
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

      {/* Today's Appointments */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Today's Appointments
          </h2>
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span>New Appointment</span>
          </button>
        </div>

        <div className="space-y-4">
          {appointments.slice(0, 4).map((appointment) => (
            <div
              key={appointment.id}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getAppointmentStatusColor(appointment.status)}`}></div>
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.patient}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {appointment.doctor} • {appointment.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {appointment.time}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {appointment.room}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                {appointment.notes}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Duration: {appointment.duration} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Medical Records */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Recent Medical Records
        </h3>
        <div className="space-y-4">
          {medicalRecords.map((record) => (
            <div key={record.id} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {record.patient}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {record.date} • {record.doctor}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {record.type}
                </span>
              </div>
              <div className="space-y-2">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Treatment:</span> {record.treatment}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Follow-up:</span> {record.followUp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPatients = () => (
    <div className="space-y-6">
      {/* Patient Search and Filters */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Patients ({filteredPatients.length})
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>New Patient</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(patient.status)}`}></div>
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {patient.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {patient.age} years • {patient.gender}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Blood Type</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {patient.bloodType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Last Visit</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {patient.lastVisit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Next Appointment</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {patient.nextAppointment}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.slice(0, 2).map((condition, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)} text-white`}>
                    {patient.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {patient.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Appointments
          </h3>
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span>Schedule Appointment</span>
          </button>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getAppointmentStatusColor(appointment.status)}`}></div>
                  <div>
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.patient}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {appointment.doctor} • {appointment.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {appointment.time}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {appointment.date}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                {appointment.notes}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </span>
                <div className="flex items-center space-x-4">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Room: {appointment.room}
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Duration: {appointment.duration} min
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMedications = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Medication Management
        </h3>

        <div className="space-y-4">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Pill className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {medication.name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {medication.dosage} • {medication.frequency}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  medication.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {medication.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {medication.patient}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Refills</p>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {medication.refills} remaining
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Side Effects</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medication.sideEffects.map((effect, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interactions</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {medication.interactions.map((interaction, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                      >
                        {interaction}
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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>
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
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    HealthCare Pro
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Medical Management System
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
              { id: 'dashboard', name: 'Dashboard', icon: Activity },
              { id: 'patients', name: 'Patients', icon: User },
              { id: 'appointments', name: 'Appointments', icon: Calendar },
              { id: 'medications', name: 'Medications', icon: Pill }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'medications' && renderMedications()}
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
                  <div key={notification.id} className={`p-4 rounded-xl ${notification.read ? 'bg-gray-50' : 'bg-green-50'} border border-gray-200`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-400' : 'bg-green-500'}`}></div>
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
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
            <p className="text-gray-600">Updating...</p>
          </div>
        </div>
      )}
    </div>
  )
}