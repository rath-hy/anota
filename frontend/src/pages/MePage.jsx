import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { 
  Container, 
  Box, 
  Avatar, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  Divider 
} from '@mui/material'
import ProfileNote from "../components/ProfileNote"

const baseUrl = "http://localhost:3001/api/users"

const MePage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState("all")
  const [notes, setNotes] = useState([])

  const onDelete = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('loggedNoteappUser'))?.token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const response = await axios.get(`${baseUrl}/${id}`, config)
        setUser(response.data)
        setNotes(response.data?.notes || [])
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [id])

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter)
    }
  }

  const filteredNotes = notes.filter((note) => {
    switch (filter) {
      case "private":
        return note.private
      case "public":
        return !note.private
      case "all":
      default:
        return true
    }
  })

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
              <strong>{user.notes.length}</strong> notes
            </Typography>
            <Typography variant="body2">
              <strong>{user.notes.reduce((prev, curr) => prev + curr.likes, 0)}</strong> likes
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Filter Buttons */}
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          size="small"
        >
          <ToggleButton value="all">
            All ({notes.length})
          </ToggleButton>
          <ToggleButton value="public">
            Public ({notes.filter(n => !n.private).length})
          </ToggleButton>
          <ToggleButton value="private">
            Private ({notes.filter(n => n.private).length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No notes to display
        </Typography>
      ) : (
        filteredNotes.map((note) => (
          <ProfileNote
            key={note.id}
            note={note}
            user={user}
            onDelete={onDelete}
          />
        ))
      )}
    </Container>
  )
}

export default MePage