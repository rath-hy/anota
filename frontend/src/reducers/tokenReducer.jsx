const tokenReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return action.payload.token
    default:
      return state
  }
}

export const setTokenAction = (token) => {
  return {
    type: 'SET_TOKEN',
    payload: {
      token
    }
  }
}

export default tokenReducer