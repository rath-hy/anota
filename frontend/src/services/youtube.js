const VITE_YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

const extractVideoId = (url) => {
  try {
    const urlObj = new URL(url)

    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1).split('?')[0]
    }

    if (url.hostname.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    }

    return null
  } catch {
    return null
  }
}

const getVideoInfo = async (url) => {
  const videoId = extractVideoId(url)

  if (!videoId) {
    console.log('Invalid YouTube URL')
    return null
  }

  console.log('video id', videoId)

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${VITE_YOUTUBE_API_KEY}
     &part=snippet,contentDetails,statistics,status`)

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      return data.items[0]
    }

    return null 
  } catch (error) {
    console.error('YouTube API error:', error)
  }
}

export default { getVideoInfo, extractVideoId }