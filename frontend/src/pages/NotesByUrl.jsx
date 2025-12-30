import { useState, useEffect } from "react"
import noteService from '../services/notes'
import { useSearchParams } from "react-router-dom";
import Note from "../components/Note";

import StyledNote from '../components/StyledNote'

import { Typography, Link, Card, CardContent, Box } from "@mui/material";

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

      {/* <Typography variant="h3">{url}</Typography> */}

      <Card>
        <CardContent>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Link href="#" underline="hover" variant="h5" sx={{ width: '400px', mx: 'auto'}}>
              {url}
            </Link>
          </Box>
        </CardContent>
      </Card>

      

      {notes.map(note => 
        <Note key={note.id} note={note} userId={note.user.id} showUrl={false} showGo={false}/>
      )}

      {notes.map(note => 
        <StyledNote 
          key={note.id} 
          note={note} 
        />
      )}

    </div>
  )

}

export default NotesByUrlPage
