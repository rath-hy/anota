import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from '../../services/notes'

const NotesList = () => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response)
      })
  }, [])

  console.log(notes)

  return (
    <div>
      {notes.map(note =>
        <li key={note.id}>
          {note.content}
        </li>
      )}
    </div>
  )
}

export default NotesList