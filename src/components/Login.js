import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add logic to validate user credentials
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
      />
      <button
        onClick={handleLogin}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
