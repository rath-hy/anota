import NewNoteForm from "../components/NewNoteForm"

import { useState, useEffect } from "react";
import noteService from "../services/notes";

import { useNavigate } from "react-router-dom";


const NewNotePage = () => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await noteService.getAllPublic();
      setNotes(response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  console.log("fetched notes", notes);

  const navigate = useNavigate()

  const handleNoteCreated = (newNote) => {
    fetchNotes();
    navigate(`/notes?url=${encodeURIComponent(newNote.url)}`)
  };

  const uniqueUrls = [...new Set(notes.map(n => n == "" ? null : n.url))]

  console.log('unique urls', uniqueUrls)

  return (
    <div>
      <NewNoteForm onNoteCreated={handleNoteCreated} urlOptions={uniqueUrls}/>
    </div>
  )
}

export default NewNotePage