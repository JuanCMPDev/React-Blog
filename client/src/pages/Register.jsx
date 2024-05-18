import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Register = ({pathname}) => {

  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = e => {
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  }

  const handleClick = async (e) => {
    e.preventDefault()  
    try{
      await axios.post('http://localhost:8800/api/auth/register', inputs);
      setTimeout(()=>{
        navigate("/login")
      }, "1500");
    } catch(err){
      if(err.response.status === 409){
        setError(err.response.data);  
      }
    }
  }

  return (
    <div className={`form-container register ${pathname === '/register' && 'active'}`}>
      <h1>Register</h1>
      <form>
        <input required type="text" name='username' placeholder='Username' onChange={handleChange}/>
        <input required type="email" name='email' placeholder='Email' onChange={handleChange}/>
        <input required type="password" name='password' placeholder='Password' onChange={handleChange}/>
        <button onClick={handleClick}>Sign up</button>
        {err && <p>{err}</p>}
        <span>Already have an account? <br/><Link to='/login'>login!</Link></span>
      </form>
    </div>
  )
}

export default Register