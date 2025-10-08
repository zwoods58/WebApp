'use client'

import { useState, useEffect } from 'react'
import { Plus, Target, CheckCircle, AlertCircle } from 'lucide-react'
import TaskFormModal from '@/components/TaskFormModal'
import AdminLayout from '@/components/AdminLayout'

interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE'
  category: string
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        })

        if (response.ok) {
          const updatedTask = await response.json()
          setTasks(prev => prev.map(task => 
            task.id === editingTask.id ? updatedTask : task
          ))
        }
      } else {
        // Add new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        })

        if (response.ok) {
          const newTask = await response.json()
          setTasks(prev => [newTask, ...prev])
        }
      }
      setEditingTask(null)
      setShowAddModal(false)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId))
    }
  }

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
            updatedAt: new Date().toISOString()
          }
        : task
    ))
  }

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Admin: Fetching tasks...')
        const response = await fetch('/api/tasks')
        console.log('Admin: Response status:', response.status)
        if (response.ok) {
          const data = await response.json()
          console.log('Admin: Fetched tasks:', data)
          setTasks(data)
        } else {
          console.error('Admin: Failed to fetch tasks, status:', response.status)
        }
      } catch (error) {
        console.error('Admin: Error fetching tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Tasks...
      </div>
    )
  }

  return (
    <AdminLayout currentPage="tasks">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Task Management
        </h1>

        {/* Simple Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-400">{tasks.length}</div>
            <div className="text-slate-400 text-sm">Total Tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {tasks.filter(t => t.status === 'PENDING').length}
            </div>
            <div className="text-slate-400 text-sm">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400">
              {tasks.filter(t => t.status === 'COMPLETED').length}
            </div>
            <div className="text-slate-400 text-sm">Completed</div>
          </div>
        </div>

        {/* Simple Add Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => { setEditingTask(null); setShowAddModal(true); }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Simple Tasks List */}
        <div className="space-y-4 mb-8">
          {tasks.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-slate-400 mb-4">
                <Target className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg">No tasks yet</p>
                <p className="text-sm">Click "Add Task" to create your first task</p>
              </div>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        task.status === 'COMPLETED'
                          ? 'bg-green-600 border-green-600'
                          : 'border-slate-400'
                      }`}
                    >
                      {task.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 text-white" />}
                    </button>
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-slate-300 text-sm mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-yellow-400 hover:text-yellow-300 p-1"
                      title="Edit Task"
                    >
                      <Target className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete Task"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        <TaskFormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveTask}
        />
        
        <TaskFormModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </div>
    </AdminLayout>
  )
}