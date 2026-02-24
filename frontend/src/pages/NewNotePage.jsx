import NewNoteForm from "../components/NewNoteForm"
import { useState, useEffect } from "react"
import noteService from "../services/notes"
import { useNavigate } from "react-router-dom"

const NewNotePage = () => {
  const [notes, setNotes] = useState([])
  const searchParams = new URLSearchParams(window.location.search)
  const prefilledUrl = searchParams.get('url')
  const navigate = useNavigate()

  const fetchNotes = async () => {
    try {
      const response = await noteService.getAllPublic()
      setNotes(response)
    } catch (error) {}
  }

  useEffect(() => { fetchNotes() }, [])

  const handleNoteCreated = (newNote) => {
    fetchNotes()
    navigate(`/notes?url=${encodeURIComponent(newNote.url)}`)
  }

  const uniqueUrls = [...new Set(notes.map(n => n === "" ? null : n.url))]

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <NewNoteForm onNoteCreated={handleNoteCreated} urlOptions={uniqueUrls} prefilledUrl={prefilledUrl} />
    </div>
  )
}

export default NewNotePage
