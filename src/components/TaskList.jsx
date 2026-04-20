import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTasks, deleteTask, setSearchTerm } from '../store/taskSlice'
import TaskForm from './TaskForm'

const TaskList = () => {
  const dispatch = useDispatch()
  const { filteredTasks, status, error, searchTerm } = useSelector((state) => state.tasks)
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id))
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value))
    setCurrentPage(1) // Reset to first page on search
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Sort the tasks
  const sortedTasks = React.useMemo(() => {
    let sortableTasks = [...filteredTasks]
    if (sortConfig.key !== null) {
      sortableTasks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableTasks
  }, [filteredTasks, sortConfig])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedTasks.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (status === 'loading') {
    return <div className="loading">Loading tasks...</div>
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Task Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Task
        </button>
      </div>

      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="table-info">
          Showing {currentItems.length} of {sortedTasks.length} tasks
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <TaskForm
          task={editingTask}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        {currentItems.length === 0 ? (
          <div className="no-tasks">
            {searchTerm ? 'No tasks found matching your search.' : 'No tasks available. Create your first task!'}
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
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortConfig.key === 'completed' && (
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
                {currentItems.map((task) => {
                  const taskId = task.id || task._id;
                  return (
                  <tr key={taskId} className="table-row">
                    <td className="table-cell title-cell">
                      <div className="task-title">{task.title}</div>
                    </td>
                    <td className="table-cell description-cell">
                      <div className="task-description-truncated">
                        {task.description}
                      </div>
                    </td>
                    <td className="table-cell status-cell">
                      <span className={`status ${task.completed}`}>
                        {task.completed === true ? 'Done' : 'Not Done'}
                      </span>
                    </td>
                    <td className="table-cell actions-cell">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit btn-sm"
                          onClick={() => handleEdit(task)}
                          title="Edit task"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete btn-sm"
                          onClick={() => handleDelete(taskId)}
                          title="Delete task"
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

export default TaskList
