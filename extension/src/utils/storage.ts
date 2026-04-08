export interface StoredUser {
  id: number
  username: string
  name: string
}

export interface AuthData {
  token: string
  user: StoredUser
}

export const getAuth = (): Promise<AuthData | null> =>
  new Promise(resolve => {
    chrome.storage.local.get(['token', 'user'], result => {
      if (result.token && result.user) {
        resolve({ token: result.token as string, user: result.user as StoredUser })
      } else {
        resolve(null)
      }
    })
  })

export const setAuth = (token: string, user: StoredUser): Promise<void> =>
  new Promise(resolve => chrome.storage.local.set({ token, user }, resolve))

export const clearAuth = (): Promise<void> =>
  new Promise(resolve => chrome.storage.local.remove(['token', 'user'], resolve))

export const getActiveTab = (): Promise<string> =>
  new Promise(resolve => {
    chrome.storage.local.get('activeTab', result => {
      const tab = result.activeTab
      resolve(['all', 'following', 'teams'].includes(tab) ? tab : 'all')
    })
  })

export const saveActiveTab = (tab: string): Promise<void> =>
  new Promise(resolve => chrome.storage.local.set({ activeTab: tab }, resolve))

export const getSelectedTeamId = (): Promise<number | null> =>
  new Promise(resolve => {
    chrome.storage.local.get('selectedTeamId', result => {
      resolve(result.selectedTeamId ? Number(result.selectedTeamId) : null)
    })
  })

export const saveSelectedTeamId = (id: number): Promise<void> =>
  new Promise(resolve => chrome.storage.local.set({ selectedTeamId: id }, resolve))
