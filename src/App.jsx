import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { store } from './store/store'
import { initializeAuth } from './store/authSlice'
import Login from './components/Login'
import TaskManager from './components/TaskManager'
import ApiSetup from './components/ApiSetup'
import './App.css'

function AppContent() {
  const dispatch = useDispatch()
  const { isAuthenticated, status } = useSelector((state) => state.auth)
  const [showSetup, setShowSetup] = React.useState(false)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="App">
      {showSetup ? (
        <div>
          <ApiSetup />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowSetup(false)}
            >
              Back to Login
            </button>
          </div>
        </div>
      ) : isAuthenticated ? (
        <TaskManager />
      ) : (
        <div>
          <Login />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowSetup(true)}
            >
              API Setup & Testing
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
