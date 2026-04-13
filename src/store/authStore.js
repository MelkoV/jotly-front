import { create } from 'zustand'
import { setUnauthorizedHandler } from '../services/apiClient'
import {
  changePasswordRequest,
  fetchProfileRequest,
  logoutRequest,
  refreshSessionRequest,
  signInRequest,
  signUpRequest,
  updateProfileRequest,
} from '../services/authApi'
import { clearAccessToken, getAccessToken } from '../services/tokenStorage'

const initialFeedback = {
  status: 'idle',
  message: '',
}

let bootstrapPromise = null

function getErrorMessage(error, fallbackMessage = 'Something went wrong.') {
  return error?.response?.data?.message ?? error?.message ?? fallbackMessage
}

function mergeUserProfile(nextUser, currentUser) {
  if (!nextUser) return currentUser

  return {
    ...currentUser,
    ...nextUser,
    avatar:
      nextUser.avatar ??
      nextUser.avatar_url ??
      nextUser.avatarUrl ??
      nextUser.photo ??
      nextUser.image ??
      currentUser?.avatar ??
      currentUser?.avatar_url ??
      currentUser?.avatarUrl ??
      currentUser?.photo ??
      currentUser?.image ??
      null,
  }
}

function buildAuthenticatedState(user, token) {
  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getAccessToken(),
  isAuthenticated: false,
  isBootstrapping: true,
  signInState: initialFeedback,
  signUpState: initialFeedback,
  profileState: initialFeedback,
  passwordState: initialFeedback,
  resetSignInState: () => set({ signInState: initialFeedback }),
  resetSignUpState: () => set({ signUpState: initialFeedback }),
  clearAuth: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isBootstrapping: false,
      signInState: initialFeedback,
      signUpState: initialFeedback,
      profileState: initialFeedback,
      passwordState: initialFeedback,
    }),
  signIn: async (credentials) => {
    set({ signInState: { status: 'loading', message: '' } })
    try {
      const response = await signInRequest(credentials)
      set({
        ...buildAuthenticatedState(response.user, response.token),
        signInState: { status: 'success', message: 'Signed in successfully.' },
      })
      return { ok: true, data: response }
    } catch (error) {
      set({ signInState: { status: 'error', message: getErrorMessage(error) } })
      return { ok: false, error }
    }
  },
  signUp: async (payload) => {
    set({ signUpState: { status: 'loading', message: '' } })
    try {
      const response = await signUpRequest(payload)
      set({
        ...buildAuthenticatedState(response.user, response.token),
        signUpState: { status: 'success', message: 'Registration completed successfully.' },
      })
      return { ok: true, data: response }
    } catch (error) {
      set({ signUpState: { status: 'error', message: getErrorMessage(error) } })
      return { ok: false, error }
    }
  },
  signOut: async () => {
    try {
      await logoutRequest()
    } catch (error) {
      // Local sign-out still completes even if the backend session is already invalid.
    } finally {
      clearAccessToken()
      get().clearAuth()
    }
  },
  bootstrapAuth: async () => {
    if (bootstrapPromise) return bootstrapPromise

    bootstrapPromise = (async () => {
      set({ isBootstrapping: true })

      try {
        const localToken = getAccessToken()

        if (!localToken) {
          await refreshSessionRequest()
        }

        const profile = await fetchProfileRequest()

        set({
          ...buildAuthenticatedState(profile, getAccessToken()),
          isBootstrapping: false,
        })

        return { ok: true, data: profile }
      } catch (error) {
        clearAccessToken()
        get().clearAuth()
        return { ok: false, error }
      } finally {
        set({ isBootstrapping: false })
        bootstrapPromise = null
      }
    })()

    return bootstrapPromise
  },
  updateProfileName: async (payload) => {
    set({ profileState: { status: 'loading', message: '' } })
    try {
      const response = await updateProfileRequest(payload)
      set({
        user: mergeUserProfile(response, get().user),
        profileState: { status: 'success', message: 'Профиль обновлён.' },
      })
      return { ok: true }
    } catch (error) {
      set({ profileState: { status: 'error', message: getErrorMessage(error) } })
      return { ok: false, error }
    }
  },
  changePassword: async (payload) => {
    set({ passwordState: { status: 'loading', message: '' } })
    try {
      await changePasswordRequest(payload)
      set({ passwordState: { status: 'success', message: 'Пароль успешно изменён.' } })
      return { ok: true }
    } catch (error) {
      set({ passwordState: { status: 'error', message: getErrorMessage(error) } })
      return { ok: false, error }
    }
  },
}))

setUnauthorizedHandler(() => {
  useAuthStore.getState().clearAuth()
})
