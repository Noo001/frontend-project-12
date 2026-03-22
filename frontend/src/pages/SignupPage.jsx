import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { setToken } from '../store/slices/authSlice'

function SignupPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [error, setError] = useState('')

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t('validation.usernameLength'))
      .max(20, t('validation.usernameLength'))
      .matches(/^[a-z0-9_-]+$/, t('validation.usernamePattern'))
      .required(t('validation.required')),
    password: Yup.string()
      .min(6, t('validation.passwordMin'))
      .required(t('validation.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.passwordsMatch'))
      .required(t('validation.required')),
  })

  return (
    <div className="signup-container">
      <h1>{t('auth.signupHeader')}</h1>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError('')
          try {
            const response = await axios.post('/api/v1/signup', values)
            const { token, username } = response.data
            console.error('Registration token:', token)
            console.error('Registration username:', username)
            dispatch(setToken({ token, username }))
            navigate('/')
          } catch (err) {
            console.error('Registration error:', err)
            if (err.response?.status === 409) {
              setError(t('auth.userExists'))
            } else {
              setError(t('auth.registrationError'))
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">{t('auth.usernameSignup')}</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder={t('auth.usernameSignup')}
              />
              {errors.username && touched.username && (
                <div className="error">{errors.username}</div>
              )}
            </div>
            <div>
              <label htmlFor="password">{t('auth.password')}</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder={t('auth.passwordPlaceholder')}
              />
              {errors.password && touched.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={t('auth.confirmPasswordPlaceholder')}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="error">{errors.confirmPassword}</div>
              )}
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={isSubmitting}>
              {t('auth.signup')}
            </button>
            <Link to="/login">{t('auth.haveAccount')}</Link>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignupPage
