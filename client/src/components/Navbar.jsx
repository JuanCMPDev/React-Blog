import React, { useContext, useState } from 'react'
import {Link, NavLink} from 'react-router-dom'
import Logo from '../img/code.svg'
import { AuthContext } from '../context/authContext';
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const links = ['Tutoriales', 'Recursos', 'Opinión'];

const Navbar = () => {

  const [isMenuActive, setIsMenuActive] = useState(false);

  const {currentUser, logout} = useContext(AuthContext);

  const isAdminOrWriter = currentUser && (currentUser.role === 'admin' || currentUser.role === 'writer');

  const handleMenuClick = () => {
    setIsMenuActive(!isMenuActive);
  }

  return (
    <div className='navbar'>
      <div className='nav-container'>
        <Link to='/'> 
          <div className="logo">      
              <img src={Logo} alt=""/>
              <p className='logo-text'>JuanCDEV</p>
          </div>
        </Link>
        <div className={isMenuActive ? "links" : "links off"}>
          <div className="nav-links">
            {links.map((link) => (
              <NavLink end className='link' key={link} to={`/?category=${link.toLowerCase()}`}>
                <h6>{link}</h6>
              </NavLink>
            ))}
          </div>
          <div className="session">
            {currentUser && (
              <>
                <span className='session'>{currentUser.username}</span>
                <span className='session' onClick={logout}>Cerrar Sesión</span>
              </>
            )}
            {!currentUser && <Link className='link' to="/login">Ingresa</Link>}
          </div>
          {isAdminOrWriter && <Link className='link' to='/write'>
            <div className='write-button'>
              Post
            </div>
          </Link>}
          
        </div>
        <div className="menu">
            <div className={isMenuActive ? 'burger off' : 'burger'} onClick={handleMenuClick}>
              <MdMenu/>
            </div>
            <div className={isMenuActive ? 'close' : 'close off'} onClick={handleMenuClick}>
              <IoClose />
            </div>
          </div>
      </div>
    </div>
  )
}

export default Navbar