// Test file to verify API connection
import axios from 'axios'

const testAPI = async () => {
  try {
    console.log('Testing API connection...')
    const response = await axios.get('/tasks')
    console.log('API Test Success:', response.data)
    return response.data
  } catch (error) {
    console.error('API Test Failed:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Request setup error:', error.message)
    }
    throw error
  }
}

export default testAPI
