import {useContext, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';


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

    console.log(inputs.username.length);

    if (inputs.username.length <= 0) {
      setError("Username can't be empty.");
      return;
    }
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
      <h1>Ingresa</h1>
      <form>
        <input name="username" type="text" placeholder='Username' onChange={handleChange}/>
        <input name="password" type="password" placeholder='Contraseña' onChange={handleChange}/>
        <button onClick={handleClick}>Inicia Sesión</button>
        {err && <p>{err}</p>}
        <span>¿No tienes una cuenta? <br/> <Link to='/register'>registrate</Link></span>
      </form>
    </div>
  )
}

export default Login