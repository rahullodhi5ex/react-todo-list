# CORS Setup for Node.js Server

## Add this to your main server file:

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Your existing routes
app.post('/users/login', (req, res) => {
  // Your login logic here
  try {
    const { email, password } = req.body
    // Your authentication logic
    res.json({ message: 'Login successful' })
  } catch (error) {
    res.status(400).json({ message: 'Login failed' })
  }
})

// Your other routes
app.get('/tasks', (req, res) => {
  // Your tasks logic here
})

app.post('/tasks', (req, res) => {
  // Your create task logic here
})

app.put('/tasks/:id', (req, res) => {
  // Your update task logic here
})

app.delete('/tasks/:id', (req, res) => {
  // Your delete task logic here
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

## If you don't have cors installed:

```bash
npm install cors
```

## Important:

1. Add the CORS middleware BEFORE your routes
2. Make sure your login endpoint is `/users/login`
3. Restart your Node.js server after adding CORS
