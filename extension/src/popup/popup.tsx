import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import FeedNote from './components/FeedNote'
import './popup.css'

interface Note {
  id: number
  content: string
  url: string
  date: string
  private: boolean
  user?: {
    id: number
    username: string
    name: string
  }
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    fetchNotesForCurrentTab()
  }, [])

  const fetchNotesForCurrentTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (!tab.url) {
        setError("No URL found")
        setLoading(false)
        return
      }

      setCurrentUrl(tab.url) // Save the current URL

      chrome.runtime.sendMessage(
        {
          action: "fetchNotes",
          pageUrl: tab.url
        },
        (response) => {
          if (chrome.runtime.lastError) {
            setError(chrome.runtime.lastError.message)
            setLoading(false)
            return
          }
          
          if (response?.success) {
            setNotes(response.notes)
          } else {
            setError(response?.error || "Unknown error")
          }
          setLoading(false)
        }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setLoading(false)
    }
  }

  const handleDelete = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const handleCreateNote = () => {
    // Open the new note page in a new tab with the current URL as a query parameter
    chrome.tabs.create({ 
      url: `http://localhost:5173/new-note?url=${encodeURIComponent(currentUrl)}` 
    })
  }

  return (
    <div style={{ 
      padding: '16px', 
      width: '400px',
      minHeight: '500px',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '16px'
      }}>
        <img src="icon.png" style={{ width: '32px', height: '32px' }} />
        <h2 style={{ margin: 0, fontSize: '20px' }}>Anota Notes</h2>
      </div>
      
      {loading && <p>Loading notes...</p>}
      
      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px',
          color: '#c62828'
        }}>
          Error: {error}
        </div>
      )}
      
      {!loading && !error && notes.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '64px',
          padding: '24px'
        }}>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            marginBottom: '24px' 
          }}>
            No notes for this page yet
          </p>
          <button
            onClick={handleCreateNote}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1565c0'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2'
            }}
          >
            Create First Note
          </button>
        </div>
      )}
      
      {!loading && !error && notes.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#666',
              margin: 0
            }}>
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
            <button
              onClick={handleCreateNote}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              + New Note
            </button>
          </div>
          {notes.map((note) => (
            <FeedNote 
              key={note.id} 
              note={note} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)