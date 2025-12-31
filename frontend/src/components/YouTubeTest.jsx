// frontend/src/components/YouTubeTest.jsx
import { useState } from 'react'
import { Button, TextField, Box } from '@mui/material'
import youtubeService from '../services/youtube'

const YouTubeTest = () => {
  const [url, setUrl] = useState('https://youtu.be/IrVHB0Hp3F0?si=DF-7hzN0_2GOK9na')
  const [videoInfo, setVideoInfo] = useState(null)

  const handleFetch = async () => {
    const info = await youtubeService.getVideoInfo(url)
    console.log('Full video info:', info)
    setVideoInfo(info)
  }

  console.log('API Key:', import.meta.env.VITE_YOUTUBE_API_KEY)
  
  return (
    
    <Box sx={{ p: 3 }}>
      <h2>YouTube API Test</h2>
      
      <TextField
        fullWidth
        label="YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Button variant="contained" onClick={handleFetch}>
        Fetch Video Info
      </Button>

      {videoInfo && (
        <Box sx={{ mt: 2 }}>
          <h3>Video Title: {videoInfo.snippet.title}</h3>
          <p>Channel: {videoInfo.snippet.channelTitle}</p>
          <p>Views: {videoInfo.statistics.viewCount}</p>
          <p>Likes: {videoInfo.statistics.likeCount}</p>
          <pre>{JSON.stringify(videoInfo, null, 2)}</pre>
        </Box>
      )}
    </Box>
  )
}

export default YouTubeTest