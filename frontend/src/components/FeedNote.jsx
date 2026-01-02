// components/FeedNote.jsx
import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Box, 
  IconButton,
  Collapse,
  Link as MuiLink,
  Chip
} from '@mui/material'
import { 
  Delete as DeleteIcon, 
  ExpandMore, 
  ExpandLess,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import noteService from '../services/notes'
import youtubeService from '../services/youtube'

const FeedNote = ({ note, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const [showFullContent, setShowFullContent] = useState(false)
  const [youTubeUrlInfo, setYouTubeUrlInfo] = useState(null)
  const currentUser = useSelector(state => state.user)
  const navigate = useNavigate()
  
  const canDelete = currentUser && note.user.id === currentUser.id
  const isLongContent = note.content.length > 300
  const displayContent = (isLongContent && !showFullContent) 
    ? note.content.substring(0, 300) + '...' 
    : note.content
  
  console.log('note seen by feednote', note.user)

  useEffect(() => {
    const fetchYouTubeInfo = async () => {
      const info = await youtubeService.getVideoInfo(note.url)
      if (info) {
        setYouTubeUrlInfo(info)
      }
    }

    fetchYouTubeInfo()
  }, [note.url])

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

  const stringToColor = (string) => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    return `hsl(${hash % 360}, 65%, 50%)`
  }

  const displayUrl = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const truncateTitle = (title, maxLength = 50) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  return (
    <Card sx={{ mb: 1, boxShadow: 1 }}>
      <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
        {/* Single line header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ p: 0.5 }}
          >
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
          
          <Avatar 
            sx={{ 
              width: 20, 
              height: 20, 
              bgcolor: stringToColor(note.user.username),
              fontSize: '0.65rem'
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
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {note.user.name}
            </Typography>
          </Link>
          
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {new Date(note.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            })}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            •
          </Typography>

          <Chip 
            label={displayUrl(note.url)}
            size="small"
            onClick={() => navigate(`/notes?url=${encodeURIComponent(note.url)}`)}
            sx={{ 
              fontSize: '0.7rem',
              height: '20px',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'primary.light' }
            }}
          />

          <IconButton
            size="small"
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            component="a"
            sx={{ p: 0.5 }}
          >
            <OpenInNewIcon fontSize="small" sx={{ fontSize: 16 }} />
          </IconButton>

          {youTubeUrlInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.75rem',
                  fontStyle: 'italic'
                }}
              >
                "{truncateTitle(youTubeUrlInfo.snippet.title)}"
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.7rem' }}
              >
                by {youTubeUrlInfo.snippet.channelTitle}
              </Typography>
            </Box>
          )}

          {onDelete && canDelete && (
            <IconButton 
              size="small" 
              onClick={handleDelete}
              sx={{ ml: 'auto', p: 0.5 }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Content */}
        <Collapse in={expanded}>
          <Box sx={{ pl: 4, mt: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                fontSize: '0.875rem'
              }}
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

export default FeedNote