import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const guestNavigationLinks = [
  { label: 'Главная', to: '/' },
]

const authenticatedNavigationLinks = [
  { label: 'Главная', to: '/' },
  { label: 'Списки', to: '/workspace' },
  { label: 'Профиль', to: '/profile' },
]

const guestAuthLinks = [
  { label: 'Вход', to: '/sign-in', variant: 'text' },
  { label: 'Регистрация', to: '/sign-up', variant: 'contained' },
]

function NavButton({ label, to, onClick, variant = 'text' }) {
  const location = useLocation()
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <Button
      component={NavLink}
      to={to}
      onClick={onClick}
      variant={variant}
      color={variant === 'contained' ? 'primary' : 'inherit'}
      sx={{
        px: 2.25,
        borderRadius: variant === 'contained' ? 2 : 2.5,
        color: variant === 'contained' ? 'primary.contrastText' : isActive ? 'primary.main' : 'text.primary',
        bgcolor:
          variant === 'text'
            ? isActive
              ? 'rgba(32, 101, 209, 0.1)'
              : 'transparent'
            : undefined,
      }}
    >
      {label}
    </Button>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function BootstrappingState() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'grid',
        placeItems: 'center',
        minHeight: 'calc(100vh - 82px - 89px)',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={40} thickness={4.2} />
        <Typography color="text.secondary">Загрузка...</Typography>
      </Stack>
    </Box>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuthStore()
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const navigationLinks = isAuthenticated ? authenticatedNavigationLinks : guestNavigationLinks
  const authLinks = isAuthenticated ? [] : guestAuthLinks

  const closeDrawer = () => setMobileOpen(false)

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ScrollToTop />

      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 12% 14%, rgba(32, 101, 209, 0.15), transparent 24%), radial-gradient(circle at 88% 18%, rgba(0, 167, 111, 0.14), transparent 20%), radial-gradient(circle at 50% 78%, rgba(140, 51, 255, 0.08), transparent 24%)',
        }}
      />

      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(145, 158, 171, 0.18)',
          backdropFilter: 'blur(18px)',
          bgcolor: 'rgba(248, 251, 255, 0.72)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 82, gap: 2 }}>
            <Stack
              component={NavLink}
              to="/"
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 46,
                  height: 46,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                <ChecklistRoundedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 800 }}>
                  Jotly
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Team productivity, designed clearly
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navigationLinks.map((link) => (
                <NavButton key={link.to} {...link} />
              ))}
            </Stack>

            {authLinks.length > 0 ? (
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
              >
                {authLinks.map((link) => (
                  <NavButton key={link.to} {...link} />
                ))}
              </Stack>
            ) : null}

            <IconButton
              edge="end"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              aria-label="Открыть меню"
            >
              <MenuRoundedIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={closeDrawer}>
        <Box sx={{ width: 320, p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6">Меню</Typography>
            <IconButton onClick={closeDrawer} aria-label="Закрыть меню">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Stack spacing={1}>
            {[...navigationLinks, ...authLinks].map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                onClick={closeDrawer}
                variant={location.pathname === link.to ? 'contained' : 'text'}
                color={location.pathname === link.to ? 'primary' : 'inherit'}
                sx={{ justifyContent: 'flex-start', borderRadius: 2.5, py: 1.25 }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: '82px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {isBootstrapping ? <BootstrappingState /> : <Outlet />}
        </Box>

        <Box
          component="footer"
          sx={{
            mt: 4,
            borderTop: '1px solid rgba(145, 158, 171, 0.18)',
            backgroundColor: 'rgba(248, 251, 255, 0.72)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <Container maxWidth="lg">
            <FooterContent year={currentYear} />
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

function FooterContent({ year }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      sx={{ py: 2.5 }}
    >
      <Typography color="text.secondary">{year} Jotly</Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
      >
        <Link href="#" underline="hover" color="text.secondary">
          Политика обработки данных
        </Link>
        <Link component={NavLink} to="/contact" underline="hover" color="text.secondary">
          Обратная связь
        </Link>
      </Stack>
    </Stack>
  )
}
