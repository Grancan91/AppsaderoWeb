import axios, { AxiosInstance } from "axios";

const baseURL = process.env.API_URL || "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 1000
})

