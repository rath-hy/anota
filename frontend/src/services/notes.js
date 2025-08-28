import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes' //MOVE ALL BASEURLS INTO CONFIG FILE

import store from '../store'
import { setTokenAction } from '../reducers/tokenReducer'

const setToken = newToken => {
  const token = `Bearer ${newToken}`
  store.dispatch(setTokenAction(token))
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: store.getState().token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

const getByUrl = (url) => {
  const queryUrl = baseUrl + `?url=${url}`
  const request = axios.get(queryUrl)
  return request.then(response => response.data)
}

export default { getAll, getByUrl, create, update, setToken }