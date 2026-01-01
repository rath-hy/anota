import { useState, useEffect } from "react";
import noteService from "../services/notes";
import UrlSearchBar from "../components/UrlSearchBar";
import Note from "../components/Note";

import NewNoteForm from "../components/NewNoteForm";


import FeedNote from "../components/FeedNote";

const NotesList = () => {
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

  const handleNoteCreated = () => {
    fetchNotes();
  };

  return (
    <div>

      {/* <NewNoteForm onNoteCreated={handleNoteCreated} /> */}

      <UrlSearchBar setNotes={setNotes} />

      <h3>General Comments</h3>
      {notes.map((note) => (
        // <Note key={note.id} note={note} userId={note.user.id} />
        <FeedNote note={note} />
      ))}
    </div>
  );
};

export default NotesList;
