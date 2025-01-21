import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from "axios";
import CreateWallet from "./components/CreateWallet";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [wallets, setWallets] = useState([]);
  const [newWallet, setNewWallet] = useState(null);
  const [editingWallet, setEditingWallet] = useState(null);
  const [showNewWallet, setShowNewWallet] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [isValidUsername, setIsValidUsername] = useState(false); // Add state for username validation

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      axios.get('https://backend-production-4e20.up.railway.app/protected/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setIsAuthenticated(true);
          setIsValidUsername(true);
          setUsername(response.data.username);  // Assuming backend sends the username
        })
        .catch(err => {
          setIsAuthenticated(false);
          setIsValidUsername(false);
          localStorage.removeItem('jwt');
        });
    }
  }, []);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const fetchWallets = useCallback(async () => {
    if (username.trim()) {
      try {
        const response = await axios.get(
          `https://backend-production-4e20.up.railway.app/wallets/username/${username}`
        );
        if (response.data.error) {
          setWallets([]);
        } else {
          setWallets(response.data);
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
        setWallets([]);
      }
    }
  }, [username]);

  const handleWalletCreated = (wallet) => {
    setNewWallet(wallet);
    setShowNewWallet(true);
    setTimeout(() => setShowNewWallet(false), 1000);
    fetchWallets();
  };

  const handleUpdateWallet = async (updatedWallet) => {
    try {
      await axios.put(
        `https://backend-production-4e20.up.railway.app/wallets/${updatedWallet.id}`,
        updatedWallet
      );
      setEditingWallet(null);
      fetchWallets();
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (window.confirm("Are you sure you want to delete this wallet?")) {
      try {
        await axios.delete(
          `https://backend-production-4e20.up.railway.app/wallets/${walletId}`
        );
        fetchWallets();
      } catch (error) {
        console.error("Error deleting wallet:", error);
      }
    }
  };

  // Fetch chat history from the backend
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('https://backend-production-4e20.up.railway.app/api/chat-history');
      setChatMessages(response.data); // Update chatMessages state with the data received
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
  
  // WebSocket Setup
  useEffect(() => {
    if (isValidUsername) { // Check if username is valid before connecting WebSocket
      const ws = new WebSocket("wss://backend-production-4e20.up.railway.app/ws");
  
      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({ type: "join", username }));
      };
  
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
  
        // If message is an array, it's chat history
        if (Array.isArray(message)) {
          setChatMessages(message); // Set initial chat history
        } else {
          setChatMessages((prev) => [...prev, message]); // Append new message
        }
      };
  
      ws.onerror = (error) => console.error("WebSocket error:", error);
      ws.onclose = () => console.log("WebSocket disconnected");
  
      setSocket(ws);
  
      return () => {
        ws.close();
      };
    }
  }, [username, isValidUsername]);
  
  const sendMessage = () => {
    if (socket && messageInput.trim()) {
      socket.send(JSON.stringify({ username, message: messageInput }));
      setMessageInput("");
    }
  };

  useEffect(() => {
    if (username.trim()) fetchWallets();
  }, [username, fetchWallets]);

  return (
    <Router>
      <Routes>
        {/* Route for the Login page */}
        <Route exact path="/login" component={Login} />
  
        {/* Protected Route for the Main App */}
        <Route exact path="/">
          {isAuthenticated ? (
            <div className="min-h-screen bg-gray-100 py-8 px-4">
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
                  My Private Crypto Wallet Tracker
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
                <CreateWallet username={username} onWalletCreated={handleWalletCreated} />
  
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
                              onClick={() => setEditingWallet(wallet)}
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
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg"
                      >
                        Update Wallet
                      </button>
                    </form>
                  </div>
                )}
  
                {/* Chat Section */}
                {isValidUsername && (
                  <div className="mt-8">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Chat Room</h2>
                      <div className="space-y-2">
                        {chatMessages
                          .filter((msg) => msg.message.trim() !== "")
                          .map((msg, index) => (
                            <div key={index} className="p-2 bg-gray-100 rounded-md shadow-sm">
                              <p>
                                <strong>{msg.username}:</strong> {msg.message}
                              </p>
                            </div>
                          ))}
                      </div>
                      <div className="mt-4">
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          rows="3"
                          placeholder="Type a message..."
                        />
                        <button
                          onClick={sendMessage}
                          className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-lg"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={fetchChatHistory}
                      className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg"
                    >
                      Fetch Chat History
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )}
        </Route>
  
        {/* Redirect if user tries to access an unknown route */}
        <Navigate to="/login" />
      </Routes>
    </Router>
  );
  
}

export default App;
