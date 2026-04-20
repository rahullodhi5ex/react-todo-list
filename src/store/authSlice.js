import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../services/authService'

// =======================
// ASYNC THUNKS
// =======================

// createAsyncThunk is used to handle async operations like API calls
// It automatically creates pending, fulfilled, and rejected actions

// LOGIN USER
export const loginUser = createAsyncThunk(
  'auth/loginUser', // action type
  async (credentials, { rejectWithValue }) => {
    try {
      // Call API from service
      const response = await authService.login(credentials)

      // Store token in localStorage (so user stays logged in after refresh)
      localStorage.setItem('token', response.data.token)

      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Return data to reducer (goes to fulfilled case)
      return response.data
    } catch (error) {
      // Handle error and send custom message to reducer
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

// LOGOUT USER
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Call logout API (optional depending on backend)
    await authService.logout()

    // Return null (we clear state in reducer)
    return null
  }
)

// =======================
// SLICE
// =======================

const authSlice = createSlice({
  name: 'auth',

  // Initial state of authentication
  initialState: {
    user: null,

    // Get token from localStorage (persist login)
    token: localStorage.getItem('token'),

    // Check if user is authenticated
    isAuthenticated: !!localStorage.getItem('token'),

    // Status for API calls
    status: 'idle', // idle | loading | succeeded | failed

    // Error message
    error: null
  },

  // =======================
  // NORMAL REDUCERS
  // =======================
  reducers: {

    // Clear error manually (useful in UI)
    clearError: (state) => {
      state.error = null
    },

    // Initialize auth when app loads (e.g., refresh)
    initializeAuth: (state) => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      // If token & user exist → restore session
      if (token && user) {
        state.token = token
        state.user = JSON.parse(user)
        state.isAuthenticated = true
      }
    }
  },

  // =======================
  // EXTRA REDUCERS (ASYNC)
  // =======================
  extraReducers: (builder) => {
    builder

      // ===== LOGIN =====

      // When API call starts
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })

      // When API call succeeds
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'

        // Save user and token in Redux state
        state.user = action.payload.user
        state.token = action.payload.token

        // Mark user as logged in
        state.isAuthenticated = true
        state.error = null
      })

      // When API call fails
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'

        // Save error message
        state.error = action.payload

        // Reset auth data
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })

      // ===== LOGOUT =====

      .addCase(logoutUser.fulfilled, (state) => {
        // Clear all auth data
        state.user = null
        state.token = null
        state.isAuthenticated = false

        // Reset status and error
        state.status = 'idle'
        state.error = null
      })
  }
})

// Export actions
export const { clearError, initializeAuth } = authSlice.actions

// Export reducer
export default authSlice.reducer