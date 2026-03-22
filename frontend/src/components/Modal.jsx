import { useEffect } from 'react'
import ReactDOM from 'react-dom'

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => {
        return e.stopPropagation()
      }}>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
