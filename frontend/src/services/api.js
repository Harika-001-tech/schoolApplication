import axios from "axios";

const BASE_URL = "https://school-backend-5.onrender.com";

export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};
