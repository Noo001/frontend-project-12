import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useRollbar } from '@rollbar/react'
import axios from 'axios'
import { addChannel, setCurrentChannelId } from '../store/slices/channelsSlice'
import { cleanText } from '../utils/filter'
import Modal from './Modal'

function AddChannelModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const token = useSelector((state) => state.auth.token)
  const channels = useSelector((state) => state.channels.items)

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .matches(/^[a-z0-9_-]+$/, t('validation.channelNamePattern'))
      .required(t('validation.required')),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>{t('channels.addChannel')}</h3>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        validate={(values) => {
          const exists = channels.some(ch => ch.name === values.name)
          if (exists) {
            return { name: t('validation.channelExists') }
          }
          return {}
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const cleanName = cleanText(values.name)
            const response = await axios.post(
              '/api/v1/channels',
              { name: cleanName },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            const newChannel = response.data
            dispatch(addChannel(newChannel))
            dispatch(setCurrentChannelId(newChannel.id))
            toast.success(t('channels.created', { name: cleanName }))
            resetForm()
            onClose()
          } catch (err) {
            if (err.code === 'ERR_NETWORK') {
              toast.error(t('errors.network'))
              rollbar.error('Network error creating channel', err)
            } else {
              toast.error(t('errors.createChannel'))
              rollbar.error('Failed to create channel', err)
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              type="text"
              name="name"
              placeholder={t('channels.channelName')}
              autoFocus
            />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
            <button type="submit" disabled={isSubmitting}>
              {t('channels.create')}
            </button>
            <button type="button" onClick={onClose}>
              {t('channels.cancel')}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
