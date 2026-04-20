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
    console.log('Response:', JSON.stringify(response.data, null, 2))
    return response
  },
  (error) => {
    console.log('Response Error:', error)
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      console.log('Network Error Details:', {
        baseURL: API_BASE_URL,
        error: error.message,
        code: error.code,
        config: error.config
      })
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
