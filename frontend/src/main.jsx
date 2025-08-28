import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { Provider } from 'react-redux'
import tokenReducer from './reducers/tokenReducer.jsx'
import userReducer from './reducers/userReducer.jsx'

import { createStore, combineReducers } from 'redux'

import store from './store/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
