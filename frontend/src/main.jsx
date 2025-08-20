import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { Provider } from 'react-redux'
import tokenReducer from './reducers/tokenReducer.jsx'
import { createStore } from 'redux'

const store = createStore(tokenReducer)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
