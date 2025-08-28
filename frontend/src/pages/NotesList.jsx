import { useState, useEffect } from "react";
import noteService from "../services/notes";
import UrlSearchBar from "../components/UrlSearchBar";
import Note from "../components/Note";

import NewNoteForm from "./NewNoteForm";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    noteService.getAll().then((response) => {
      setNotes(response);
    });
  }, []);

  console.log(notes);

  return (
    <div>
      <NewNoteForm />

      <UrlSearchBar setNotes={setNotes} />

      <h3>General Comments</h3>
      {notes.map((note) => (
        <Note key={note.id} note={note} userId={note.user.id} />
      ))}
    </div>
  );
};

export default NotesList;
