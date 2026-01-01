import NewNoteForm from "./components/NewNoteForm"
import LoginPage from "./pages/LoginPage"
import LoginPageTwo from "./pages/LoginPageTwo"
import NotesList from "./pages/NotesList"
import MePage from "./pages/MePage"
import LoginForm from "./components/LoginForm"
import NotesByUrlPage from "./pages/NotesByUrl"
import { AppBar, Toolbar, IconButton, Box } from "@mui/material"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import AddIcon from "@mui/icons-material/Add"
import ProfileMenu from "./components/ProfileMenu"
import NewNotePage from "./pages/NewNotePage"
import HomeIcon from "@mui/icons-material/Home"
import { useDispatch, useSelector } from "react-redux"
import { setUserAction } from "./reducers/userReducer"
import noteService from "./services/notes"
import store from "./store"
import { useEffect } from "react"
import ProfilePage from "./pages/ProfilePage"
import YouTubeTest from "./components/YouTubeTest"
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from './theme'

import SignIn from "./sign-in/SignIn"

const App = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user)
  const themeMode = useSelector((state) => state.theme)
  const theme = themeMode === 'light' ? lightTheme : darkTheme

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log("parsed user", user)
      dispatch(setUserAction(user))
      noteService.setToken(user.token)
    }
  }, [dispatch])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar 
          position="sticky" 
          color="default" 
          elevation={2}
          sx={{ 
            backgroundColor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left side - Home icon */}
            <IconButton 
              component={Link} 
              to="/"
              sx={{ color: 'text.primary' }}
            >
              <HomeIcon sx={{ fontSize: 28 }} />
            </IconButton>

            {/* Right side - Add and Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                component={Link} 
                to="/new-note"
                sx={{ color: 'text.primary' }}
              >
                <AddIcon sx={{ fontSize: 28 }} />
              </IconButton>

              <ProfileMenu />
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/users/:id" element={<ProfilePage />} />
          <Route path="/account" element={<SignIn />} />
          <Route path="/notes" element={<NotesByUrlPage />} />
          <Route path="/login" element={<LoginPageTwo />} />
          <Route path="/new-note" element={<NewNotePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App