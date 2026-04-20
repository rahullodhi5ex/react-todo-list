// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    USERS: '/users',
    TASKS: '/tasks',
    PROJECTS: '/projects',
    PRODUCTS:'/products'
  },
  TIMEOUT: 10000, // 10 seconds timeout
  HEADERS: {
    'Content-Type': 'application/json'
  }
}

export default API_CONFIG
