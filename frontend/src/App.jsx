// import { useState } from 'react'
import NewNoteForm from './pages/NewNoteForm'
import LoginForm from './pages/LoginForm'
import NotesList from './pages/NotesList'
import UserPage from './pages/UserPage'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

//testing ground

const App = () => {

  // return (
  //   <>
  //     <LoginForm />
  //     <NewNoteForm />
  //     <NotesList />
  //   </>
  // )

  const padding = {
    padding: 5
  }


  //the 'me' page should only show if i'm logged in
  return (
    <Router>
      <div>
        <Link style={padding} to='/'>notes</Link>
        <Link style={padding} to='/users/:id'>me</Link> 
        <Link style={padding} to='/login'>log in</Link>
      </div>

      <Routes>
        <Route path='/' element={<NotesList />}/>
        <Route path='/users/:id' element={<UserPage />}/>
        <Route path='/login' element={<LoginForm />} />
      </Routes>

    </Router>
  )
}

export default App
