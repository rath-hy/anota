const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url)
    
    // Handle YouTube URLs
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return normalizeYouTubeUrl(urlObj)
    }
    
    // For other URLs, normalize to remove www, trailing slashes, etc.
    return normalizeGenericUrl(urlObj)
    
  } catch (error) {
    // If URL parsing fails, return original
    return url
  }
}

const normalizeYouTubeUrl = (urlObj) => {
  let videoId = null
  
  // Format: youtu.be/VIDEO_ID
  if (urlObj.hostname.includes('youtu.be')) {
    videoId = urlObj.pathname.slice(1).split('?')[0]
  }
  
  // Format: youtube.com/watch?v=VIDEO_ID
  else if (urlObj.pathname === '/watch') {
    videoId = urlObj.searchParams.get('v')
  }
  
  // Format: youtube.com/embed/VIDEO_ID
  else if (urlObj.pathname.startsWith('/embed/')) {
    videoId = urlObj.pathname.split('/')[2]
  }
  
  // Format: youtube.com/v/VIDEO_ID
  else if (urlObj.pathname.startsWith('/v/')) {
    videoId = urlObj.pathname.split('/')[2]
  }
  
  // If we found a video ID, return canonical format
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`
  }
  
  // For playlists or channels, normalize hostname
  return `https://www.youtube.com${urlObj.pathname}${urlObj.search}`
}

const normalizeGenericUrl = (urlObj) => {
  // Remove www
  let hostname = urlObj.hostname.replace(/^www\./, '')
  
  // Remove trailing slash from pathname
  let pathname = urlObj.pathname.replace(/\/$/, '') || '/'
  
  // Keep search params but sort them for consistency
  let search = ''
  if (urlObj.search) {
    const params = new URLSearchParams(urlObj.search)
    const sortedParams = Array.from(params.entries()).sort()
    search = '?' + new URLSearchParams(sortedParams).toString()
  }
  
  // Always use https
  return `https://${hostname}${pathname}${search}`
}

module.exports = { normalizeUrl }