import { useState } from "react";
import LoginPage from "../pages/LoginPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";




const Account = () => {
  const [user, setUser] = useState(null);

  return (
      <>
        {!user && 
          <Link to='/login'>login</Link>
        }

        {user && <p>{user.name} logged in</p>}
      </>
  );
};

export default Account;
