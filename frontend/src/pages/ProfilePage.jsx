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

  const isOwnProfile = id == loggedInUser.id

  return isOwnProfile ? <MePage/> : <TheirPage/>
}

export default ProfilePage