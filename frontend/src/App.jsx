import { useState } from 'react'
import AddNote from './pages/AddNote'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AddNote />
    </>
  )
}

export default App
