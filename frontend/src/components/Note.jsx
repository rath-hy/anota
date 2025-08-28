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
            <em>{note.url}</em> •{" "}
          </>
        ) : null}

        {new Date(note.date).toDateString("en-US")}
      </div>
      <div>{note.content}</div>
    </div>
  )
}

export default Note