import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="not-found">
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.message')}</p>
      <Link to="/">{t('notFound.backToChat')}</Link>
    </div>
  )
}

export default NotFoundPage
