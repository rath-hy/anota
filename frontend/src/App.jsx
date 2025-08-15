// import { useState } from 'react'
import NewNoteForm from './pages/NewNoteForm'
import LoginForm from './pages/LoginForm'
import NotesList from './pages/NotesList'

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
      
  
      <LoginForm />
      <NewNoteForm />
      <NotesList />

    </>
  )
}

export default App
