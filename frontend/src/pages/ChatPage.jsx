import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useRollbar } from '@rollbar/react'
import axios from 'axios'
import socket from '../socket'
import { setChannels, setCurrentChannelId } from '../store/slices/channelsSlice'
import { setMessages, addMessage } from '../store/slices/messagesSlice'
import { clearToken } from '../store/slices/authSlice'
import { cleanText } from '../utils/filter'
import ChannelMenuWithRollbar from '../components/ChannelMenuWithRollbar'
import AddChannelModal from '../components/AddChannelModal'

function ChatPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const token = useSelector((state) => state.auth.token)
  const channels = useSelector((state) => state.channels.items)
  const currentChannelId = useSelector((state) => state.channels.currentChannelId)
  const messages = useSelector((state) => state.messages.items)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/data', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { channels, messages, currentChannelId } = response.data
        dispatch(setChannels(channels))
        dispatch(setMessages(messages))
        dispatch(setCurrentChannelId(currentChannelId))
      } catch (err) {
        if (err.response?.status === 401) {
          dispatch(clearToken())
          navigate('/login')
        } else if (err.code === 'ERR_NETWORK') {
          toast.error(t('errors.network'))
          if (rollbar) rollbar.error('Network error loading data', err)
        } else {
          toast.error(t('errors.loadData'))
          if (rollbar) rollbar.error('Failed to load data', err)
        }
      }
    }
    fetchData()
  }, [token, dispatch, navigate, t, rollbar])

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message))
    })

    return () => {
      socket.off('newMessage')
    }
  }, [dispatch])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const cleanMessage = cleanText(newMessage)
    setIsSending(true)
    try {
      await axios.post(
        '/api/v1/messages',
        {
          body: cleanMessage,
          channelId: currentChannelId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setNewMessage('')
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        toast.error(t('errors.network'))
        if (rollbar) rollbar.error('Network error sending message', err)
      } else {
        toast.error(t('errors.sendMessage'))
        if (rollbar) rollbar.error('Failed to send message', err)
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleChannelSwitch = (channelId) => {
    dispatch(setCurrentChannelId(channelId))
  }

  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId)
  const currentChannel = channels.find(ch => ch.id === currentChannelId)

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>{t('channels.channels')}</h2>
          <button onClick={() => setIsAddModalOpen(true)}>+</button>
        </div>
        <ul className="channels-list">
          {channels.map(channel => (
            <li key={channel.id} className={channel.id === currentChannelId ? 'active' : ''}>
              <button
                type="button"
                onClick={() => handleChannelSwitch(channel.id)}
                className="channel-button"
              >
                # {channel.name}
              </button>
              <ChannelMenuWithRollbar channel={channel} />
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <h2># {currentChannel?.name}</h2>
        </div>
        <div className="messages">
          {currentMessages.map(msg => (
            <div key={msg.id} className="message">
              <strong>{msg.username}</strong>: {msg.body}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('chat.messagePlaceholder')}
            disabled={isSending}
          />
          <button onClick={handleSendMessage} disabled={isSending}>
            {t('chat.send')}
          </button>
        </div>
      </div>

      <AddChannelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

export default ChatPage
