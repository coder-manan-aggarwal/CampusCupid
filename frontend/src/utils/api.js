import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({
  baseURL: `${backendURL}/api`,
});

// Attach token if exists (later when we add JWT)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
