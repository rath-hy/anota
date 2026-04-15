import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './options.css'
import { getAuth, clearAuth } from '../utils/storage'
import type { AuthData } from '../utils/storage'
import config from '../config'

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuth().then(data => {
      setAuth(data)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await clearAuth()
    setAuth(null)
  }

  return (
    <div>
      <div className="options-header">
        {/* <img src="anota.png" alt="Anota" className="options-logo-img" />  */}
        <span className="options-logo-text">Anota</span>
      </div>

      <p className="options-section-title">Account</p>

      {loading ? (
        <p className="options-muted">Loading…</p>
      ) : auth ? (
        <>
          <p className="options-name">{auth.user.name}</p>
          <p className="options-username">@{auth.user.username}</p>
          <button className="options-btn options-btn-danger" onClick={handleLogout}>
            Log out
          </button>
        </>
      ) : (
        <>
          <p className="options-muted">You're not logged in.</p>
          <a
            className="options-btn options-btn-outline"
            href={`${config.FRONTEND_URL}/account`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Log in on Anota
          </a>
        </>
      )}
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
createRoot(container).render(<App />)
