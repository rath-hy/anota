// import { useState } from 'react'
import NewNoteForm from './pages/NewNoteForm'
import LoginForm from './pages/LoginForm'
import NotesList from './pages/Notes'

//testing ground

const App = () => {

  return (
    <>
      {/* <AddNote /> */}
      {/* {notes.map(note => (
        <div key={note.id}>
          {note.content}
        </div>
      ))
      } */}
      
      <NotesList />
      <LoginForm />
      <NewNoteForm />

    </>
  )
}

export default App
