import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'

function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuthStore()

  if (isBootstrapping) return null
  if (!isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}

function GuestOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useAuthStore()

  if (isBootstrapping) return null
  if (isAuthenticated) return <Navigate to="/workspace" replace />

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { LandingPage } = await import('../pages/LandingPage')
          return { Component: LandingPage }
        },
      },
      {
        path: 'j/:short_url',
        lazy: async () => {
          const { PublicListInfoPage } = await import('../pages/PublicListInfoPage')
          return { Component: PublicListInfoPage }
        },
      },
      {
        path: 'contact',
        lazy: async () => {
          const { ContactPage } = await import('../pages/ContactPage')
          return { Component: ContactPage }
        },
      },
      {
        element: <GuestOnlyRoute />,
        children: [
          {
            path: 'sign-in',
            lazy: async () => {
              const { SignInPage } = await import('../pages/SignInPage')
              return { Component: SignInPage }
            },
          },
          {
            path: 'sign-up',
            lazy: async () => {
              const { SignUpPage } = await import('../pages/SignUpPage')
              return { Component: SignUpPage }
            },
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'workspace',
            lazy: async () => {
              const { ListPage } = await import('../pages/ListPage')
              return { Component: ListPage }
            },
          },
          {
            path: 'workspace/:id',
            lazy: async () => {
              const { ListDetailPage } = await import('../pages/ListDetailPage')
              return { Component: ListDetailPage }
            },
          },
          {
            path: 'profile',
            lazy: async () => {
              const { ProfilePage } = await import('../pages/ProfilePage')
              return { Component: ProfilePage }
            },
          },
        ],
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('../pages/NotFoundPage')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
