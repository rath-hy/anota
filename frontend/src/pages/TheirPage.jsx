import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import Note from '../components/Note'

const baseUrl = 'http://localhost:3001/api/users' //this is hardcoded; fix later

import { useSelector } from 'react-redux'

import store from '../store'

const TheirPage = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('FETCHING USER WITH ID:', id) // Add this
        console.log('URL:', `${baseUrl}/${id}?public=true`) // Add this

        console.log('token in store', store.getState().token)

        const config = {
          headers: {
            Authorization: store.getState().token
          }
        }

        const response = await axios.get(`${baseUrl}/${id}?public=true`, config)
        console.log('user fetched (only public info)', response.data)
        setUser(response.data)
      } catch (error) {

      }
    }

    fetchUser()
  }, [id])

  const handleFilterChange = (event) => {
    console.log('filter', event.target.value)
    setFilter(event.target.value)
  }

  // const filteredNotes = user?.notes.filter(note => {
  //   switch (filter) {
  //     case 'private':
  //       return note.private
  //     case 'public':
  //       return !note.private
  //     case 'all':
  //     default:
  //       return true
  //   }
  // })


  if (user) {
    return (
      <div>
        <div>username: {user.username}</div>
        <div>name: {user.name}</div>
        <div>note count: {user.notes.length} </div>
        <div>total like count: {user.notes.reduce( (prev, curr) => prev + curr.likes, 0 )}</div> 

        <div>notes:</div>
        {user?.notes.map(note => 
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

export default TheirPage