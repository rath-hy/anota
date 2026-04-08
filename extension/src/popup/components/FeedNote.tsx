import React, { useState } from 'react'

export interface Note {
  id: number
  content: string
  url: string
  date: string
  private: boolean
  teamId?: number | null
  user?: {
    id: number
    username: string
    name: string
  }
}

interface FeedNoteProps {
  note: Note
  onDelete?: (id: number) => void
}

const FeedNote: React.FC<FeedNoteProps> = ({ note }) => {
  const [showFull, setShowFull] = useState(false)

  const isLong = note.content.length > 220
  const display = isLong && !showFull ? note.content.substring(0, 220) + '…' : note.content

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="feednote">
      <div className="feednote-header">
        {note.user && (
          <div className="feednote-avatar">
            {getInitials(note.user.name || note.user.username)}
          </div>
        )}
        {note.user && <span className="feednote-name">{note.user.name}</span>}
        <span className="feednote-date">{formatDate(note.date)}</span>
      </div>
      <div className="feednote-content">
        {display}
        {isLong && (
          <button className="feednote-toggle" onClick={() => setShowFull(s => !s)}>
            {showFull ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  )
}

export default FeedNote
