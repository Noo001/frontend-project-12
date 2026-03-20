import Rollbar from 'rollbar'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
  captureUncaught: true,
  captureUnhandledRejections: true,
}

const rollbar = new Rollbar(rollbarConfig)

export default rollbar
