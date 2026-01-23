import React, { useState } from 'react'

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

interface FeedNoteProps {
  note: Note
  onDelete?: (id: number) => void
}

const FeedNote: React.FC<FeedNoteProps> = ({ note }) => {
  const [expanded, setExpanded] = useState(true)
  const [showFullContent, setShowFullContent] = useState(false)
  
  const isLongContent = note.content.length > 200
  const displayContent = (isLongContent && !showFullContent) 
    ? note.content.substring(0, 200) + '...' 
    : note.content

  const stringToColor = (string: string) => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    return `hsl(${hash % 360}, 65%, 50%)`
  }

  const displayUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const openUrl = () => {
    chrome.tabs.create({ url: note.url })
  }

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: expanded ? '8px' : '0'
      }}>
        <button 
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '16px'
          }}
        >
          {expanded ? '▼' : '▶'}
        </button>
        
        {note.user && (
          <>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: stringToColor(note.user.username),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {note.user.username[0].toUpperCase()}
            </div>
            
            <span style={{ 
              fontWeight: 600, 
              fontSize: '14px' 
            }}>
              {note.user.name}
            </span>
            
            <span style={{ color: '#666', fontSize: '12px' }}>•</span>
          </>
        )}
        
        <span style={{ color: '#666', fontSize: '12px' }}>
          {formatDate(note.date)}
        </span>

        <span style={{ color: '#666', fontSize: '12px' }}>•</span>

        <button
          onClick={openUrl}
          style={{
            background: '#e3f2fd',
            border: 'none',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '11px',
            cursor: 'pointer',
            color: '#1976d2'
          }}
          title={note.url}
        >
          {displayUrl(note.url)} ↗
        </button>
      </div>

      {/* Content */}
      {expanded && (
        <div style={{ paddingLeft: '32px' }}>
          <p style={{
            margin: '0',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {displayContent}
          </p>
          
          {isLongContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1976d2',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '4px 0',
                marginTop: '4px'
              }}
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedNote