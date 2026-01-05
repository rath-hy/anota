import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import noteService from "../services/notes"
import { Box, Autocomplete, TextField, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const UrlSearchBar = () => {
  const [url, setUrl] = useState("")
  const [urlOptions, setUrlOptions] = useState([])
  const navigate = useNavigate()

  const handleSearch = () => {
    if (url) {
      navigate(`/notes?url=${encodeURIComponent(url)}`)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const fetchUrlOptions = async () => {
    try {
      const urlOptionsData = await noteService.getUniqueUrls()
      setUrlOptions(urlOptionsData)
    } catch (error) {
      console.error('Error fetching URLs:', error)
    }
  }

  useEffect(() => {
    fetchUrlOptions()
  }, [])

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Autocomplete 
          freeSolo
          fullWidth
          options={urlOptions}
          value={url}
          onChange={(event, newValue) => setUrl(newValue || '')} 
          onInputChange={(event, newInputValue) => setUrl(newInputValue)}
          renderInput={(params) => (
            <TextField 
              {...params}
              label="Search for URLs with notes"
              placeholder="e.g., youtube.com, facebook.com"
              onKeyDown={handleKeyDown}
            />
          )}
        />

        <IconButton 
          onClick={handleSearch}
          color="primary"
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default UrlSearchBar