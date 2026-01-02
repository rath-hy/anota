import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Avatar, Typography, Divider } from '@mui/material'
import ProfileNote from '../components/ProfileNote'

const baseUrl = 'http://localhost:3001/api/users'

const TheirPage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('loggedNoteappUser'))?.token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(`${baseUrl}/${id}?public=true`, config)
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [id])

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar 
          src={user.photoURL}
          sx={{ width: 80, height: 80 }}
        >
          {user.username[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            u/{user.username}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Typography variant="body2">
              <strong>{user.notes.length}</strong> public notes
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Notes List */}
      {user.notes.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No public notes
        </Typography>
      ) : (
        user.notes.map(note => (
          <ProfileNote 
            key={note.id} 
            note={note} 
            user={user}
          />
        ))
      )}
    </Container>
  )
}

export default TheirPage