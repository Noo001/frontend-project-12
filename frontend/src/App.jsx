// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'
import Header from './components/Header'

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
