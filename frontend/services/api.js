import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

console.log(baseURL)
const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // Allow Cookies for cross-origin requests
});

export default api;
