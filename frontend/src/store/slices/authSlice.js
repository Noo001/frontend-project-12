import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    username: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token
      state.username = action.payload.username
      localStorage.setItem('token', action.payload.token)
    },
    clearToken: (state) => {
      state.token = null
      state.username = null
      localStorage.removeItem('token')
    },
  },
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer
