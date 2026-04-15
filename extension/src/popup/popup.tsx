import React, { useEffect, useState, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import FeedNote, { Note } from './components/FeedNote'
import './popup.css'
import config from '../config'
import {
  getAuth, saveActiveTab, getActiveTab, getSelectedTeamId, saveSelectedTeamId,
} from '../utils/storage'
import type { AuthData } from '../utils/storage'
import { normalizeUrl } from '../utils/urlNormalizer'

interface Team {
  id: number
  name: string
  code: string
}

type TabName = 'all' | 'following' | 'teams'

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthData | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState('')
  const [activeTab, setActiveTab] = useState<TabName>('all')
  const [rawNotes, setRawNotes] = useState<Note[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [followingIds, setFollowingIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeText, setComposeText] = useState('')
  const [posting, setPosting] = useState(false)

  // ── Init ──
  useEffect(() => {
    const init = async () => {
      const [authData, savedTab, savedTeamId, tabs] = await Promise.all([
        getAuth(),
        getActiveTab(),
        getSelectedTeamId(),
        chrome.tabs.query({ active: true, currentWindow: true }),
      ])
      setAuth(authData)
      setActiveTab(savedTab as TabName)
      if (savedTeamId) setSelectedTeamId(savedTeamId)
      setAuthLoading(false)
      const tab = tabs[0]
      if (tab?.url && !tab.url.startsWith('chrome://')) {
        setCurrentUrl(tab.url)
      }
    }
    init()
  }, [])

  // ── Fetch teams + following when auth is ready ──
  useEffect(() => {
    if (!auth) return
    fetchTeams()
    fetchFollowing()
  }, [auth?.token])

  // ── Fetch notes when URL, tab, or selected team changes ──
  useEffect(() => {
    if (!currentUrl || authLoading) return
    fetchNotes()
  }, [currentUrl, activeTab, selectedTeamId, authLoading])

  // ── API calls ──

  const authHeaders = (): HeadersInit =>
    auth ? { Authorization: `Bearer ${auth.token}` } : {}

  const fetchNotes = async () => {
    if (!currentUrl) return
    setLoading(true)
    setError(null)
    try {
      const normalized = normalizeUrl(currentUrl)
      if (activeTab === 'teams') {
        if (!selectedTeamId) { setRawNotes([]); setLoading(false); return }
        const res = await fetch(`${config.API_URL}/api/teams/${selectedTeamId}/notes`, {
          headers: authHeaders(),
        })
        if (!res.ok) throw new Error('Failed to load team notes')
        const all: Note[] = await res.json()
        setRawNotes(all.filter(n => normalizeUrl(n.url) === normalized))
      } else {
        const res = await fetch(
          `${config.API_URL}/api/notes?url=${encodeURIComponent(normalized)}`,
          { headers: authHeaders() }
        )
        if (!res.ok) throw new Error('Failed to load notes')
        setRawNotes(await res.json())
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    if (!auth) return
    try {
      const res = await fetch(`${config.API_URL}/api/teams/mine`, { headers: authHeaders() })
      if (!res.ok) return
      const data: Team[] = await res.json()
      setTeams(data)
      // Set default team if none persisted or persisted ID is gone
      if (data.length > 0) {
        const persisted = await getSelectedTeamId()
        if (persisted && data.some(t => t.id === persisted)) {
          setSelectedTeamId(persisted)
        } else {
          setSelectedTeamId(data[0].id)
          saveSelectedTeamId(data[0].id)
        }
      }
    } catch {}
  }

  const fetchFollowing = async () => {
    if (!auth) return
    try {
      const res = await fetch(`${config.API_URL}/api/users/${auth.user.id}`, {
        headers: authHeaders(),
      })
      if (!res.ok) return
      const userData = await res.json()
      setFollowingIds((userData.Following || []).map((u: any) => u.id as number))
    } catch {}
  }

  // ── Tab change ──
  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab)
    saveActiveTab(tab)
  }

  // ── Team selection ──
  const handleTeamChange = (teamId: number) => {
    setSelectedTeamId(teamId)
    saveSelectedTeamId(teamId)
  }

  // ── Compose + post ──
  const handlePost = async () => {
    if (!auth || !composeText.trim() || !currentUrl) return
    setPosting(true)
    try {
      const res = await fetch(`${config.API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          content: composeText.trim(),
          url: normalizeUrl(currentUrl),
          private: false,
          teamId: activeTab === 'teams' ? selectedTeamId : null,
        }),
      })
      if (!res.ok) throw new Error('Failed to post')
      const created: Note = await res.json()
      // Attach user info (backend POST doesn't include relation)
      setRawNotes(prev => [{ ...created, user: auth.user }, ...prev])
      setComposeText('')
      setComposeOpen(false)
    } catch {}
    finally {
      setPosting(false)
    }
  }

  // ── Computed notes (following filter applied here) ──
  const displayNotes = useMemo(() => {
    if (activeTab === 'following') {
      return rawNotes.filter(n => n.user && followingIds.includes(n.user.id))
    }
    return rawNotes
  }, [rawNotes, activeTab, followingIds])

  const normalizedUrl = currentUrl ? normalizeUrl(currentUrl) : ''
  const websiteUrl = normalizedUrl
    ? `${config.FRONTEND_URL}/notes?url=${encodeURIComponent(normalizedUrl)}`
    : config.FRONTEND_URL

  const openUrl = (url: string) => chrome.tabs.create({ url })

  // ── Render helpers ──

  const renderNotes = () => {
    if (loading) return <div className="state-text">Loading…</div>
    if (error) return <div className="state-text state-error">{error}</div>

    if (!auth && activeTab !== 'all') {
      return (
        <div className="notes-empty">
          <span>
            {activeTab === 'following'
              ? 'Log in to see notes from people you follow.'
              : 'Log in to see team notes.'}
          </span>
          <button className="btn" onClick={() => openUrl(`${config.FRONTEND_URL}/account`)}>
            Log in
          </button>
        </div>
      )
    }

    if (activeTab === 'teams' && auth && teams.length === 0) {
      return <div className="notes-empty"><span>You're not on any teams yet.</span></div>
    }

    if (displayNotes.length === 0) {
      const msg =
        activeTab === 'following' && auth && followingIds.length === 0
          ? "You're not following anyone yet."
          : activeTab === 'following' && auth
          ? 'No notes from people you follow on this page.'
          : 'No notes for this page yet.'
      return <div className="notes-empty"><span>{msg}</span></div>
    }

    return displayNotes.map(note => <FeedNote key={note.id} note={note} />)
  }

  if (authLoading) {
    return (
      <div className="popup-wrap">
        <div className="popup-header">
          <div className="popup-logo">
            <span className="popup-logo-text">Anota</span>
          </div>
        </div>
        <div className="state-text">Loading…</div>
      </div>
    )
  }

  return (
    <div className="popup-wrap">
      {/* Header */}
      <div className="popup-header">
        <div className="popup-logo">
          {/* <img src="anota.png" alt="" /> */}
          <span className="popup-logo-text">Anota</span>
        </div>
        {auth ? (
          <span className="popup-username">{auth.user.name || auth.user.username}</span>
        ) : (
          <button
            className="btn btn-outline"
            style={{ fontSize: '13px', padding: '3px 9px' }}
            onClick={() => openUrl(`${config.FRONTEND_URL}/account`)}
          >
            Log in
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="popup-tabs">
        {(['all', 'following', 'teams'] as TabName[]).map(tab => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Team selector */}
      {activeTab === 'teams' && auth && teams.length > 0 && (
        <div className="team-selector">
          <select
            className="team-select"
            value={selectedTeamId ?? ''}
            onChange={e => handleTeamChange(Number(e.target.value))}
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Compose bar / area */}
      {auth && !composeOpen && (
        <div className="compose-bar">
          <button className="btn btn-outline" onClick={() => setComposeOpen(true)}>
            + New Note
          </button>
        </div>
      )}
      {auth && composeOpen && (
        <div className="compose-area">
          <textarea
            value={composeText}
            onChange={e => setComposeText(e.target.value)}
            placeholder="Write a note about this page…"
            autoFocus
          />
          <div className="compose-actions">
            <button
              className="btn btn-outline"
              onClick={() => { setComposeOpen(false); setComposeText('') }}
              disabled={posting}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={handlePost}
              disabled={posting || !composeText.trim()}
            >
              {posting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="notes-container">
        {renderNotes()}
      </div>

      {/* Footer */}
      <div className="popup-footer">
        <a onClick={() => openUrl(websiteUrl)}>View all on Anota →</a>
      </div>
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
createRoot(container).render(<App />)
