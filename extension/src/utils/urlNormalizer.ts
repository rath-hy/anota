const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'ref', 'mc_cid', 'mc_eid', '_ga', 'igshid', 'twclid',
]

export function normalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    TRACKING_PARAMS.forEach(p => url.searchParams.delete(p))
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    url.hash = ''
    // Remove trailing slash from non-root paths
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.toString()
  } catch {
    return rawUrl
  }
}
