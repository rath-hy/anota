import { useState, useEffect } from "react";
import loginService from "../services/login";
import noteService from "../services/notes";

import store from "../store";
import { resetUserAction } from "../reducers/userReducer";


import { useDispatch, useSelector } from 'react-redux'
import { setUserAction } from "../reducers/userReducer";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [user, setUser] = useState(null);

  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user)

  const handleLogout = async () => {
    console.log("tried to log out");
    window.localStorage.removeItem("loggedNoteappUser");
    store.dispatch(resetUserAction());
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

      dispatch(setUserAction({ id: user.id, username: user.username }))

      noteService.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (exception) {
      //display error message? see part 5
      console.log(exception);
    }
  };

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const userInfo = () => (
    <div>
      <p>{currentUser.username} logged in</p>
      <button onClick={handleLogout}>log out</button>
    </div>
  );

  return <div>{currentUser === null ? loginForm() : userInfo()}</div>;
};

export default LoginPage;
