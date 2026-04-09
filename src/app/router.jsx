import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import { LandingPage } from '../pages/LandingPage'
import { ListPage } from '../pages/ListPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ContactPage } from '../pages/ContactPage'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'
import { NotFoundPage } from '../pages/NotFoundPage'

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
      { index: true, element: <LandingPage /> },
      { path: 'contact', element: <ContactPage /> },
      {
        element: <GuestOnlyRoute />,
        children: [
          { path: 'sign-in', element: <SignInPage /> },
          { path: 'sign-up', element: <SignUpPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'workspace', element: <ListPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
