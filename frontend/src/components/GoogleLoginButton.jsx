import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserAction } from '../reducers/userReducer'
import { setTokenAction } from "../reducers/tokenReducer";
import noteService from '../services/notes'

import { Button } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'

const GoogleLoginButton = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('logged in user', result.user)

      const idToken = await result.user.getIdToken()
      console.log('logged in user id', idToken)

      const GOOGLE_LOGIN_URL = 'http://localhost:3001/api/login/google'

      const response = await axios.post(GOOGLE_LOGIN_URL, {
        idToken
      })

      //BUG: this is { token: blablabla } instead of { username: ? id: ?}
      const user = response.data

      console.log('user', user)
      
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      dispatch(setUserAction({id: user.id, name: user.name, username: user.username}))

      dispatch(setUserAction(user))
      noteService.setToken(user.token)

      navigate('/')

    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <Button
      variant="contained" 
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
    >
      sign in
    </Button>
  )
}

export default GoogleLoginButton