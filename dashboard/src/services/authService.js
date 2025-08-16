import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

export const authService = {
  
  login: async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("adminToken", res.data.token);
    return res.data;
  },
  register: async (username, email, password) => {
    const res = await axios.post(`${API_URL}/register`, { username, email, password });
    return res.data;
  },

  getToken: () => localStorage.getItem("adminToken"),

  logout: () => localStorage.removeItem("adminToken"),
};
