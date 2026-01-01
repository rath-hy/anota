// import { useState } from 'react'
import NewNoteForm from "./components/NewNoteForm";
import LoginPage from "./pages/LoginPage";
import LoginPageTwo from "./pages/LoginPageTwo";
import NotesList from "./pages/NotesList";
import MePage from "./pages/MePage";

import LoginForm from "./components/LoginForm";

import NotesByUrlPage from "./pages/NotesByUrl";
import { Avatar } from "@mui/material";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";

import ProfileMenu from "./components/ProfileMenu";

import NewNotePage from "./pages/NewNotePage";

// import LoginForm from "./components/LoginForm";

// import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";

import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "./reducers/userReducer";
import noteService from "./services/notes";

import store from "./store";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage";


import YouTubeTest from "./components/YouTubeTest";


import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { lightTheme, darkTheme } from './theme'


const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log("parsed user", user);
      // dispatch(setUserAction({ id: user.id, username: user.username }))
      dispatch(setUserAction(user));
      noteService.setToken(user.token);
    }
  }, [dispatch]);

  const padding = {
    padding: 5,
  };

  const themeMode = useSelector((state) => state.theme)  // Add this
  const theme = themeMode === 'light' ? lightTheme : darkTheme  // Add this

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <div>
          <Link style={padding} to="/">
            <HomeIcon />
          </Link>

          <ProfileMenu />

          <Link style={padding} to="/new-note">
            <AddIcon />
          </Link>

          <Link style={padding} to="/account">
            account
          </Link>

          {/* <Account /> */}
        </div>

        {/* <YouTubeTest /> */}

        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/users/:id" element={<ProfilePage />} />
          <Route path="/account" element={<LoginPage />} />
          <Route path="/notes" element={<NotesByUrlPage />} />

          <Route path="/login" element={<LoginPageTwo />} />

          <Route path="/new-note" element={<NewNotePage />} />
        </Routes>
      </Router>

    </ThemeProvider>
    
  );
};

export default App;
