import axios from 'axios'
import { clearAccessToken, getAccessToken, setAccessToken } from './tokenStorage'

const API_BASE_URL = 'http://localhost:8080'
const REFRESH_PATH = '/api/v1/user/refresh-token'

let refreshPromise = null
let unauthorizedHandler = null

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
})

export const apiClient = publicApi

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
})

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = publicApi
      .post(REFRESH_PATH, null)
      .then((response) => {
        const nextToken = response.data?.token

        if (!nextToken) {
          throw new Error('Refresh token response does not contain an access token.')
        }

        setAccessToken(nextToken)
        return response.data
      })
      .catch((error) => {
        clearAccessToken()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

privateApi.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status === 401 && originalRequest?._retry) {
      clearAccessToken()
      unauthorizedHandler?.()
      return Promise.reject(error)
    }

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest.url?.includes(REFRESH_PATH)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const refreshData = await refreshAccessToken()

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${refreshData.token}`

      return privateApi(originalRequest)
    } catch (refreshError) {
      unauthorizedHandler?.()
      return Promise.reject(refreshError)
    }
  },
)
