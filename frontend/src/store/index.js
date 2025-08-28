import { createStore, combineReducers } from 'redux'

import tokenReducer from "../reducers/tokenReducer"
import userReducer from "../reducers/userReducer"

const reducer = combineReducers({
  token: tokenReducer,
  user: userReducer
})

const store = createStore(reducer)

store.subscribe(() => console.log('state of store', store.getState()))

export default store
