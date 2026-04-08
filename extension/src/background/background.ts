import config from '../config'
import { getAuth, setAuth } from '../utils/storage'
import { normalizeUrl } from '../utils/urlNormalizer'

async function updateBadge(tabId: number, url: string): Promise<void> {
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    chrome.action.setBadgeText({ text: '', tabId })
    return
  }
  try {
    const normalized = normalizeUrl(url)
    const auth = await getAuth()
    const headers: HeadersInit = auth ? { Authorization: `Bearer ${auth.token}` } : {}

    const res = await fetch(
      `${config.API_URL}/api/notes?url=${encodeURIComponent(normalized)}`,
      { headers }
    )
    if (!res.ok) throw new Error('fetch failed')
    const notes = await res.json()
    const count: number = Array.isArray(notes) ? notes.length : 0

    if (count > 0) {
      chrome.action.setBadgeText({ text: String(count), tabId })
      chrome.action.setBadgeBackgroundColor({ color: '#3d2b1f', tabId })
    } else {
      chrome.action.setBadgeText({ text: '', tabId })
    }
  } catch {
    chrome.action.setBadgeText({ text: '', tabId })
  }
}

// Badge on tab load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateBadge(tabId, tab.url)
  }
})

// Badge when switching tabs
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, tab => {
    if (tab.url) updateBadge(tabId, tab.url)
  })
})

// Messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge' && sender.tab?.id && request.url) {
    updateBadge(sender.tab.id, request.url)
    return false
  }
  if (request.action === 'relayAuth' && request.token && request.user) {
    setAuth(request.token, request.user).then(() => sendResponse({ success: true }))
    return true
  }
})

// Direct messages from the Anota website (requires externally_connectable in manifest)
chrome.runtime.onMessageExternal.addListener((request, _sender, sendResponse) => {
  if (request.type === 'ANOTA_AUTH' && request.token && request.user) {
    setAuth(request.token, request.user).then(() => sendResponse({ success: true }))
    return true
  }
})
