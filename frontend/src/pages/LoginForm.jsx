import { useState, useEffect } from "react"
import loginService from '../../services/login'
import noteService from '../../services/notes'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // console.log('parsed user is', user)
      setUser(user)
      // noteService.setToken(user.token)
    }
  }, [])

  const handleLogout = async () => {
    console.log('tried to log out')
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      //display error message? see part 5
    }
  }

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input 
            type='text' 
            value={username} 
            name='username'
            onChange={({ target }) => setUsername(target.value) }
          />
        </div>
        <div>
          password 
          <input 
            type='password' 
            value={password}
            name='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const userInfo = () => (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>log out</button>
    </div>
  )

  return (
    <div>
      {user === null 
        ? loginForm()
        : userInfo()
      }
    </div>
  )
}

export default LoginForm