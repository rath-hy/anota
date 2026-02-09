import axios from "axios";
import config from '../config'
const baseUrl = `${config.API_URL}/api/login`

import { setUserAction } from "../reducers/userReducer";

import store from "../store";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  const user = response.data;
  store.dispatch(setUserAction(user));
  return user;
};

export default { login };
