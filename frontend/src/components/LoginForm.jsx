import { useState, useEffect } from "react";
import loginService from "../services/login";
import noteService from "../services/notes";

import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux'
import { setUserAction } from "../reducers/userReducer";


const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });

      console.log('user', user)

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

      // noteService.setToken(user.token);
      dispatch(setUserAction(user))

      setUsername("");
      setPassword("");
      navigate("/");
    } catch (exception) {
      //display error message? see part 5
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

  return <div>{loginForm()}</div>;
};

export default LoginForm;
