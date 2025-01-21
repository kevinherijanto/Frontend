import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'https://backend-production-4e20.up.railway.app/login',
        { username },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.token) {
        localStorage.setItem('jwt', response.data.token);
        history('/');
      }
    } catch (err) {
      setErrorMessage('Failed to login. Please try again.');
      console.error('Error:', err.response ? err.response.data : err.message);
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
