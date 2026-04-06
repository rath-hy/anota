import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import teamService from '../services/teams'

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif"

const ManageTeamPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const user = useSelector((state) => state.user)

  const [team, setTeam] = useState(null)
  const [error, setError] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const textColor = theme.palette.text.primary
  const mutedColor = theme.palette.text.secondary
  const borderColor = theme.palette.divider
  const bgColor = theme.palette.background.paper

  useEffect(() => {
    if (!user) return
    teamService.getTeam(id)
      .then(setTeam)
      .catch(() => setError('Could not load team.'))
  }, [id, user])

  if (!user) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px', fontFamily: serifFont, color: textColor }}>
      <p style={{ marginTop: '32px' }}>You must be logged in to manage a team.</p>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px', fontFamily: serifFont, color: '#cc0000' }}>
      <p style={{ marginTop: '32px' }}>{error}</p>
    </div>
  )

  if (!team) return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px', fontFamily: serifFont, color: mutedColor }}>
      <p style={{ marginTop: '32px' }}>Loading...</p>
    </div>
  )

  const isCreator = team.creator?.id === user.id

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleAction = async () => {
    setLoading(true)
    try {
      if (isCreator) {
        await teamService.deleteTeam(id)
      } else {
        await teamService.leaveTeam(id)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
      setConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: '28px', color: textColor, marginBottom: '4px' }}>
        {team.name}
      </h1>

      <p style={{ fontFamily: serifFont, fontSize: '16px', color: mutedColor, marginBottom: '24px' }}>
        Join code: <span style={{ letterSpacing: '2px', color: textColor, fontWeight: 500 }}>{team.code}</span>
      </p>

      <h2 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: '20px', color: textColor, marginBottom: '12px' }}>
        Members
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        {team.members?.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              border: `1px solid ${borderColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: serifFont, fontSize: '14px', color: textColor,
              flexShrink: 0, userSelect: 'none',
              backgroundColor: bgColor,
            }}>
              {getInitials(m.name)}
            </div>
            <div>
              <span style={{ fontFamily: serifFont, fontSize: '16px', color: textColor }}>
                {m.name}
              </span>
              <span style={{ fontFamily: serifFont, fontSize: '14px', color: mutedColor, marginLeft: '8px' }}>
                @{m.username}
              </span>
              {m.id === team.creator?.id && (
                <span style={{
                  marginLeft: '10px', fontSize: '12px', fontFamily: serifFont,
                  color: mutedColor, border: `1px solid ${borderColor}`,
                  padding: '1px 6px',
                }}>
                  creator
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          style={{
            padding: '8px 20px',
            border: '1px solid #cc0000',
            backgroundColor: 'transparent',
            color: '#cc0000',
            cursor: 'pointer',
            fontFamily: serifFont,
            fontSize: '16px',
            borderRadius: 0,
          }}
        >
          {isCreator ? 'Delete this team' : 'Leave this team'}
        </button>
      ) : (
        <div style={{ border: `1px solid ${borderColor}`, padding: '20px', maxWidth: '480px' }}>
          <p style={{ fontFamily: serifFont, fontSize: '16px', color: textColor, marginTop: 0, marginBottom: '16px' }}>
            {isCreator
              ? 'This will permanently delete the team and all notes posted to it. This cannot be undone.'
              : 'This will remove you from the team and delete all notes you posted to it. This cannot be undone.'}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAction}
              disabled={loading}
              style={{
                padding: '8px 20px',
                border: '1px solid #cc0000',
                backgroundColor: '#cc0000',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: serifFont,
                fontSize: '16px',
                borderRadius: 0,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Working...' : (isCreator ? 'Yes, delete team' : 'Yes, leave team')}
            </button>
            <button
              onClick={() => setConfirm(false)}
              disabled={loading}
              style={{
                padding: '8px 20px',
                border: `1px solid ${borderColor}`,
                backgroundColor: 'transparent',
                color: textColor,
                cursor: 'pointer',
                fontFamily: serifFont,
                fontSize: '16px',
                borderRadius: 0,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageTeamPage
