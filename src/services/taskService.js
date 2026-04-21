import axios from 'axios'

import API_CONFIG from '../config/api'

const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TASKS}` // Using Vite proxy to avoid CORS issues

const taskService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // No credentials for direct cross-origin
})

// Add request interceptor for debugging and auth
taskService.interceptors.request.use(
  (request) => {
    // Add auth token if available
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
    
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling and debugging
taskService.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Task Service Error:', error)
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login (this will be handled by the app's auth state)
      window.location.href = '/login'
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(errorMessage))
  }
)

export default {
  getAllTasks: () => taskService.get('/'),
  getTaskById: (id) => taskService.get(`/${id}`),
  createTask: (taskData) => taskService.post('/', taskData),
  updateTask: (id, taskData) => taskService.patch(`/${id}`, taskData),
  deleteTask: (id) => taskService.delete(`/${id}`),
}
