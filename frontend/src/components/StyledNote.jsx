// components/StyledNote.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import noteService from '../services/notes'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const serifFont = "'Cormorant Garamond', Georgia, 'Times New Roman', Times, serif"

const StyledNote = ({ note, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const currentUser = useSelector(state => state.user)
  const theme = useTheme()

  const mutedColor = theme.palette.text.secondary
  const textColor = theme.palette.text.primary
  const borderColor = theme.palette.divider

  const canDelete = currentUser && note.user.id === currentUser.id

  const handleDelete = async () => {
    if (window.confirm('Delete this comment?')) {
      try {
        await noteService.deleteNote(note.id)
        onDelete && onDelete(note.id)
      } catch (error) {
        console.error('Error deleting note', error)
      }
    }
  }

  const stringToColor = (string) => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    return `hsl(${hash % 360}, 65%, 50%)`
  }

  return (
    <div>
      <div style={{ paddingTop: '16px', paddingBottom: expanded ? '16px' : '8px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Avatar / collapse toggle */}
          <div style={{ width: '48px', flexShrink: 0 }}>
            {expanded ? (
              <button
                onClick={() => setExpanded(false)}
                style={{
                  width: '48px',
                  height: '48px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '50%',
                  padding: 0,
                  cursor: 'pointer',
                  background: stringToColor(note.user.username),
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: serifFont,
                  fontSize: '18px',
                }}
                title="Collapse"
              >
                {note.user.username[0].toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: mutedColor,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '20px',
                  fontFamily: serifFont,
                }}
                title="Expand"
              >
                <ExpandMoreIcon />
              </button>
            )}
          </div>

          {/* Content area */}
          <div style={{ flex: 1 }}>
            {/* Meta line */}
            <div style={{
              marginBottom: expanded ? '8px' : '0',
              fontSize: '16px',
              color: mutedColor,
              fontFamily: serifFont,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
            }}>
              <Link to={`/users/${note.user.id}`} style={{ color: textColor, textDecoration: 'none' }}>
                <span>{note.user.name}</span>
              </Link>
              <span>·</span>
              <span style={{ color: mutedColor }}>
                {new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {canDelete && onDelete && (
                <button
                  onClick={handleDelete}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#cc0000',
                    padding: 0,
                    marginLeft: 'auto',
                    fontSize: '16px',
                    fontFamily: serifFont,
                  }}
                >
                  <DeleteIcon />
                </button>
              )}
            </div>

            {/* Note body */}
            {expanded && (
              <div style={{
                lineHeight: '1.6',
                color: textColor,
                fontFamily: serifFont,
                fontSize: '18px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {note.content}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${borderColor}` }} />
    </div>
  )
}

export default StyledNote