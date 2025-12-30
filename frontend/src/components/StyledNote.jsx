// components/RedditStyleNote.jsx
import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Box, 
  IconButton,
  Collapse,
  Link as MuiLink
} from '@mui/material'
import { Delete as DeleteIcon, ExpandMore, ExpandLess } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import noteService from '../services/notes'

const RedditStyleNote = ({ note, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const [showFullContent, setShowFullContent] = useState(false)
  const currentUser = useSelector(state => state.user)
  
  const canDelete = currentUser && note.user.id === currentUser.id
  const isLongContent = note.content.length > 300
  const displayContent = (isLongContent && !showFullContent) 
    ? note.content.substring(0, 300) + '...' 
    : note.content

  const handleDelete = async () => {
    if (window.confirm(`Delete this comment?`)) {
      try {
        await noteService.deleteNote(note.id)
        onDelete && onDelete(note.id)
      } catch (error) {
        console.error('Error deleting note', error)
      }
    }
  }

  // Generate color from username for avatar
  const stringToColor = (string) => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = `hsl(${hash % 360}, 65%, 50%)`
    return color
  }

  return (
    <Card sx={{ mb: 1, boxShadow: 1 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ mr: 1, p: 0.5 }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              bgcolor: stringToColor(note.user.username),
              fontSize: '0.75rem',
              mr: 1
            }}
          >
            {note.user.username[0].toUpperCase()}
          </Avatar>
          
          <Link 
            to={`/users/${note.user.id}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {note.user.username}
            </Typography>
          </Link>
          
          <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
            •
          </Typography>
          
          <Typography variant="caption" color="text.secondary">
            {new Date(note.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Typography>

          {canDelete && onDelete && (
            <IconButton 
              size="small" 
              onClick={handleDelete}
              sx={{ ml: 'auto' }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Content */}
        <Collapse in={expanded}>
          <Box sx={{ pl: 4 }}>
            <Typography 
              variant="body2" 
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {displayContent}
            </Typography>
            
            {isLongContent && (
              <MuiLink
                component="button"
                variant="caption"
                onClick={() => setShowFullContent(!showFullContent)}
                sx={{ mt: 0.5, cursor: 'pointer' }}
              >
                {showFullContent ? 'Show less' : 'Read more'}
              </MuiLink>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default RedditStyleNote