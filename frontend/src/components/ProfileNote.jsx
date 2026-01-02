// components/ProfileNote.jsx
import FeedNote from './FeedNote'
import { useSelector } from 'react-redux'

const ProfileNote = ({ note, user, onDelete }) => {
  const currentUser = useSelector(state => state.user)
  
  // Check if it's the current user's note
  const isOwnNote = currentUser && currentUser.id === user.id

  // Attach the full user object to the note
  const noteWithUser = {
    ...note,
    user: user
  }

  return (
    <FeedNote 
      note={noteWithUser} 
      onDelete={isOwnNote ? onDelete : undefined}
    />
  )
}

export default ProfileNote