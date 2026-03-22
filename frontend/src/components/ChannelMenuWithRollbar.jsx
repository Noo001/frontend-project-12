import { useRollbar } from '@rollbar/react'
import ChannelMenu from './ChannelMenu'

function ChannelMenuWithRollbar(props) {
  const rollbar = useRollbar()
  return <ChannelMenu {...props} rollbar={rollbar} />
}

export default ChannelMenuWithRollbar
