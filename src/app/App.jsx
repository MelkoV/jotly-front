import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { router } from './router'

export function AppRouter() {
  useEffect(() => {
    void useAuthStore.getState().bootstrapAuth()
  }, [])

  return <RouterProvider router={router} />
}
