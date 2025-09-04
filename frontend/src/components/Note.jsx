import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

const Note = ({ note, userId, showUsername=true, showUrl=true }) => {
  return (
    <div>
      <div>
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

        {new Date(note.date).toDateString("en-US")}
      </div>
      <div>{note.content}</div>
    </div>
  )
}

export default Note