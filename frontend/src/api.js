import axios from "axios";

const API_BASE_URL = "${process.env.BASE_URL}";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password, role) => {
  const response = await apiClient.post("/api/auth/login", { email, password, role });
  return response.data;
};

export const getTransactions = async (token) => {
  const response = await apiClient.get("/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTransaction = async (token, amount, type) => {
  const response = await apiClient.post(
    "/transactions",
    { amount, type },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getAllAccounts = async (token) => {
  const response = await apiClient.get("/accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAccountTransactions = async (token, userId) => {
  const response = await apiClient.get(`/accounts/${userId}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};