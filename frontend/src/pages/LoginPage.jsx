import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { setToken } from '../store/slices/authSlice'
import i18n from "i18next";

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [error, setError] = useState('')

  return (
    <div className="login-container">
      <h1>{t('auth.loginHeader')}</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          setError('')
          try {
            const response = await axios.post('/api/v1/login', values)
            const { token } = response.data
            dispatch(setToken(token))
            navigate('/')
          } catch (err) {
            setError(t('auth.invalidCredentials'))
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">{t('auth.username')}</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder={t('auth.usernamePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="password">{t('auth.password')}</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={isSubmitting}>
              {t('auth.login')}
            </button>
            <Link to="/signup">{t('auth.noAccount')}</Link>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage
