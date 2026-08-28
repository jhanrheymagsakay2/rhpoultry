import { useEffect, useState } from 'react'

export default function PasswordPrompt({ isOpen, onClose, onSubmit }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPassword('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = onSubmit(password)
    if (!ok) setError('Incorrect password.')
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">🔒 Admin Password</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="off"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={`duplicate-warning ${error ? 'show' : ''}`}>{error}</div>
          </div>
          <div className="modal-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
