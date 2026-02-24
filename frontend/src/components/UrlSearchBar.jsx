import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import noteService from "../services/notes"
import { useTheme } from '@mui/material/styles'

const serifFont = "'Cormorant Garamond', Georgia, 'Times New Roman', Times, serif"

const UrlSearchBar = () => {
  const [url, setUrl] = useState("")
  const [urlOptions, setUrlOptions] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  const bg = theme.palette.background.paper
  const text = theme.palette.text.primary
  const border = theme.palette.divider
  const isDark = theme.palette.mode === 'dark'

  const handleSearch = () => {
    if (url) navigate(`/notes?url=${encodeURIComponent(url)}`)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleSearch()
  }

  const fetchUrlOptions = async () => {
    try {
      const urlOptionsData = await noteService.getUniqueUrls()
      setUrlOptions(urlOptionsData)
    } catch (error) {
      console.error('Error fetching URLs:', error)
    }
  }

  useEffect(() => { fetchUrlOptions() }, [])

  const filtered = urlOptions.filter(u => u.toLowerCase().includes(url.toLowerCase()) && u !== url)

  return (
    <div style={{ marginBottom: '24px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setShowOptions(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowOptions(true)}
          onBlur={() => setTimeout(() => setShowOptions(false), 150)}
          placeholder="Search for a URL with notes..."
          style={{
            flex: 1,
            padding: '8px 10px',
            border: `1px solid ${border}`,
            borderRadius: 0,
            fontFamily: serifFont,
            fontSize: '18px',
            backgroundColor: bg,
            color: text,
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            width: '80px',
            padding: '0 12px',
            border: `1px solid ${text}`,
            backgroundColor: text,
            color: bg,
            cursor: 'pointer',
            fontFamily: serifFont,
            fontSize: '18px',
            borderRadius: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </button>
      </div>

      {/* Dropdown options */}
      {showOptions && url && filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: '80px',
          backgroundColor: bg,
          border: `1px solid ${border}`,
          borderTop: 'none',
          zIndex: 10,
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {filtered.slice(0, 8).map((option) => (
            <div
              key={option}
              onMouseDown={() => { setUrl(option); setShowOptions(false) }}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                fontFamily: serifFont,
                fontSize: '16px',
                color: text,
                borderBottom: `1px solid ${border}`,
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = bg}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UrlSearchBar