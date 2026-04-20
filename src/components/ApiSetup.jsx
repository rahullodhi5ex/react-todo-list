import React, { useState } from 'react'
import { testAPIEndpoints, createTestUser } from '../utils/apiSetup'

const ApiSetup = () => {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTestAPI = async () => {
    setLoading(true)
    setStatus('Testing API endpoints...')
    
    try {
      await testAPIEndpoints()
      setStatus('API testing complete! Check console for details.')
    } catch (error) {
      setStatus(`API testing failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    setLoading(true)
    setStatus('Creating test user...')
    
    try {
      const result = await createTestUser()
      setStatus(`Test user created successfully! User: ${result.user.name}`)
    } catch (error) {
      setStatus(`Failed to create test user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="api-setup">
      <div className="setup-card">
        <h2>API Setup & Testing</h2>
        <p>Use this tool to test your API endpoints and create test data.</p>
        
        <div className="setup-actions">
          <button 
            className="btn btn-primary"
            onClick={handleTestAPI}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test API Endpoints'}
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={handleCreateUser}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Test User'}
          </button>
        </div>
        
        {status && (
          <div className="status-message">
            <strong>Status:</strong> {status}
          </div>
        )}
        
        <div className="setup-info">
          <h3>Expected API Endpoints:</h3>
          <ul>
            <li><code>POST /users/login</code> - User authentication</li>
            <li><code>GET /tasks</code> - Get all tasks (requires auth)</li>
            <li><code>POST /tasks</code> - Create task (requires auth)</li>
            <li><code>PUT /tasks/:id</code> - Update task (requires auth)</li>
            <li><code>DELETE /tasks/:id</code> - Delete task (requires auth)</li>
          </ul>
          
          <h3>Test User Credentials:</h3>
          <ul>
            <li>Email: johnlodhi@example.com</li>
            <li>Password: secret123</li>
            <li>Name: John lodhi</li>
            <li>Age: 25</li>
          </ul>
          
          <h3>If Database is Empty:</h3>
          <p>1. Click "Create Test User" to recreate the user</p>
          <p>2. Check your Node.js server logs for any errors</p>
          <p>3. Make sure MongoDB is running and connected</p>
        </div>
      </div>
    </div>
  )
}

export default ApiSetup
