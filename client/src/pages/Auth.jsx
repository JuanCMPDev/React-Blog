import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import loginImg from "../img/loginimg.svg";
import logoutImg from "../img/logoutImg.svg";
import { AuthContext } from '../context/authContext';
import { toast } from 'sonner';

const Auth = () => {
  const location = useLocation();
  const { pathname } = location;
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      toast.error("No puedes acceder a esta ruta habiendo iniciado sesión.");
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null;
  }

  return (
    <div className="auth_container">
      <div className={`card`}>
          <Login pathname={pathname} />     
          <Register pathname={pathname} />     
        <div className={`toggle-container toggle-right ${pathname === '/register' && 'active'}`}>
          <div className="toggle">
            <div className={`toggle-panel toggle-right`}>
              <h1>Hey there!</h1>
              <img src={loginImg} alt="login-image" className="login-img"/>
              <p>It's nice to see you around</p>
            </div>
            <div className="toggle-panel toggle-left">
              <h1>Welcome!</h1>
              <img src={logoutImg} alt="login-image" className="login-img"/>
              <p>happy to see a new user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
