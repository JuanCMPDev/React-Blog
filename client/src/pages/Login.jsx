import {useContext, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/authContext';


const Login = ({pathname}) => {

  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  });

  let [err, setError] = useState(null);

  const navigate = useNavigate();

  const {login} = useContext(AuthContext)

  const handleChange = e => {
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  }

  const handleClick = async (e) => {
    e.preventDefault()  
    try{
      await login(inputs);
      setError(err = null);
      navigate("/");
    } catch(err){
      if(err){
        console.log(err)
        setError(err.response.data);
      }
    }
  }


  return (
    <div className={`form-container sign-in ${pathname === '/register' && 'active'}`}>
      <h1>Login</h1>
      <form>
        <input name="username" type="text" placeholder='Username' onChange={handleChange}/>
        <input name="password" type="password" placeholder='Password' onChange={handleChange}/>
        <button onClick={handleClick}>login</button>
        {err && <p>{err}</p>}
        <span>Don't you have an account? <Link to='/register'>register</Link></span>
      </form>
    </div>
  )
}

export default Login