import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTasks } from '../store/taskSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { tasks } = useSelector((state) => state.tasks)
  const navigate = useNavigate()

  // Fetch tasks when Dashboard loads
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  // Calculate real task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed === true).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Get today's tasks count
  const todayTasks = tasks.filter(task => {
    if (!task.createdAt) return false
    const taskDate = new Date(task.createdAt).toDateString()
    const today = new Date().toDateString()
    return taskDate === today
  }).length

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Handle task click to navigate to detail page
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`)
  }

  // Calculate weekly data based on actual tasks
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekData = days.map(day => ({ day, completed: 0, pending: 0 }))
    
    tasks.forEach(task => {
      if (task.createdAt) {
        const taskDate = new Date(task.createdAt)
        const dayOfWeek = days[taskDate.getDay()]
        const dayData = weekData.find(d => d.day === dayOfWeek)
        if (dayData) {
          if (task.completed) {
            dayData.completed++
          } else {
            dayData.pending++
          }
        }
      }
    })
    
    return weekData
  }

  const weeklyData = getWeeklyData()

  
  // Get upcoming tasks (pending tasks)
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)
      return dateA - dateB
    })
    .slice(0, 4)
    .map((task, index) => ({
      id: task._id || task.id || index,
      originalId: task._id || task.id,
      title: task.title,
      dueDate: getTimeAgo(task.createdAt) || 'No due date',
      priority: 'medium' // Default priority since we don't have priority field
    }))

  // Get team members (simplified - just current user info)
  const teamMembers = user ? [{
    id: 1,
    name: user.name || 'Current User',
    role: 'User',
    tasks: tasks.length,
    avatar: (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }] : []

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Weekly Activity Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Weekly Activity</h3>
            <div className="card-actions">
              <button className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="weekly-chart">
              {weeklyData.map((day, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-stack">
                    <div 
                      className="bar completed" 
                      style={{ height: `${(day.completed / 10) * 100}%` }}
                    ></div>
                    <div 
                      className="bar pending" 
                      style={{ height: `${(day.pending / 10) * 100}%` }}
                    ></div>
                  </div>
                  <div className="bar-label">{day.day}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color completed"></div>
                <span>Completed</span>
              </div>
              <div className="legend-item">
                <div className="legend-color pending"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        
        {/* Upcoming Tasks */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Upcoming Tasks</h3>
            <div className="card-actions">
              <button className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="task-list">
              {upcomingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="task-item clickable"
                  onClick={() => handleTaskClick(task.originalId)}
                >
                  <div className="task-info">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className="task-due">{task.dueDate}</span>
                      <span className={`task-priority ${task.priority}`}>{task.priority}</span>
                    </div>
                  </div>
                  <button className="task-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Team Members</h3>
            <div className="card-actions">
              <button className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="team-list">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member">
                  <div className="member-avatar">{member.avatar}</div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                  <div className="member-tasks">
                    <span className="tasks-count">{member.tasks}</span>
                    <span className="tasks-label">tasks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
