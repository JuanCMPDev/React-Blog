import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ pathname }) => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [err, setError] = useState(null);
  const recaptchaRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePasswordCharacters = password => {
    const re = /^(?=.*[A-Z])(?=.*[!@#$&*])/;
    return re.test(password);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null)

    // Validaciones
    if (!inputs.username || !inputs.email || !inputs.password) {
      setError("All fields are required.");
      return;
    }

    if (!validateEmail(inputs.email)) {
      setError("Invalid email format.");
      return;
    }

    if (inputs.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!validatePasswordCharacters(inputs.password)) {
      setError('Password must contain at least one uppercase letter and one special character.');
      return;
    }

    recaptchaRef.current.execute();
  };

  const onCaptchaChange = async (token) => {
    if (token) {
      setError(null);

      try {
        await axios.post('http://localhost:8800/api/auth/register', { ...inputs, recaptchaToken: token });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (err) {
        if (err.response && err.response.status === 409) {
          setError(err.response.data);
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className={`form-container register ${pathname === '/register' && 'active'}`}>
      <h1>Register</h1>
      <form>
        <input required type="text" name='username' placeholder='Username' onChange={handleChange} />
        <input required type="email" name='email' placeholder='Email' onChange={handleChange} />
        <input required type="password" name='password' placeholder='Password' onChange={handleChange} />
        <ReCAPTCHA
          sitekey='6Lf6WeUpAAAAAF5w6w-TuCeIt3HubkNooieoJVPU'
          size='invisible'
          ref={recaptchaRef}
          onChange={onCaptchaChange}
        />
        <button onClick={handleClick}>Sign up</button>
        {err && <p>{err}</p>}
        <span>Already have an account? <br /><Link to='/login'>login!</Link></span>
      </form>
    </div>
  );
}

export default Register;
