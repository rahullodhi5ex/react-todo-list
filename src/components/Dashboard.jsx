import React from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { tasks } = useSelector((state) => state.tasks)

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

  // Dummy data for charts and recent activities
  const weeklyData = [
    { day: 'Mon', completed: 5, pending: 2 },
    { day: 'Tue', completed: 3, pending: 4 },
    { day: 'Wed', completed: 7, pending: 1 },
    { day: 'Thu', completed: 4, pending: 3 },
    { day: 'Fri', completed: 6, pending: 2 },
    { day: 'Sat', completed: 8, pending: 1 },
    { day: 'Sun', completed: 2, pending: 0 },
  ]

  const recentActivities = [
    { id: 1, action: 'Completed task', task: 'Review project proposal', time: '2 hours ago', type: 'completed' },
    { id: 2, action: 'Created new task', task: 'Update documentation', time: '4 hours ago', type: 'created' },
    { id: 3, action: 'Updated task', task: 'Fix bug in authentication', time: '6 hours ago', type: 'updated' },
    { id: 4, action: 'Completed task', task: 'Team meeting preparation', time: '8 hours ago', type: 'completed' },
    { id: 5, action: 'Created new task', task: 'Code review for PR #123', time: '1 day ago', type: 'created' },
  ]

  const upcomingTasks = [
    { id: 1, title: 'Quarterly review meeting', dueDate: 'Today', priority: 'high' },
    { id: 2, title: 'Submit project report', dueDate: 'Tomorrow', priority: 'medium' },
    { id: 3, title: 'Client presentation', dueDate: 'In 3 days', priority: 'high' },
    { id: 4, title: 'Team building event', dueDate: 'Next week', priority: 'low' },
  ]

  const teamMembers = [
    { id: 1, name: 'Sarah Johnson', role: 'Frontend Developer', tasks: 8, avatar: 'SJ' },
    { id: 2, name: 'Mike Chen', role: 'Backend Developer', tasks: 12, avatar: 'MC' },
    { id: 3, name: 'Emily Davis', role: 'UI Designer', tasks: 6, avatar: 'ED' },
    { id: 4, name: 'Alex Wilson', role: 'Project Manager', tasks: 4, avatar: 'AW' },
  ]

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

        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <div className="card-actions">
              <button className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'completed' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                      </svg>
                    )}
                    {activity.type === 'created' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    )}
                    {activity.type === 'updated' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    )}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-task">{activity.task}</span>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
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
                <div key={task.id} className="task-item">
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
