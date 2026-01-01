import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import { setUserAction } from '../reducers/userReducer'
import noteService from '../services/notes'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// import Checkbox from '@mui/material/Checkbox'
import CssBaseline from '@mui/material/CssBaseline'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import Divider from '@mui/material/Divider'
// import FormLabel from '@mui/material/FormLabel'
// import FormControl from '@mui/material/FormControl'
// import Link from '@mui/material/Link'
// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
// import ForgotPassword from './components/ForgotPassword'
import AppTheme from '../shared-theme/AppTheme'
import ColorModeSelect from '../shared-theme/ColorModeSelect'
import { GoogleIcon } from './components/CustomIcons'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundRepeat: 'no-repeat',
  },
}))

export default function SignIn(props) {
  // Username/password login state - not needed for Google-only
  // const [emailError, setEmailError] = React.useState(false)
  // const [emailErrorMessage, setEmailErrorMessage] = React.useState('')
  // const [passwordError, setPasswordError] = React.useState(false)
  // const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
  // const [open, setOpen] = React.useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Forgot password handlers - not needed for Google-only
  // const handleClickOpen = () => {
  //   setOpen(true)
  // }

  // const handleClose = () => {
  //   setOpen(false)
  // }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const idToken = await result.user.getIdToken()
      const response = await axios.post('http://localhost:3001/api/login/google', { idToken })
      
      const user = response.data
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user))
      dispatch(setUserAction(user))
      noteService.setToken(user.token)

      navigate('/')
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  // Username/password login handler - not needed for Google-only
  // const handleSubmit = async (event) => {
  //   event.preventDefault()
  //   
  //   if (!validateInputs()) {
  //     return
  //   }

  //   const data = new FormData(event.currentTarget)
  //   const username = data.get('email')
  //   const password = data.get('password')

  //   try {
  //     const response = await axios.post('http://localhost:3001/api/login', {
  //       username,
  //       password
  //     })

  //     const user = response.data
  //     window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user))
  //     dispatch(setUserAction(user))
  //     noteService.setToken(user.token)

  //     navigate('/')
  //   } catch (error) {
  //     console.error('Login failed:', error)
  //     setPasswordError(true)
  //     setPasswordErrorMessage('Invalid username or password')
  //   }
  // }

  // Validation - not needed for Google-only
  // const validateInputs = () => {
  //   const email = document.getElementById('email')
  //   const password = document.getElementById('password')

  //   let isValid = true

  //   if (!email.value) {
  //     setEmailError(true)
  //     setEmailErrorMessage('Please enter your username.')
  //     isValid = false
  //   } else {
  //     setEmailError(false)
  //     setEmailErrorMessage('')
  //   }

  //   if (!password.value || password.value.length < 6) {
  //     setPasswordError(true)
  //     setPasswordErrorMessage('Password must be at least 6 characters long.')
  //     isValid = false
  //   } else {
  //     setPasswordError(false)
  //     setPasswordErrorMessage('')
  //   }

  //   return isValid
  // }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Welcome to Anota
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            See what your friends are reading across the web
          </Typography>

          {/* Username/password form - not needed for Google-only */}
          {/* <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Username</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="text"
                name="email"
                placeholder="email"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider> */}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
              size="large"
            >
              Continue with Google
            </Button>
            
            {/* Sign up link - not needed since Google handles it */}
            {/* <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography> */}
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}