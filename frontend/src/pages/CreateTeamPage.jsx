import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import teamService from '../services/teams'

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif"

const CreateTeamPage = () => {
  const [name, setName] = useState('')
  const [result, setResult] = useState(null) // { code, name }
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  const textColor = theme.palette.text.primary
  const bgColor = theme.palette.background.paper
  const borderColor = theme.palette.divider
  const mutedColor = theme.palette.text.secondary
  const btnBg = theme.palette.mode === 'dark' ? '#e0e0e0' : '#1a1a1a'
  const btnText = theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const team = await teamService.createTeam(name)
      setResult(team)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
        <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: '24px', color: textColor }}>
          {result.name} created!
        </h1>
        <p style={{ fontFamily: serifFont, fontSize: '18px', color: textColor, marginBottom: '8px' }}>
          Your teammates can join with this code:
        </p>
        <div style={{
          display: 'inline-block',
          padding: '12px 24px',
          border: `2px solid ${borderColor}`,
          fontFamily: serifFont,
          fontSize: '32px',
          letterSpacing: '4px',
          color: textColor,
          backgroundColor: bgColor,
          marginBottom: '24px',
          userSelect: 'all'
        }}>
          {result.code}
        </div>
        {/* <p style={{ fontFamily: serifFont, fontSize: '16px', color: mutedColor, marginBottom: '24px' }}>
          Anyone with this code can join your team from the "Join a team" page.
        </p> */}
        <div>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 20px',
              border: `1px solid ${btnBg}`,
              backgroundColor: btnBg,
              color: btnText,
              cursor: 'pointer',
              fontFamily: serifFont,
              fontSize: '16px',
              borderRadius: 0
            }}
          >
            Go to homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: '24px', color: textColor, marginBottom: '24px' }}>
        Create a new team
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="teamName" style={{
            display: 'block', marginBottom: '6px',
            fontFamily: serifFont, fontSize: '20px', color: textColor
          }}>
            Team name
          </label>
          <input
            id="teamName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. History 101 Study Group"
            required
            style={{
              width: '100%', padding: '6px 8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor, color: textColor,
              fontFamily: serifFont, fontSize: '18px',
              borderRadius: 0, boxSizing: 'border-box', outline: 'none'
            }}
          />
        </div>

        {error && (
          <p style={{ fontFamily: serifFont, color: '#cc0000', marginBottom: '12px' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 20px',
            border: `1px solid ${btnBg}`,
            backgroundColor: btnBg,
            color: btnText,
            cursor: 'pointer',
            fontFamily: serifFont,
            fontSize: '16px',
            borderRadius: 0,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Create team'}
        </button>
      </form>
    </div>
  )
}

export default CreateTeamPage
