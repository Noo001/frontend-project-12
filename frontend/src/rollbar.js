import Rollbar from 'rollbar'

const token = import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN
let rollbar = null

if (token) {
  rollbar = new Rollbar({
    accessToken: token,
    environment: import.meta.env.MODE,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: true,
  })
}
else {
  console.warn('Rollbar token not found')
}

export default rollbar
