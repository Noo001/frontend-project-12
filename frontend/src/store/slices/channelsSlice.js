import { createSlice } from '@reduxjs/toolkit'

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
  },
  reducers: {
    setChannels: (state, action) => {
      state.items = action.payload
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
    addChannel: (state, action) => {
      state.items.push(action.payload)
    },
    removeChannel: (state, action) => {
      state.items = state.items.filter(channel => channel.id !== action.payload)
      if (state.currentChannelId === action.payload) {
        const defaultChannel = state.items.find(ch => ch.name === 'general')
        state.currentChannelId = defaultChannel?.id || state.items[0]?.id
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload
      const channel = state.items.find(ch => ch.id === id)
      if (channel) {
        channel.name = name
      }
    },
  },
})

export const { setChannels, setCurrentChannelId, addChannel, removeChannel, renameChannel } = channelsSlice.actions
export default channelsSlice.reducer
