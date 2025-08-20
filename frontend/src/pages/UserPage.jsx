import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/users' //this is hardcoded; fix later

const UserPage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseUrl}/${id}`)
        console.log('user fetched', response.data)
        setUser(response.data)
      } catch (error) {

      }
    }

    fetchUser()
  }, [id])

  if (user) {
    return (
      <div>
        <div>username: {user.username}</div>
        <div>name: {user.name}</div>
        <div>note count: {user.notes.length} </div>
        <div>like count: </div>
      </div>
    )
  }

  return (
    <div>
      loading...
    </div>
  )

}

export default UserPage