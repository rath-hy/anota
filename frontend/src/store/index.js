import { createStore, combineReducers } from 'redux'

import tokenReducer from "../reducers/tokenReducer"
import userReducer from "../reducers/userReducer"
import themeReducer from '../reducers/themeReducer'

const reducer = combineReducers({
  token: tokenReducer,
  user: userReducer,
  theme: themeReducer
})

const store = createStore(reducer)

store.subscribe(() => console.log('state of store', store.getState()))

export default store
