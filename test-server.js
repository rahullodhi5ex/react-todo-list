const express = require('express')
const cors = require('cors')

const app = express()

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware to parse JSON
app.use(express.json())

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' })
})

// Login endpoint
app.post('/users/login', (req, res) => {
  console.log('Login request received:', req.body)
  
  try {
    const { email, password } = req.body
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    // Check credentials (you can replace this with your actual authentication logic)
    if (email === 'johnlodhi@example.com' && password === 'secret123') {
      // Mock successful login response (replace with your actual token generation)
      const mockUser = {
        _id: '69c4d3a036268d3e44cc4f0f',
        name: 'John lodhi',
        email: 'johnlodhi@example.com',
        age: 25,
        createdAt: '2026-03-26T06:35:12.524Z',
        updatedAt: '2026-04-17T05:34:09.025Z',
        __v: 3
      }
      
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZDBhYzJmNmY3MTNkOTU2NjhmZGUiLCJpYXQiOjE3NzY0MDQ5OX0.8t6k7ShRESeicu47_nU-9e30sBEgIUvkK0ZOAbv50og'
      
      res.json({
        user: mockUser,
        token: mockToken,
        message: 'Login successful'
      })
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Tasks endpoints
app.get('/tasks', (req, res) => {
  res.json([
    {
      _id: '69e1d1b12f6f713d95669026',
      title: 'Sample Task',
      description: 'This is a sample task',
      status: 'notdone',
      completed: false,
      createdAt: '2026-03-26T06:35:12.524Z',
      updatedAt: '2026-04-17T05:34:09.025Z'
    }
  ])
})

app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body
  const newTask = {
    _id: Date.now().toString(),
    title,
    description,
    status: completed ? 'done' : 'notdone',
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  res.status(201).json(newTask)
})

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params
  const { title, description, completed } = req.body
  
  // Mock update logic (replace with your actual database logic)
  res.json({
    _id: id,
    title: title || 'Updated Task',
    description: description || 'Updated description',
    status: completed ? 'done' : 'notdone',
    completed,
    updatedAt: new Date().toISOString()
  })
})

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params
  res.json({ message: `Task ${id} deleted successfully` })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Test endpoint: http://localhost:3000/test')
  console.log('Login endpoint: http://localhost:3000/users/login')
})
