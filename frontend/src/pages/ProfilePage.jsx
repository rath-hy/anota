import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import TheirPage from "./TheirPage"
import MePage from "./MePage"

const ProfilePage = () => {
  const { id } = useParams()
  const loggedInUser = useSelector(state => state.user)

  if (loggedInUser === null) {
    return <div>Loading...</div>
  }

  console.log('logged in user', loggedInUser)
  const isOwnProfile = id == loggedInUser.id
  
  console.log('is own profile?', isOwnProfile)
  console.log('id', id)
  console.log('logged in user id', id)

  return isOwnProfile ? <MePage/> : <TheirPage/>
}

export default ProfilePage