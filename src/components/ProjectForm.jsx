import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createProject, updateProject, clearError } from '../store/projectSlice'

const ProjectForm = ({ project, onClose }) => {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.projects)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startdate: '',
    status: false
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    startdate: ''
  })

  useEffect(() => {
    if (project) {
      // Format the date for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        title: project.title || '',
        description: project.description || '',
        startdate: formatDate(project.startdate),
        status: project.status === true
      })
    }
    setFormErrors({ title: '', description: '', startdate: '' })
  }, [project])

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

    if (!formData.startdate) {
      errors.startdate = 'Start date is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    // Convert status field to boolean for checkbox
    const processedValue = type === 'checkbox' ? e.target.checked : value
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Clear error for this field when user starts typing
    if (name !== 'status') {
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

    if (project) {
      const projectId = project.id || project._id;
      // Send status field for update
      const updateData = {
        title: formData.title,
        description: formData.description,
        startdate: formData.startdate,
        status: formData.status
      };
      const result = await dispatch(updateProject({ id: projectId, projectData: updateData }))
      if (updateProject.fulfilled.match(result)) {
        onClose()
      } else if (updateProject.rejected.match(result)) {
        console.log('Update failed, keeping form open')
      }
    } else {
      const result = await dispatch(createProject(formData))
      if (createProject.fulfilled.match(result)) {
        onClose()
      }
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h3>{project ? 'Edit Project' : 'Create New Project'}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {error && (
        <div className="error">
          <div className="error-content">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title (3-100 characters)"
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
              placeholder="Enter project description (10-500 characters)"
              rows="4"
            />
            {formErrors.description && (
              <span className="error-message">{formErrors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="startdate">Start Date *</label>
            <input
              type="date"
              id="startdate"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
            />
            {formErrors.startdate && (
              <span className="error-message">{formErrors.startdate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={false}>Inactive</option>
              <option value={true}>Active</option>
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
              {status === 'loading' ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectForm
