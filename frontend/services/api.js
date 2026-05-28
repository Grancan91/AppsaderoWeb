import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true, // Allow Cookies for cross-origin requests
})

export default api
