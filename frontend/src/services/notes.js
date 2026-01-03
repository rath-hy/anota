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

const getAllPublic = async () => {
  const response = await axios.get(`${baseUrl}?publicOnly=true`)
  return response.data
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

const getPublicByUrl = (url) => {
  const request = axios.get(baseUrl, {
    params: {
      url,
      publicOnly: true
    }
  })
  return request.then(response => response.data)
}

const deleteNote = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

const searchUrls = async key => {
  const response = await axios.get(`${baseUrl}/urls?search=${key}`)
  console.log('urls found', response.data)
  return response.data
}

export default { getAll, getAllPublic, getPublicByUrl, create, update, setToken, deleteNote, searchUrls }