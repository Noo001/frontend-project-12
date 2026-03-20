import { configureStore } from '@reduxjs/toolkit'
import channelsReducer from './slices/channelsSlice'
import messagesReducer from './slices/messagesSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    auth: authReducer,
  },
})

export default store
