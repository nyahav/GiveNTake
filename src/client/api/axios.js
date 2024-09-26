import axios from 'axios'

const forwardedBaseUrl = import.meta.env.VITE_FORWARDED_ADDRESS
export const BASE_URL = forwardedBaseUrl ? forwardedBaseUrl : import.meta.env.VITE_BASE_URL
const API_VERSION = import.meta.env.VITE_API_VERSION
export const API_URL = `${BASE_URL}/api/v${API_VERSION}`

export default axios.create({
  baseURL: API_URL
})

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})
