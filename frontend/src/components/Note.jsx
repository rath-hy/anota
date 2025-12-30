import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import { useNavigate } from 'react-router-dom'


//task: create a button where clicking it brings you to all the notes of that url
// the button can later become the logo


import noteService from '../services/notes'

import { useSelector } from 'react-redux'

const Note = ({ note, userId, showUsername=true, showUrl=true, showGo=true, onDelete }) => {

  //it should compare against the logged in user id
  const currentUser = useSelector(state => state.user)
  const canDelete = currentUser && userId === currentUser.id

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      if (window.confirm(`Delete ${note.content.substring(0, 30)}...?`)) {
        await noteService.deleteNote(note.id)
        onDelete && onDelete(note.id)
      }
    } catch (error) {
      console.error('error deleting note', error)
    }
  }

  //note: only notes on the ME page have onDelete passed in, so only on the ME page are notes deletable
  return (
    <div>
      <div>
        {onDelete && canDelete && <button onClick={handleDelete}>🗑️</button>}

        {showUsername ? (
            <>
              <Link to={`/users/${userId}`}><em>{note.user.username}</em></Link> •{" "}
            </>
          ) : null
        }

        {showUrl ? (
          <>
            <em><a href={note.url} target="_blank" rel="noopener noreferrer">{note.url}</a></em> •{" "}
          </>
        ) : null
        }

        {showGo ? (
          <button onClick={() => navigate(`notes?url=${encodeURIComponent(note.url)}`)}>
            🔵
          </button>) : null
        }

        {new Date(note.date).toDateString("en-US")}
      </div>
      <div>{note.content}</div>
    </div>
  )
}

export default Note