import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CreateWallet from './components/CreateWallet';

function App() {
  const [username, setUsername] = useState('');
  const [wallets, setWallets] = useState([]);
  const [newWallet, setNewWallet] = useState(null);
  const [showNewWallet, setShowNewWallet] = useState(false);
  const [socket, setSocket] = useState(null);
  const [editingWallet, setEditingWallet] = useState(null); // Initialize editingWallet state

  // Handle username change
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const fetchWallets = useCallback(async () => {
    if (username.trim()) {
      try {
        const response = await axios.get(
          `https://backend-production-4e20.up.railway.app/wallets/username/${username}`
        );
        console.log('Response:', response);  // Log the full response for debugging
        if (response.data.error) {
          setWallets([]);  // Empty wallets if no data found
        } else {
          setWallets(response.data);  // Otherwise, update with the wallet data
        }
      } catch (error) {
        console.error('Error fetching wallets:', error);
        setWallets([]);  // Clear wallets on error
      }
    }
  }, [username]);

  const handleUpdateWallet = async (updatedWallet) => {
    try {
      await axios.put(
        `https://backend-production-4e20.up.railway.app/wallets/${updatedWallet.id}`,
        updatedWallet
      );
      fetchWallets();
      setEditingWallet(null); // Reset editingWallet after updating
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await axios.delete(
          `https://backend-production-4e20.up.railway.app/wallets/${walletId}`
        );
        fetchWallets();
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  // WebSocket connection logic that only happens when required
  const startWebSocketConnection = () => {
    if (socket) return; // If WebSocket is already open, don't reconnect

    const newSocket = new WebSocket('wss://backend-production-4e20.up.railway.app:8081'); // Replace with your WebSocket server URL

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_wallet') {
          setNewWallet(data.wallet); // Set the new wallet data from WebSocket
          setShowNewWallet(true); // Show the popup when a new wallet is received from WebSocket
          setTimeout(() => setShowNewWallet(false), 5000); // Auto-hide popup after 5 seconds
          fetchWallets(); // Refresh the wallet list
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(newSocket); // Save the WebSocket connection in state
  };

  // Fetch wallets when username changes
  useEffect(() => {
    if (username.trim()) fetchWallets();
  }, [username, fetchWallets]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          My Private Crypto Wallet
        </h1>

        {/* Username input */}
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-700">
            Enter Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Wallet Creation Form */}
        <CreateWallet username={username} onWalletCreated={() => startWebSocketConnection()} />

        {/* New Wallet Notification */}
        {showNewWallet && newWallet && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-green-800">New Wallet Created:</h3>
            <p className="text-gray-700">
              <strong>Address:</strong> {newWallet.address}
            </p>
            <p className="text-gray-700">
              <strong>Balance:</strong> {newWallet.balance}
            </p>
            <p className="text-gray-700">
              <strong>Currency:</strong> {newWallet.currency}
            </p>
          </div>
        )}

        {/* Wallet List */}
        {wallets.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Wallets</h2>
            <ul className="space-y-4">
              {wallets.map((wallet) => (
                <li key={wallet.id} className="p-4 bg-gray-50 rounded-lg shadow-md">
                  <p className="text-gray-700">
                    <strong>Address:</strong> {wallet.address}
                  </p>
                  <p className="text-gray-700">
                    <strong>Balance:</strong> {wallet.balance}
                  </p>
                  <p className="text-gray-700">
                    <strong>Currency:</strong> {wallet.currency}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => setEditingWallet(wallet)} // Set the wallet to be edited
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit Wallet
                    </button>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete Wallet
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Edit Wallet Form */}
        {editingWallet && (
          <div className="mt-6 p-4 bg-yellow-100 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-yellow-800">Edit Wallet</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateWallet(editingWallet);
              }}
            >
              <input
                type="text"
                value={editingWallet.address}
                onChange={(e) =>
                  setEditingWallet({ ...editingWallet, address: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Wallet Address"
                required
              />
              <input
                type="number"
                value={editingWallet.balance}
                onChange={(e) =>
                  setEditingWallet({
                    ...editingWallet,
                    balance: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Balance"
                required
              />
              <input
                type="text"
                value={editingWallet.currency}
                onChange={(e) =>
                  setEditingWallet({ ...editingWallet, currency: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Currency"
                required
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded-lg mt-2"
              >
                Update Wallet
              </button>
              <button
                type="button"
                onClick={() => setEditingWallet(null)} // Reset editingWallet when canceling
                className="w-full p-2 bg-gray-300 text-gray-700 rounded-lg mt-2"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
