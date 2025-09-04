import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import Note from '../components/Note'

const baseUrl = 'http://localhost:3001/api/users' //this is hardcoded; fix later

import { useSelector } from 'react-redux'

import store from '../store'

const UserPage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const currentUser = useSelector(state => state.user)

  useEffect(() => {
    const fetchUser = async () => {
      try {

        console.log('token in store', store.getState().token)


        const config = {
          headers: {
            Authorization: store.getState().token
          }
        }

        const response = await axios.get(`${baseUrl}/${id}`, config)
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

        <div>notes:</div>
        {user.notes.map(note => 
          <Note key={note.id} note={note} userId={user.id} showUsername={false}/>
        )}

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