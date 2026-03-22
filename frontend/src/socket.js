import { io } from 'socket.io-client'

const socket = io()

socket.on('connect', () => {
  console.log('Socket connected')
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.onAny((event, ...args) => {
  console.log(`Socket event: ${event}`, args)
})

export default socket
