import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import { Provider as RollbarProvider } from '@rollbar/react'
import store from './store'
import i18n from './i18n'
import rollbar from './rollbar'
import App from './App'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

const appContent = (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-right" autoClose={5000} />
      </BrowserRouter>
    </I18nextProvider>
  </Provider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {rollbar
      ? (
          <RollbarProvider instance={rollbar}>
            {appContent}
          </RollbarProvider>
        )
        : (
          appContent
        )}
  </React.StrictMode>,
)
