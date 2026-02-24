import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ProfileNote from "../components/ProfileNote"
import config from '../config'
import { useTheme } from '@mui/material/styles'

const baseUrl = `${config.API_URL}/api/users`
const serifFont = "'Cormorant Garamond', Georgia, 'Times New Roman', Times, serif"

const MePage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState("all")
  const [notes, setNotes] = useState([])
  const theme = useTheme()

  const textColor = theme.palette.text.primary
  const mutedColor = theme.palette.text.secondary
  const borderColor = theme.palette.divider
  const activeBg = textColor
  const activeText = theme.palette.background.default
  const inactiveBg = theme.palette.background.default
  const inactiveText = textColor

  const onDelete = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('loggedNoteappUser'))?.token
        const cfg = { headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get(`${baseUrl}/${id}`, cfg)
        setUser(response.data)
        setNotes(response.data?.notes || [])
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [id])

  const filteredNotes = notes.filter((note) => {
    switch (filter) {
      case "private": return note.private
      case "public": return !note.private
      default: return true
    }
  })

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px', fontFamily: serifFont, color: textColor }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          backgroundColor: '#ccc',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: serifFont, fontSize: '32px', color: '#fff',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {user.photoURL
            ? <img src={user.photoURL} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : user.username[0].toUpperCase()
          }
        </div>
        <div>
          <div style={{ fontFamily: serifFont, fontSize: '24px', fontWeight: 400, color: textColor }}>{user.name}</div>
          <div style={{ fontFamily: serifFont, fontSize: '18px', color: mutedColor }}>u/{user.username}</div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <span style={{ fontFamily: serifFont, fontSize: '22px', color: textColor }}>
              <strong>{user.notes.length}</strong> notes
            </span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${borderColor}`, marginBottom: '24px' }} />

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'public', 'private'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '4px 12px',
              border: `1px solid ${borderColor}`,
              backgroundColor: filter === f ? activeBg : inactiveBg,
              color: filter === f ? activeText : inactiveText,
              cursor: 'pointer',
              fontFamily: serifFont,
              fontSize: '16px',
              borderRadius: 0,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({
              f === 'all' ? notes.length :
              f === 'public' ? notes.filter(n => !n.private).length :
              notes.filter(n => n.private).length
            })
          </button>
        ))}
      </div>

      {/* Notes */}
      {filteredNotes.length === 0 ? (
        <p style={{ fontFamily: serifFont, color: mutedColor, textAlign: 'center', marginTop: '32px' }}>
          No notes to display
        </p>
      ) : (
        filteredNotes.map((note) => (
          <ProfileNote key={note.id} note={note} user={user} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}

export default MePage