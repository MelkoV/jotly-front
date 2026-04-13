import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuthStore } from '../store/authStore'
import { LandingPage } from '../pages/LandingPage'
import { ListPage } from '../pages/ListPage'
import { ListDetailPage } from '../pages/ListDetailPage'
import { PublicListInfoPage } from '../pages/PublicListInfoPage'
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
      { path: 'j/:short_url', element: <PublicListInfoPage /> },
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
          { path: 'workspace/:id', element: <ListDetailPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
