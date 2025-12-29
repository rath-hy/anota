import { TextField, Button, FormGroup, FormControlLabel } from "@mui/material";


import { useState } from "react";
import { useSelector } from "react-redux";
import noteService from "../services/notes";

import { Checkbox } from "@mui/material";

import store from '../store'

const NewNoteForm = ({ onNoteCreated }) => {
  const [username, setUsername] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState(null);

  const user = useSelector(state => state.user)
  // const token = useSelector(state => state.token)
  // noteService.setToken(token)

  const handleSubmit = async (event) => {
    event.preventDefault();

    const noteObject = {
      username: user.username,
      private: isPrivate,
      url,
      content,
      date: date ? date : null, // if empty, send null
    };

    try {
      const newNote = await noteService.create(noteObject);
      
      setMessage("Note created successfully!");
      setTimeout(() => setMessage(""), 2000);

      // reset form fields if needed:
      setUsername("");
      setIsPrivate(false);
      setUrl("");
      setContent("");
      setDate("");

      onNoteCreated(newNote)

    } catch (error) {
      setMessage("Failed to create note");
      console.error(error);
    }
  };

  return (
    <div>

      <h3>New Comment</h3>
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div> */}
        <div>
          {/* <label>Private: </label> */}
          {/* <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          /> */}


          <FormControlLabel control={
              <Checkbox 
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                slotProps={{
                  input: { 'aria-label': 'controlled' },
                }}
            />
            } label="Private" />

        </div>
        {/* <div>
          <label>URL: </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div> */}

        <div>
            <TextField 
              id="filled-basic" 
              variant="filled"
              type="url" 
              label="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} />
        </div>


        {/* <div>
          <label>Content: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div> */}

        <div>
          <TextField 
            id="outlined-basic" 
            label="Note" 
            variant="outlined" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} />
        </div>
          
        {/* <div>
          <label>Date (optional): </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div> */}

        {/* <button type="submit">Create Note</button> */}

        <Button 
          variant="contained" 
          size="small"
          type="submit"
        >
            Create note
        </Button>

      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewNoteForm;
