import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTask, updateTask, clearError } from '../store/taskSlice'

const TaskForm = ({ task, onClose }) => {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.tasks)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        completed: task.completed === true
      })
    }
  }, [task])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    // Convert completed field to boolean
    const processedValue = name === 'completed' ? value === 'true' : value
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }

    if (task) {
      const taskId = task.id || task._id;
      // Send completed field for update
      const updateData = {
        title: formData.title,
        description: formData.description,
        completed: formData.completed
      };
      const result = await dispatch(updateTask({ id: taskId, taskData: updateData }))
      if (updateTask.fulfilled.match(result)) {
        onClose()
      } else if (updateTask.rejected.match(result)) {
        console.log('Update failed, keeping form open')
      }
    } else {
      const result = await dispatch(createTask(formData))
      if (createTask.fulfilled.match(result)) {
        onClose()
      }
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {error && (
        <div className="error">
          <div className="error-content">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="completed">Status</label>
            <select
              id="completed"
              name="completed"
              value={formData.completed}
              onChange={handleChange}
            >
              <option value={false}>Not Done</option>
              <option value={true}>Done</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
