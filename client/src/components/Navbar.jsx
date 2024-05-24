import React, { useContext } from 'react'
import {Link, NavLink} from 'react-router-dom'
import Logo from '../img/code.svg'
import { AuthContext } from '../context/authContext';

const links = ['News', 'Tutorials', 'Resources', 'Bootcamps'];

const Navbar = () => {

  const {currentUser, logout} = useContext(AuthContext)

  const isAdminOrWriter = currentUser && (currentUser.role === 'admin' || currentUser.role === 'writer')

  return (
    <div className='navbar'>
      <div className='nav-container'>
        <Link to='/'> 
          <div className="logo">      
              <img src={Logo} alt=""/>
              <p className='logo-text'>JuanCDEV</p>
          </div>
        </Link>
        <div className="links">
          {links.map((link) => (
            <NavLink end className='link' key={link} to={`/?category=${link.toLowerCase()}`}>
              <h6>{link}</h6>
            </NavLink>
          ))}
          <div className="session">
            {currentUser && (
              <>
                <span className='session'>{currentUser.username}</span>
                <span className='session' onClick={logout}>Log out</span>
              </>
            )}
            {!currentUser && <Link className='link' to="/login">Login</Link>}
          </div>
          {isAdminOrWriter && <Link className='link' to='/write'>
            <div className='write-button'>
              Write
            </div>
          </Link>}
        </div>
      </div>
    </div>
  )
}

export default Navbar