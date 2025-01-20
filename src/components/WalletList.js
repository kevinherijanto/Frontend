import React, { useState } from 'react';
import axios from 'axios';

const WalletList = ({ wallets, fetchWallets }) => {
  const [editingWallet, setEditingWallet] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    address: '',
    balance: '',
    currency: '',
  });

  // Handle edit action - Prefill data in form
  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setUpdatedData(wallet); // Prefill fields with current wallet data
  };

  // Handle wallet update
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!updatedData.address || !updatedData.balance || !updatedData.currency) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.put(`https://backend-production-4e20.up.railway.app/wallets/${editingWallet.id}`, updatedData);
      setEditingWallet(null); // Close edit form
      fetchWallets(); // Refresh wallet list
    } catch (error) {
      console.error("Error updating wallet:", error);
      alert("Failed to update the wallet. Please try again.");
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this wallet?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      await axios.delete(`https://backend-production-4e20.up.railway.app/wallets/${id}`);
      fetchWallets(); // Refresh wallet list
    } catch (error) {
      console.error("Error deleting wallet:", error);
      alert("Failed to delete the wallet. Please try again.");
    }
  };

  return (
    <div>
      <h2>Your Wallets</h2>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id} className="wallet-item">
            {editingWallet?.id === wallet.id ? (
              <form onSubmit={handleUpdate} className="edit-form">
                <input
                  type="text"
                  value={updatedData.address}
                  onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })}
                  placeholder="Wallet Address"
                />
                <input
                  type="number"
                  value={updatedData.balance}
                  onChange={(e) => setUpdatedData({ ...updatedData, balance: parseFloat(e.target.value) })}
                  placeholder="Balance"
                />
                <input
                  type="text"
                  value={updatedData.currency}
                  onChange={(e) => setUpdatedData({ ...updatedData, currency: e.target.value })}
                  placeholder="Currency"
                />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditingWallet(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <p><strong>Address:</strong> {wallet.address}</p>
                <p><strong>Balance:</strong> {wallet.balance}</p>
                <p><strong>Currency:</strong> {wallet.currency}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(wallet)}>Edit</button>
                  <button onClick={() => handleDelete(wallet.id)}>Delete</button> {/* Delete button added here */}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalletList;
