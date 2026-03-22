import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axios from 'axios'
import { removeChannel, renameChannel } from '../store/slices/channelsSlice'
import { clearMessagesByChannel } from '../store/slices/messagesSlice'
import { cleanText } from '../utils/filter'
import Modal from './Modal'

function ChannelMenu({ channel, rollbar }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const token = useSelector((state) => state.auth.token)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRename = async () => {
    if (!newName.trim() || newName === channel.name) return
    setIsLoading(true)
    try {
      const cleanName = cleanText(newName)
      await axios.patch(
        `/api/v1/channels/${channel.id}`,
        { name: cleanName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      dispatch(renameChannel({ id: channel.id, name: cleanName }))
      toast.success(t('channels.renamed', { name: cleanName }))
      setIsRenameOpen(false)
      setNewName('')
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        toast.error(t('errors.network'))
        if (rollbar) rollbar.error('Network error renaming channel', err)
      } else {
        toast.error(t('errors.renameChannel'))
        if (rollbar) rollbar.error('Failed to rename channel', err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await axios.delete(`/api/v1/channels/${channel.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      dispatch(removeChannel(channel.id))
      dispatch(clearMessagesByChannel(channel.id))
      toast.success(t('channels.deleted', { name: channel.name }))
      setIsDeleteOpen(false)
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        toast.error(t('errors.network'))
        if (rollbar) rollbar.error('Network error deleting channel', err)
      } else {
        toast.error(t('errors.deleteChannel'))
        if (rollbar) rollbar.error('Failed to delete channel', err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (channel.name === 'general') {
    return null
  }

  return (
    <>
      <div className="channel-menu">
        <button onClick={() => setIsRenameOpen(true)}>
          ✏️ {t('channels.manage')}
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          aria-label={t('channels.delete')}
        >
          🗑️
          <span className="visually-hidden">{t('channels.delete')}</span>
        </button>
      </div>

      <Modal isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)}>
        <h3>{t('channels.renameChannel')}</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={channel.name}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
        />
        <button onClick={handleRename} disabled={isLoading}>
          {t('channels.rename')}
        </button>
        <button onClick={() => setIsRenameOpen(false)}>
          {t('channels.cancel')}
        </button>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <h3>{t('channels.deleteChannel')}</h3>
        <p>{t('channels.deleteConfirmation', { name: channel.name })}</p>
        <button onClick={handleDelete} disabled={isLoading}>
          {t('channels.delete')}
        </button>
        <button onClick={() => setIsDeleteOpen(false)}>
          {t('channels.cancel')}
        </button>
      </Modal>
    </>
  )
}

export default ChannelMenu
