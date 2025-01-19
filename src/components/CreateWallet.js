import React, { useState } from 'react';
import axios from 'axios';

function CreateWallet({ username, onWalletCreated }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
  

  const handleCreateWallet = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }

    try {
      const walletData = {
        username: username,
        address: address,
        balance: parseFloat(balance),
        currency: currency,
      };

      const response = await axios.post('http://localhost:3000/wallets', walletData);
      onWalletCreated(response.data);
      setAddress('');
      setBalance('');
      setCurrency('');
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">Create New Wallet</h3>
      <form onSubmit={handleCreateWallet}>
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-700">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-700">Balance:</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-700">Currency:</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-lg">
          Create Wallet
        </button>
      </form>
    </div>
  );
}

export default CreateWallet;
