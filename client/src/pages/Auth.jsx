import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import loginImg from "../img/loginImg.svg";
import logoutImg from "../img/logoutImg.svg";
import { AuthContext } from '../context/AuthContext';
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
              <h1>¿Cómo estás?</h1>
              <img src={loginImg} alt="login-image" className="login-img"/>
              <p>Es bueno verte de vuelta</p>
              <p className="small-screen">Ingresa</p>
            </div>
            <div className="toggle-panel toggle-left">
              <h1>Bienvenido!</h1>
              <img src={logoutImg} alt="login-image" className="login-img"/>
              <p>Es bueno ver a un nuevo usuario</p>
              <p className="small-screen">Registrate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
