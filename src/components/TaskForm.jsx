import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createTask, updateTask, clearError } from '../store/taskSlice'
import { fetchProjects } from '../store/projectSlice'

const TaskForm = ({ task, onClose }) => {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.tasks)
  const { projects } = useSelector((state) => state.projects)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
    project: ''
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    // Fetch projects when component mounts
    dispatch(fetchProjects())
  }, [dispatch])

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        completed: task.completed === true,
        project: task.project?._id || task.project || ''
      })
    }
    setFormErrors({ title: '', description: '' })
  }, [task])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long'
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title must be less than 100 characters'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long'
    } else if (formData.description.trim().length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Convert completed field to boolean
    const processedValue = name === 'completed' ? value === 'true' : value
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error for this field when user starts typing
    if (name !== 'completed') {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (task) {
      const taskId = task.id || task._id;
      // Send completed field for update
      const updateData = {
        title: formData.title,
        description: formData.description,
        completed: formData.completed,
        project: formData.project
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
              placeholder="Enter task title (3-100 characters)"
            />
            {formErrors.title && (
              <span className="error-message">{formErrors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description (10-500 characters)"
              rows="4"
            />
            {formErrors.description && (
              <span className="error-message">{formErrors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="project">Project</label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id || project.id} value={project._id || project.id}>
                  {project.title}
                </option>
              ))}
            </select>
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
