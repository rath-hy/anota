import { useState, useEffect } from "react"
import noteService from "../services/notes"
import userService from '../services/users'
import UrlSearchBar from "../components/UrlSearchBar"
import FeedNote from "../components/FeedNote"
import { useSelector } from "react-redux"
import { Container, Box, Tabs, Tab, Typography } from "@mui/material"

const NotesList = () => {
  const [notes, setNotes] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const user = useSelector(state => state.user)
  const [following, setFollowing] = useState([])

  const fetchNotes = async () => {
    try {
      const response = await noteService.getAllPublic()
      setNotes(response)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const fetchFollowing = async () => {
    if (!user) return

    try {
      const followingData = await userService.getFollowing(user.id)
      console.log('followingData', followingData)
      setFollowing(followingData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    if (user) {
      fetchFollowing()
    }
  }, [user?.id])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const followingNotes = notes.filter(note => 
    following.some(u => u.id === note.user.id)
  )

  return (
    <Container maxWidth="md">
      <UrlSearchBar />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab label="Following" />
        </Tabs>
      </Box>

      {/* All Tab */}
      {activeTab === 0 && (
        <Box>
          {notes.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              No notes yet
            </Typography>
          ) : (
            notes.map((note) => (
              <FeedNote key={note.id} note={note} />
            ))
          )}
        </Box>
      )}

      {/* Following Tab */}
      {activeTab === 1 && (
        <Box>
          {!user ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Log in to see notes from people you follow
            </Typography>
          ) : followingNotes.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              No notes from people you follow yet
            </Typography>
          ) : (
            followingNotes.map((note) => (
              <FeedNote key={note.id} note={note} />
            ))
          )}
        </Box>
      )}
    </Container>
  )
}

export default NotesList