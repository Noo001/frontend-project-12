import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { clearToken } from '../store/slices/authSlice'

function Header() {
  const dispatch = useDispatch()
  const token = useSelector((state) => {
    return state.auth.token
  })
  const { t } = useTranslation()

  const handleLogout = () => {
    dispatch(clearToken())
  }

  return (
    <header className="header">
      <Link to="/" className="header-title">
        {t('app.title')}
      </Link>
      {token && (
        <button onClick={handleLogout} className="logout-btn">
          {t('auth.logout')}
        </button>
      )}
    </header>
  )
}

export default Header
