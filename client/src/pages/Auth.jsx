import React from "react";
import { useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="auth_container">
      <div className={`card`}>
          <Login pathname={pathname} />     
          <Register pathname={pathname} />     
        <div className={`toggle-container toggle-right ${pathname === '/register' && 'active'}`}>
          <div className="toggle">
            <div className={`toggle-panel toggle-right`}>
              <h1>Hey there!</h1>
              <p>It's nice to see you around</p>
            </div>
            <div className="toggle-panel toggle-left">
              <h1>Welcome!</h1>
              <p>happy to see a new user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
