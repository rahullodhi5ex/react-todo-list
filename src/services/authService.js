import axios from 'axios'

import API_CONFIG from '../config/api'

const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`

const authService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // No credentials for direct cross-origin
})

// Add request interceptor for error handling
authService.interceptors.request.use(
  (request) => {
    console.log('Auth Request', JSON.stringify(request, null, 2))
    return request
  },
  (error) => {
    console.log('Auth Request Error', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
authService.interceptors.response.use(
  (response) => {
    console.log('Auth Response', JSON.stringify(response.data, null, 2))
    return response
  },
  (error) => {
    console.log('Auth Response Error', error)
    const errorMessage = error.response?.data?.message || error.message || 'Authentication error'
    return Promise.reject(new Error(errorMessage))
  }
)

export default {
  login: (credentials) => authService.post('/login', credentials),
  logout: () => {
    // Make API call first (if backend requires it), then clear localStorage
    return authService.post('/logout').finally(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    })
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  testConnection: () => authService.get('/').catch(err => {
    console.log('Connection test failed:', err)
    return err
  })
}
