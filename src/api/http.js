import { useAuthStore } from '@/store/auth'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000
})

nprogress.configure({ 
  showSpinner: false, 
  easing: 'ease', 
  speed: 500 
});

/**
 * Request interceptor
 * - Attach token
 */
http.interceptors.request.use(
  config => {
    nprogress.start();
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

/**
 * Response interceptor
 * - Global error handling
 */

// Single-flight refresh: concurrent 401s share one refresh call
let refreshPromise = null

function refreshToken() {
  if (!refreshPromise) {
    refreshPromise = axios.post(`${http.defaults.baseURL}/refresh`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        const newToken = response.data?.access_token
        if (!newToken) throw new Error('No access token in refresh response')
        localStorage.setItem('token', newToken)
        return newToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

http.interceptors.response.use(
  res => {
    nprogress.done();
    return res.data;
  },
  async err => {
    const authStore = useAuthStore()
    const originalRequest = err.config
    const status = err.response?.status

    if(status === 401 && !originalRequest._retry && !['/login', '/register', '/verify-code', '/refresh'].includes(originalRequest.url)) {
      originalRequest._retry = true
      try {
        const newToken = await refreshToken()

        const store = useAuthStore()
        store.token = newToken

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return http(originalRequest)
      } catch (refreshError) {
        authStore.logout()
        return Promise.reject(refreshError)
      }
    }

    if (status === 403) {
      ElMessage.error('Permission denied')
    }
    return Promise.reject(err)
  }
)
export default http
