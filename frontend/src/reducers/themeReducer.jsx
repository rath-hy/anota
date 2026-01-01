// src/reducers/themeReducer.js
const initialState = window.localStorage.getItem('theme') || 'light'

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      const newTheme = state === 'light' ? 'dark' : 'light'
      window.localStorage.setItem('theme', newTheme)
      return newTheme
    case 'SET_THEME':
      window.localStorage.setItem('theme', action.payload)
      return action.payload
    default:
      return state
  }
}

export const toggleTheme = () => {
  return {
    type: 'TOGGLE_THEME'
  }
}

export const setTheme = (theme) => {
  return {
    type: 'SET_THEME',
    payload: theme
  }
}

export default themeReducer