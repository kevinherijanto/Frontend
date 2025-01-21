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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Login</h2>
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        {errorMessage && (
          <p className="mt-4 text-sm text-center text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
