import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/users'

import store from '../store'

const follow = async (userIdToFollow) => {
  const config = {
    headers: { Authorization: store.getState().token }
  }

  const response = await axios.post(`${baseUrl}/follow/${userIdToFollow}`, {}, config)
  return response.data
}

const unfollow = async (userIdToUnfollow) => {
  const config = {
    headers: { Authorization: store.getState().token }
  }

  console.log('config', config)

  const response = await axios.delete(`${baseUrl}/unfollow/${userIdToUnfollow}`, config)
  return response.data
}

export default { 
  follow, 
  unfollow 
}