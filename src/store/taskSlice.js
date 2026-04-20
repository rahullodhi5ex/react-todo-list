import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import taskService from '../services/taskService'

// Async thunks for API calls
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await taskService.getAllTasks()
  return response.data
})

export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
  const response = await taskService.createTask(taskData)
  return response.data
})

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, taskData }) => {
  const response = await taskService.updateTask(id, taskData)
  return response.data
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await taskService.deleteTask(id)
  return id
})

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    filteredTasks: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchTerm: ''
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.filteredTasks = state.tasks.filter(task =>
        task.title.toLowerCase().includes(action.payload.toLowerCase()) ||
        task.description.toLowerCase().includes(action.payload.toLowerCase())
      )
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.tasks = action.payload
        state.filteredTasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload)
        state.filteredTasks = state.tasks.filter(task =>
          task.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(state.searchTerm.toLowerCase())
        )
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(task => 
          (task.id || task._id) === (updatedTask.id || updatedTask._id)
        )
        if (index !== -1) {
          state.tasks[index] = updatedTask
          state.filteredTasks = state.tasks.filter(task =>
            task.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(state.searchTerm.toLowerCase())
          )
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.tasks = state.tasks.filter(task => (task.id || task._id) !== deletedId)
        state.filteredTasks = state.filteredTasks.filter(task => (task.id || task._id) !== deletedId)
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message
      })
  }
})

export const { setSearchTerm, clearError } = taskSlice.actions
export default taskSlice.reducer