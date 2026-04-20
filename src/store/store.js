import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './taskSlice'
import authReducer from './authSlice'
import projectReducer from './projectSlice'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
    projects : projectReducer
  },
})

export default store
