import { useRollbar } from '@rollbar/react'
import ChannelMenu from './ChannelMenu'

function ChannelMenuWithRollbar(props) {
  let rollbar = null
  try {
    rollbar = useRollbar()
  } catch {
    // провайдер отсутствует
  }
  return <ChannelMenu {...props} rollbar={rollbar} />
}

export default ChannelMenuWithRollbar
