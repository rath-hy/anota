import axios from "axios";
const baseUrl = "http://localhost:3001/api/login";

import { setUserAction } from "../reducers/userReducer";

import store from "../store";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  const user = response.data;
  store.dispatch(setUserAction(user));
  return user;
};

export default { login };
