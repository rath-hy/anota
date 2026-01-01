import { useState } from 'react'
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Typography,
  Box,
  Button
} from '@mui/material'
import { 
  Person as PersonIcon, 
  DarkMode as DarkModeIcon, 
  Logout as LogoutIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { resetUserAction } from '../reducers/userReducer'
import { toggleTheme } from '../reducers/themeReducer'

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const currentUser = useSelector(state => state.user)
  const themeMode = useSelector(state => state.theme)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleViewProfile = () => {
    navigate(`/users/${currentUser.id}`)
    handleClose()
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    dispatch(resetUserAction())
    navigate('/')
    handleClose()
  }

  const handleLogin = () => {
    navigate('/account')
  }

  const handleToggleTheme = () => {
    dispatch(toggleTheme())
    handleClose()
  }

  // If not logged in, show login button
  if (!currentUser) {
    return (
      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{
          backgroundColor: themeMode === 'light' ? 'black' : 'white',
          color: themeMode === 'light' ? 'white' : 'black',
          '&:hover': {
            backgroundColor: themeMode === 'light' ? '#333' : '#e0e0e0',
          },
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Log In
      </Button>
    )
  }

  // If logged in, show avatar with menu
  return (
    <>
      <IconButton 
        onClick={handleClick}
        sx={{ p: 0 }}
      >
        <Avatar 
          src={currentUser?.photoURL}
          alt={currentUser?.username}
          sx={{ width: 32, height: 32 }}
        >
          {currentUser?.username?.[0]?.toUpperCase() || '?'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 250, mt: 1 }
        }}
      >
        {/* User info header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={currentUser.photoURL}
              sx={{ width: 40, height: 40 }}
            >
              {currentUser.username[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {currentUser.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                u/{currentUser.username}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider />

        <MenuItem onClick={handleViewProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleToggleTheme}>
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Log Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ProfileMenu