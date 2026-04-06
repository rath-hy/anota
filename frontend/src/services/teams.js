import axios from 'axios'
import config from '../config'
import store from '../store'

const baseUrl = `${config.API_URL}/api/teams`

const getAuthConfig = () => ({
  headers: { Authorization: store.getState().token }
})

const getMyTeams = async () => {
  const response = await axios.get(`${baseUrl}/mine`, getAuthConfig())
  return response.data
}

const createTeam = async (name) => {
  const response = await axios.post(baseUrl, { name }, getAuthConfig())
  return response.data
}

const joinTeam = async (code) => {
  const response = await axios.post(`${baseUrl}/join`, { code }, getAuthConfig())
  return response.data
}

const getTeamNotes = async (teamId, userId = null) => {
  const params = userId ? { userId } : {}
  const response = await axios.get(`${baseUrl}/${teamId}/notes`, {
    ...getAuthConfig(),
    params
  })
  return response.data
}

const getTeamMembers = async (teamId) => {
  const response = await axios.get(`${baseUrl}/${teamId}/members`, getAuthConfig())
  return response.data
}

const getTeam = async (teamId) => {
  const response = await axios.get(`${baseUrl}/${teamId}`, getAuthConfig())
  return response.data
}

const deleteTeam = async (teamId) => {
  await axios.delete(`${baseUrl}/${teamId}`, getAuthConfig())
}

const leaveTeam = async (teamId) => {
  await axios.delete(`${baseUrl}/${teamId}/leave`, getAuthConfig())
}

export default { getMyTeams, createTeam, joinTeam, getTeamNotes, getTeamMembers, getTeam, deleteTeam, leaveTeam }
