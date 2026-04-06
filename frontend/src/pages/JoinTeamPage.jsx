import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import teamService from '../services/teams'

const serifFont = "'EB Garamond', Georgia, 'Times New Roman', Times, serif"

const JoinTeamPage = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  const textColor = theme.palette.text.primary
  const bgColor = theme.palette.background.paper
  const borderColor = theme.palette.divider
  const btnBg = theme.palette.mode === 'dark' ? '#e0e0e0' : '#1a1a1a'
  const btnText = theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await teamService.joinTeam(code)
      navigate(`/?tab=teams&teamId=${result.teamId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: '24px', color: textColor, marginBottom: '24px' }}>
        Join a team
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="code" style={{
            display: 'block', marginBottom: '6px',
            fontFamily: serifFont, fontSize: '20px', color: textColor
          }}>
            Team code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC-1234"
            required
            style={{
              width: '100%', padding: '6px 8px',
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor, color: textColor,
              fontFamily: serifFont, fontSize: '18px',
              letterSpacing: '2px',
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
          {loading ? 'Joining...' : 'Join team'}
        </button>
      </form>
    </div>
  )
}

export default JoinTeamPage
