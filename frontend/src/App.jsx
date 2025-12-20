// import { useState } from 'react'
import NewNoteForm from "./pages/NewNoteForm";
import LoginPage from "./pages/LoginPage";
import NotesList from "./pages/NotesList";
import UserPage from "./pages/UserPage";

import Account from "./components/Account";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import LoginForm from "./components/LoginForm";

import { useDispatch, useSelector } from 'react-redux'
import { setUserAction } from './reducers/userReducer'
import noteService from './services/notes' 

import store from './store'
import { useEffect } from 'react'
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log("parsed user", user);
      // dispatch(setUserAction({ id: user.id, username: user.username }))
      dispatch(setUserAction(user))
      noteService.setToken(user.token)
    }
  }, [dispatch]);

  const padding = {
    padding: 5,
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          notes
        </Link>

        {currentUser && (
          <Link style={padding} to={`/users/${currentUser.id}`}>
            me
          </Link>
          )
        }

        <Link style={padding} to="/account">
          account
        </Link>

        {/* <Account /> */}

      </div>

      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/users/:id" element={<ProfilePage />} />
        <Route path="/account" element={<LoginPage />} />

        {/* <Route path='/login' element={<LoginForm />}/> */}
      </Routes>
    </Router>
  );
};

export default App;
