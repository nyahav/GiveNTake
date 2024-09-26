import { VITE_FORWARDED_ADDRESS } from '../config.js'

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:3500',
  'http://localhost:3000',
  'https://giventake.onrender.com',
  VITE_FORWARDED_ADDRESS
]

export default allowedOrigins
