import axios from 'axios'

const API_BASE_URL = window.location.origin + '/api'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neoguard_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('neoguard_token')
      localStorage.removeItem('neoguard_user')
      localStorage.removeItem('neoguard_role')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default client
