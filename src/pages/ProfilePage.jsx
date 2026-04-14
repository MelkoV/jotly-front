import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAuthStore } from '../store/authStore'

function validateName(name) {
  return name.trim().length >= 2 ? '' : 'Use at least 2 characters.'
}

function validatePassword(payload) {
  const errors = {}
  if (!payload.currentPassword) errors.currentPassword = 'Enter your current password.'
  if (payload.newPassword.length < 8) errors.newPassword = 'Use at least 8 characters.'
  if (payload.confirmPassword !== payload.newPassword) {
    errors.confirmPassword = 'Passwords must match.'
  }
  return errors
}

export function ProfilePage() {
  useDocumentTitle('Профиль')

  const navigate = useNavigate()
  const {
    user,
    signOut,
    updateProfileName,
    changePassword,
    profileState,
    passwordState,
  } = useAuthStore()
  const currentUser = user ?? {
    name: 'Пользователь',
    email: '',
    avatar: null,
  }
  const currentUserAvatar =
    currentUser.avatar ??
    currentUser.avatar_url ??
    currentUser.avatarUrl ??
    currentUser.photo ??
    currentUser.image ??
    ''

  const [name, setName] = useState(currentUser.name)
  const [nameError, setNameError] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({})

  useEffect(() => {
    setName(currentUser.name)
  }, [currentUser.name])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const handleNameSubmit = async (event) => {
    event.preventDefault()
    const nextError = validateName(name)
    setNameError(nextError)
    if (nextError) return
    await updateProfileName({ name })
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validatePassword(passwordForm)
    setPasswordErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const result = await changePassword(passwordForm)
    if (result.ok) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  return (
    <PageSection
      eyebrow="Profile"
      title="Настройки аккаунта"
      description=""
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            className="surface-lift reveal-up"
            sx={{
              p: 3.5,
              height: '100%',
              background: 'linear-gradient(155deg, rgba(32, 101, 209, 0.1), rgba(255,255,255,0.82))',
            }}
          >
            <Stack spacing={2.5} alignItems="center">
              <Avatar
                src={currentUserAvatar || undefined}
                alt={currentUser.name}
                sx={{ width: 84, height: 84, bgcolor: 'primary.main', fontSize: 30 }}
              >
                {currentUser.name.slice(0, 1)}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3">{currentUser.name}</Typography>
                <Typography color="text.secondary">{currentUser.email}</Typography>
              </Box>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleSignOut}
                sx={{ width: '100%', maxWidth: 320 }}
              >
                Выйти
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Paper elevation={0} className="surface-lift reveal-up reveal-up-delay-1" sx={{ p: 3.5 }}>
              <Stack component="form" spacing={2.5} onSubmit={handleNameSubmit}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PersonRoundedIcon color="primary" />
                  <Typography variant="h3">Информация</Typography>
                </Stack>
                <TextField
                  label="Имя"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  error={Boolean(nameError)}
                  helperText={nameError}
                />
                {profileState.status === 'error' ? <Alert severity="error">{profileState.message}</Alert> : null}
                {profileState.status === 'success' ? <Alert severity="success">{profileState.message}</Alert> : null}
                <Button type="submit" variant="contained" disabled={profileState.status === 'loading'}>
                  {profileState.status === 'loading' ? 'Сохраняем...' : 'Сохранить'}
                </Button>
              </Stack>
            </Paper>

            <Paper elevation={0} className="surface-lift reveal-up reveal-up-delay-2" sx={{ p: 3.5 }}>
              <Stack component="form" spacing={2.5} onSubmit={handlePasswordSubmit}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <VpnKeyRoundedIcon color="primary" />
                  <Typography variant="h3">Смена пароля</Typography>
                </Stack>
                <TextField
                  label="Текущий пароль"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                  }
                  error={Boolean(passwordErrors.currentPassword)}
                  helperText={passwordErrors.currentPassword}
                />
                <TextField
                  label="Новый пароль"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                  }
                  error={Boolean(passwordErrors.newPassword)}
                  helperText={passwordErrors.newPassword}
                />
                <TextField
                  label="Еще раз новый пароль"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  error={Boolean(passwordErrors.confirmPassword)}
                  helperText={passwordErrors.confirmPassword}
                />
                {passwordState.status === 'error' ? <Alert severity="error">{passwordState.message}</Alert> : null}
                {passwordState.status === 'success' ? <Alert severity="success">{passwordState.message}</Alert> : null}
                <Button type="submit" variant="contained" disabled={passwordState.status === 'loading'}>
                  {passwordState.status === 'loading' ? 'Обновляем...' : 'Обновить пароль'}
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </PageSection>
  )
}
