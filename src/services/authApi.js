import { privateApi, refreshAccessToken, publicApi } from './apiClient'
import { getDeviceId, setAccessToken } from './tokenStorage'

function unwrapResponse(response) {
  return response.data
}

export async function signInRequest(payload) {
  const response = await publicApi.post('/api/v1/user/sign-in', {
    email: payload.email,
    password: payload.password,
    device: 'web',
    device_id: getDeviceId(),
  })

  const data = unwrapResponse(response)
  if (data?.token) setAccessToken(data.token)
  return data
}

export async function signUpRequest(payload) {
  const response = await publicApi.post('/api/v1/user/sign-up', {
    email: payload.email,
    password: payload.password,
    repeat_password: payload.repeatPassword,
    name: payload.name,
    device: 'web',
    device_id: getDeviceId(),
  })

  const data = unwrapResponse(response)
  if (data?.token) setAccessToken(data.token)
  return data
}

export async function fetchProfileRequest() {
  const response = await privateApi.get('/api/v1/user/profile')
  return unwrapResponse(response)
}

export async function refreshSessionRequest() {
  return refreshAccessToken()
}

export async function logoutRequest() {
  await privateApi.post('/api/v1/user/logout')
}
