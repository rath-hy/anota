import { useState, useEffect } from 'react'
import noteService from '../../services/notes'
import UrlSearchBar from '../components/UrlSearchBar'

import NewNoteForm from './NewNoteForm'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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

      <NewNoteForm /> 


      <UrlSearchBar setNotes={setNotes}/>

      <h3>General Comments</h3>
      {notes.map(note =>
        <div key={note.id}>
          <div><Link to={`/users/${note.user.id}`}><em>{note.username}</em></Link> • {new Date(note.date).toDateString("en-US")}</div>
          <div>{note.content}</div>
        </div>
      )}
    
    </div>
  )
}

export default NotesList