import { useState, useEffect } from 'react'
import noteService from '../../services/notes'
import UrlSearchBar from '../components/UrlSearchBar'

const NotesList = () => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response)
      })
  }, [])

  // console.log(notes)

  return (
    <div>
      <UrlSearchBar setNotes={setNotes}/>

      <h3>General Comments</h3>
      {notes.map(note =>
        <li key={note.id}>
          {note.content}
        </li>
      )}
    </div>
  )
}

export default NotesList