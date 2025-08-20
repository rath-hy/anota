import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes' //MOVE ALL BASEURLS INTO CONFIG FILE



let token = null

//experimental lines 

import { createStore } from 'redux'
// import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from '../src/reducers/tokenReducer'

import { setTokenAction } from '../src/reducers/tokenReducer'

const store = createStore(tokenReducer)

const setToken = newToken => {
  token = `Bearer ${newToken}`
  store.dispatch(setTokenAction(token))
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  // const config = {
  //   headers: { Authorization: token },
  // }

  const config = {
    headers: { Authorization: store.getState() },
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