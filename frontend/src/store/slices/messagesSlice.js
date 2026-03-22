import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.items = action.payload
    },
    addMessage: (state, action) => {
      state.items = [...state.items, action.payload]
    },
    clearMessagesByChannel: (state, action) => {
      state.items = state.items.filter(msg => msg.channelId !== action.payload)
    },
  },
})

export const { setMessages, addMessage, clearMessagesByChannel } = messagesSlice.actions
export default messagesSlice.reducer