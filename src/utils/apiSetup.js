// API Setup and Testing Utilities
import axios from 'axios'

// Test API endpoints
export const testAPIEndpoints = async () => {
  console.log('Testing API endpoints...')
  
  const endpoints = [
    { name: 'Users Login', url: '/users/login', method: 'POST' },
    { name: 'Tasks', url: '/tasks', method: 'GET' }
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}: ${endpoint.url}`)
      
      if (endpoint.method === 'POST' && endpoint.name === 'Users Login') {
        const testLogin = {
          email: 'johnlodhi@example.com',
          password: 'secret123'
        }
        const response = await axios.post(endpoint.url, testLogin)
        console.log(`${endpoint.name} SUCCESS:`, response.data)
      } else {
        const response = await axios.get(endpoint.url)
        console.log(`${endpoint.name} SUCCESS:`, response.data)
      }
    } catch (error) {
      console.error(`${endpoint.name} FAILED:`, error.response?.data || error.message)
    }
  }
}

// Create test user if needed
export const createTestUser = async () => {
  try {
    // First try to login with existing user
    const loginResponse = await axios.post('/users/login', {
      email: 'johnlodhi@example.com',
      password: 'secret123'
    })
    
    return loginResponse.data
  } catch (error) {
    console.log('Test user does not exist, creating...')
    
    // If login fails, try to create user (if your API has signup endpoint)
    try {
      const newUser = {
        name: 'John lodhi',
        email: 'johnlodhi@example.com',
        password: 'secret123',
        age: 25
      }
      
      // Try different signup endpoints
      const signupEndpoints = ['/users/register', '/users/signup', '/users']
      
      for (const endpoint of signupEndpoints) {
        try {
          const response = await axios.post(endpoint, newUser)
          console.log('User created successfully:', response.data)
          
          // Now try to login
          const loginResponse = await axios.post('/users/login', {
            email: newUser.email,
            password: newUser.password
          })
          
          console.log('Login successful after creation:', loginResponse.data)
          return loginResponse.data
        } catch (signupError) {
          console.log(`Failed to create user with ${endpoint}:`, signupError.response?.data || signupError.message)
          continue
        }
      }
      
      throw new Error('No signup endpoint found or user creation failed')
      
    } catch (createError) {
      console.error('Failed to create test user:', createError)
      throw createError
    }
  }
}

export default {
  testAPIEndpoints,
  createTestUser
}
