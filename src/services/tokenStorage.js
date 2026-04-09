const ACCESS_TOKEN_KEY = 'jotly.accessToken'
const DEVICE_ID_KEY = 'jotly.deviceId'

function getStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function createDeviceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `web-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export function getAccessToken() {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null
}

export function setAccessToken(token) {
  const storage = getStorage()
  if (!storage) return

  storage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  const storage = getStorage()
  if (!storage) return

  storage.removeItem(ACCESS_TOKEN_KEY)
}

export function getDeviceId() {
  const storage = getStorage()
  if (!storage) return createDeviceId()

  const storedDeviceId = storage.getItem(DEVICE_ID_KEY)
  if (storedDeviceId) return storedDeviceId

  const nextDeviceId = createDeviceId()
  storage.setItem(DEVICE_ID_KEY, nextDeviceId)
  return nextDeviceId
}
