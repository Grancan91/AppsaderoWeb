import axios from "axios";

const baseURL = process.env.API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  timeout: 1000
});

export default api;
