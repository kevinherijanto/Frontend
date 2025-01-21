import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://backend-production-4e20.up.railway.app/login', { username });

      if (response.data.token) {
        // Save the token to localStorage
        localStorage.setItem('jwt', response.data.token);
        
        // Redirect to the main app
        history.push('/');  // Assuming '/home' is the main app route
      }
    } catch (err) {
      setErrorMessage('Failed to login. Please try again.');
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
