// import { useState } from 'react'
import AddNote from './pages/AddNote'
import LoginForm from './pages/LoginForm'
import NewNoteForm from './pages/NewNoteForm'

//testing ground
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/notes/')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])

  // const notes = await axios.get

  console.log(notes)

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
      <AddNote />
      {/* <NewNoteForm/> */}


    </>
  )
}

export default App
