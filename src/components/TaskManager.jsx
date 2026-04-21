import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, initializeAuth } from '../store/authSlice'
import TaskList from './TaskList'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import Projects from './Projects'
import TaskDetail from './TaskDetail'

const TaskManager = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { tasks } = useSelector((state) => state.tasks)
  const [showProfile, setShowProfile] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Calculate real task statistics
  const totalTasks = tasks.length
  
  // Get today's tasks count
  const todayTasks = tasks.filter(task => {
    if (!task.createdAt) return false
    const taskDate = new Date(task.createdAt).toDateString()
    const today = new Date().toDateString()
    return taskDate === today
  }).length
  
  const completedTasks = tasks.filter(task => task.completed === true).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logoutUser())
    window.location.reload() // Reload to reset the app state
  }

  const renderCurrentPage = () => {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/analytics" element={
          <div className="coming-soon">
            <h2>Analytics</h2>
            <p>Detailed analytics and reports coming soon!</p>
          </div>
        } />
        <Route path="/settings" element={
          <div className="coming-soon">
            <h2>Settings</h2>
            <p>Application settings and preferences coming soon!</p>
          </div>
        } />
      </Routes>
    )
  }

  if (!isAuthenticated) {
    return null // Will be handled by App component
  }

  return (
    <div className="task-manager">
      <Sidebar />
      
      <div className="main-content">
        <header className="app-header">
          <div className="header-nav">
            <div className="nav-stats">
              <div className="stat-item">
                <span className="stat-label">Total Tasks</span>
                <span className="stat-value">{totalTasks}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{completedTasks}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{pendingTasks}</span>
              </div>
            </div>

            <div className="profile-section">
              <button 
                className="profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.name}</span>
                  <span className="profile-role">Administrator</span>
                </div>
                <svg className="profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="dropdown-user-info">
                      <h4>{user?.name}</h4>
                      <p>{user?.email}</p>
                      <span className="user-status">Active</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <button 
                      className="dropdown-item logout-item"
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16,17 21,12 16,7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLogoutConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout? Any unsaved changes will be lost.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskManager
