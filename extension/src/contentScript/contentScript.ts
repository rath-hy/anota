// Trigger badge update for this page
chrome.runtime.sendMessage({
  action: 'updateBadge',
  url: window.location.href,
})

// Relay auth token from Anota website to extension background
const TRUSTED_ORIGINS = [
  'https://anota.puthyrathy.com',
  'https://anota-ashy.vercel.app',
]

window.addEventListener('message', event => {
  if (!TRUSTED_ORIGINS.includes(event.origin)) return
  if (!event.data || event.data.type !== 'ANOTA_AUTH') return
  if (!event.data.token || !event.data.user) return

  chrome.runtime.sendMessage({
    action: 'relayAuth',
    token: event.data.token,
    user: event.data.user,
  })
})
