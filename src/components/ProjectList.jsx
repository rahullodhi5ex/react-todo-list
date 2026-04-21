import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjects, deleteProject, setSearchTerm } from '../store/projectSlice'
import ProjectForm from './ProjectForm'

const ProjectList = () => {
  const dispatch = useDispatch()
  const { filteredProjects, status, error, searchTerm } = useSelector((state) => state.projects)
  const [editingProject, setEditingProject] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id))
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value))
    setCurrentPage(1) // Reset to first page on search
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProject(null)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Sort the projects
  const sortedProjects = React.useMemo(() => {
    let sortableProjects = [...filteredProjects]
    if (sortConfig.key !== null) {
      sortableProjects.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableProjects
  }, [filteredProjects, sortConfig])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedProjects.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (status === 'loading') {
    return <div className="loading">Loading projects...</div>
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Project Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Project
        </button>
      </div>

      <div className="table-controls">
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <div className="table-info">
          Showing {currentItems.length} of {sortedProjects.length} projects
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        {currentItems.length === 0 ? (
          <div className="no-tasks">
            {searchTerm ? 'No projects found matching your search.' : 'No projects available. Create your first project!'}
          </div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('title')}
                    >
                      Title
                      {sortConfig.key === 'title' && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'ascending' ? ' ^' : ' v'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th>Description</th>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('startdate')}
                    >
                      Start Date
                      {sortConfig.key === 'startdate' && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'ascending' ? ' ^' : ' v'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortConfig.key === 'status' && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'ascending' ? ' ^' : ' v'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((project) => {
                  const projectId = project.id || project._id;
                  return (
                  <tr key={projectId} className="table-row">
                    <td className="table-cell title-cell">
                      <div className="task-title">{project.title}</div>
                    </td>
                    <td className="table-cell description-cell">
                      <div className="task-description-truncated">
                        {project.description}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="task-description-truncated">
                        {formatDate(project.startdate)}
                      </div>
                    </td>
                    <td className="table-cell status-cell">
                      <span className={`status ${project.status ? 'done' : 'notdone'}`}>
                        {project.status === true ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell actions-cell">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit btn-sm"
                          onClick={() => handleEdit(project)}
                          title="Edit project"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete btn-sm"
                          onClick={() => handleDelete(projectId)}
                          title="Delete project"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectList
