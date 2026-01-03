import { useState, useEffect } from "react";
import noteService from "../services/notes";
import userService from '../services/users'
import UrlSearchBar from "../components/UrlSearchBar";
import Note from "../components/Note";

import NewNoteForm from "../components/NewNoteForm";


import FeedNote from "../components/FeedNote";
import { useSelector } from "react-redux";

import { Typography } from "@mui/material";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const user = useSelector(state => state.user)
  const [following, setFollowing] = useState([])

  const fetchNotes = async () => {
    try {
      const response = await noteService.getAllPublic();
      setNotes(response);
    } catch (error) {}
  };

  const fetchFollowing = async () => {
    if (!user) {
      return null
    }

    try {
       const followingData = await userService.getFollowing(user.id)
       setFollowing(followingData)
       console.log('following', followingData)
    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchFollowing()
  }, [user]);

  console.log("fetched notes", notes);

  const handleNoteCreated = () => {
    fetchNotes();
  };

  return (
    <div>

      {/* <NewNoteForm onNoteCreated={handleNoteCreated} /> */}

      <UrlSearchBar setNotes={setNotes} />

      <Typography variant="h5">Following Notes</Typography>
      {notes.filter(note => following.some(u => u.id === note.user.id)).map((note) => (
        <FeedNote key={note.id} note={note} />
      ))}
      
      <Typography variant="h5">All Notes</Typography>
      {notes.map((note) => (
        // <Note key={note.id} note={note} userId={note.user.id} />
        <FeedNote key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesList;
