import axios from 'axios';

const API_URL = 'http://localhost:3000/wallets';

export const createWallet = async (walletData) => {
  try {
    const response = await axios.post(API_URL, walletData);
    return response.data;
  } catch (error) {
    console.error("There was an error creating the wallet:", error);
    throw error;
  }
};

export const getWallets = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the wallets:", error);
    throw error;
  }
};

export const updateWallet = async (id, walletData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, walletData);
    return response.data;
  } catch (error) {
    console.error("There was an error updating the wallet:", error);
    throw error;
  }
};

export const deleteWallet = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("There was an error deleting the wallet:", error);
    throw error;
  }
};
