import { io } from 'socket.io-client'

console.log('Socket connecting to:', window.location.origin)

const socket = io()

socket.on('connect', () => {
  console.log('Socket connected')
})

socket.on('connect_error', (err) => {
  console.log('Socket connect error:', err)
})

socket.on('disconnect', () => {
  console.log('Socket disconnected')
})

socket.onAny((event, ...args) => {
  console.log(`Socket event: ${event}`, args)
})

export default socket
