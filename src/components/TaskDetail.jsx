import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { updateTask, deleteTask } from '../store/taskSlice'
import TaskForm from './TaskForm'

const TaskDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { tasks, status } = useSelector((state) => state.tasks)
  const [showEditForm, setShowEditForm] = useState(false)
  
  const task = tasks.find(t => t._id === id || t.id === id)

  useEffect(() => {
    if (!task) {
      // Task not found, redirect to tasks page
      navigate('/tasks')
    }
  }, [task, navigate])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task._id || task.id))
      navigate('/tasks')
    }
  }

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleFormClose = () => {
    setShowEditForm(false)
  }

  const handleStatusToggle = () => {
    const updatedTask = {
      ...task,
      completed: !task.completed
    }
    dispatch(updateTask({ 
      id: task._id || task.id, 
      taskData: updatedTask 
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProjectName = (project) => {
    if (!project) return 'No Project'
    if (typeof project === 'string') return project
    return project.title || 'Unnamed Project'
  }

  if (!task) {
    return <div className="loading">Loading task details...</div>
  }

  return (
    <div className="task-detail">
      <div className="task-detail-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleEdit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Task
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="task-detail-content">
        <div className="task-main-info">
          <div className="task-title-section">
            <h1 className="task-title">{task.title}</h1>
            <div className="task-status">
              <button 
                className={`status-toggle ${task.completed ? 'completed' : 'pending'}`}
                onClick={handleStatusToggle}
              >
                {task.completed ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                    Completed
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    Pending
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="task-meta">
            <div className="meta-item">
              <strong>Project:</strong> {getProjectName(task.project)}
            </div>
            <div className="meta-item">
              <strong>Created:</strong> {formatDate(task.createdAt)}
            </div>
            {task.updatedAt && (
              <div className="meta-item">
                <strong>Last Updated:</strong> {formatDate(task.updatedAt)}
              </div>
            )}
          </div>
        </div>

        <div className="task-description">
          <h2>Description</h2>
          <div className="description-content">
            {task.description ? (
              <p>{task.description}</p>
            ) : (
              <p className="no-description">No description provided</p>
            )}
          </div>
        </div>

        <div className="task-actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={handleStatusToggle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {task.completed ? (
                  <path d="M9 11l3 3L22 4"></path>
                ) : (
                  <polyline points="20,6 9,17 4,12"></polyline>
                )}
              </svg>
              {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
            </button>
            <button className="action-btn" onClick={handleEdit}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Task
            </button>
            <button className="action-btn delete" onClick={handleDelete}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Task
            </button>
          </div>
        </div>
      </div>

      {showEditForm && (
        <TaskForm
          task={task}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default TaskDetail
