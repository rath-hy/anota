import { useState, useEffect } from "react"
import noteService from '../services/notes'
import { useSearchParams } from "react-router-dom";
import Note from "../components/Note";

const NotesByUrlPage = () => {
  const [searchParams] = useSearchParams()
  const url = searchParams.get('url')
  const [notes, setNotes] = useState([])

  const fetchNotes = async () => {
    try {
      const response = await noteService.getPublicByUrl(url)
      setNotes(response)
    } catch (error) {
      console.error('error fetching notes by url', error)
    }
  }

  useEffect(() => {
    if (url) {
      fetchNotes()
    }
  }, [url])

  return (
    <div>
      <a href={url}><h3>{url}</h3></a>
      

      {notes.map(note => 
        <Note key={note.id} note={note} userId={note.user.id} showUrl={false} showGo={false}/>
      )}
    </div>
  )

}

export default NotesByUrlPage
