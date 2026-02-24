import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ProfileNote from '../components/ProfileNote'
import config from '../config'
import userService from '../services/users'
import { useSelector } from 'react-redux'

const baseUrl = `${config.API_URL}/api/users`
const serifFont = "'Cormorant Garamond', Georgia, 'Times New Roman', Times, serif"

const TheirPage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const currentUser = useSelector(state => state.user)

  const handleFollow = async () => {
    await userService.follow(id)
    const response = await axios.get(`${baseUrl}/${id}?public=true`)
    setUser(response.data)
  }

  const handleUnfollow = async () => {
    await userService.unfollow(id)
    const response = await axios.get(`${baseUrl}/${id}?public=true`)
    setUser(response.data)
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('loggedNoteappUser'))?.token
        const cfg = { headers: { Authorization: `Bearer ${token}` } }
        const response = await axios.get(`${baseUrl}/${id}?public=true`, cfg)
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [id])

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px', fontFamily: serifFont }}>
        Loading...
      </div>
    )
  }

  const isFollowing = user.Followers?.some(u => u.id === currentUser.id)

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
          <div style={{ fontFamily: serifFont, fontSize: '24px', fontWeight: 400 }}>{user.name}</div>
          <div style={{ fontFamily: serifFont, fontSize: '18px', color: '#666' }}>u/{user.username}</div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontFamily: serifFont, fontSize: '22px' }}>
              <strong>{user.notes.length}</strong> public notes
            </span>
          </div>
        </div>
      </div>

      {/* Follow button */}
      <button
        onClick={isFollowing ? handleUnfollow : handleFollow}
        style={{
          padding: '6px 16px',
          border: '1px solid #1a1a1a',
          backgroundColor: isFollowing ? '#fff' : '#1a1a1a',
          color: isFollowing ? '#1a1a1a' : '#fff',
          cursor: 'pointer',
          fontFamily: serifFont,
          fontSize: '16px',
          borderRadius: 0,
          marginBottom: '24px',
        }}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>

      <div style={{ borderTop: '1px solid #ccc', marginBottom: '24px' }} />

      {/* Notes */}
      {user.notes.length === 0 ? (
        <p style={{ fontFamily: serifFont, color: '#666', textAlign: 'center', marginTop: '32px' }}>
          No public notes
        </p>
      ) : (
        user.notes.map(note => (
          <ProfileNote key={note.id} note={note} user={user} />
        ))
      )}
    </div>
  )
}

export default TheirPage