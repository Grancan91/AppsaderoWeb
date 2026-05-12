import axios from "axios";

const baseURL = process.env.API_URL;

const api = axios.create({
  baseURL,
  timeout: 1000
});

export default api;
