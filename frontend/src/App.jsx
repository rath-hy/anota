import NewNoteForm from "./components/NewNoteForm"
import LoginPage from "./pages/LoginPage"
import LoginPageTwo from "./pages/LoginPageTwo"
import NotesList from "./components/NotesList"
import MePage from "./pages/MePage"
import LoginForm from "./components/LoginForm"
import NotesByUrlPage from "./pages/NotesByUrl"
import { AppBar, Toolbar, Box } from "@mui/material"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import ProfileMenu from "./components/ProfileMenu"
import NewNotePage from "./pages/NewNotePage"
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
          elevation={0}
          sx={{ 
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', maxWidth: '800px', width: '100%', mx: 'auto', px: 2 }}>
            {/* Left side - Anota wordmark + Home */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  fontSize: '30px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 800,
                }}
              >
                Anota
              </Link>
              {/* <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  fontSize: '15px',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                Home
              </Link> */}
            </Box>

            {/* Right side - Annotate button + Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {currentUser && (
                <Link
                  to="/new-note"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid currentColor',
                    padding: '4px 12px',
                    fontSize: '18px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  ➕ Create
                </Link>
              )}
              <ProfileMenu />
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ pt: 3, pb: 6 }}>  
          <Routes>
            <Route path="/" element={<NotesList />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="/account" element={<SignIn />} />
            <Route path="/notes" element={<NotesByUrlPage />} />
            <Route path="/login" element={<LoginPageTwo />} />
            <Route path="/new-note" element={<NewNotePage />} />
          </Routes>
        </Box>
      </Router>

    </ThemeProvider>
  )
}

export default App