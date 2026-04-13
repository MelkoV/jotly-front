import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'
import { mapApiFieldErrors } from '../services/apiValidation'
import { useAuthStore } from '../store/authStore'

function validateForm(formData) {
  const errors = {}

  if (!formData.email.trim()) errors.email = 'Enter an email.'
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email.'

  if (!formData.password.trim()) errors.password = 'Enter a password.'
  else if (formData.password.length < 8) errors.password = 'Use at least 8 characters.'

  return errors
}

export function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInState, resetSignInState } = useAuthStore()
  const redirectTo = location.state?.redirectTo ?? '/workspace'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData({
      email: '',
      password: '',
    })
    setErrors({})
    resetSignInState()
  }, [resetSignInState])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const result = await signIn(formData)
    if (result.ok) {
      setErrors({})
      navigate(redirectTo, { replace: true })
      return
    }

    const apiErrors = mapApiFieldErrors(result.error)
    if (Object.keys(apiErrors).length > 0) {
      setErrors(apiErrors)
    }
  }

  return (
    <PageSection
      eyebrow="Authentication"
      title="Вход в аккаунт"
      description=""
    >
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            className="surface-lift reveal-up"
            sx={{
              p: { xs: 3, md: 4 },
              height: '100%',
              background: 'linear-gradient(155deg, rgba(32, 101, 209, 0.1), rgba(0, 167, 111, 0.08))',
            }}
          >
            <Stack spacing={2.5}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.66)',
                }}
              >
                <SecurityRoundedIcon color="primary" />
              </Box>
              <Typography variant="h3">Не передавайте данные третьим лицам</Typography>
              <Typography color="text.secondary">
                А то они смогут прочитать все Ваши списки.
              </Typography>

            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <Paper elevation={0} className="surface-lift reveal-up reveal-up-delay-1" sx={{ width: 'min(580px, 100%)', p: { xs: 3, md: 4 } }}>
              <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <Typography variant="h3">С возвращением</Typography>
                  <Typography color="text.secondary">
                    Мы скучали.
                  </Typography>
                </Stack>

                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
                <TextField
                  label="Пароль"
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, password: event.target.value }))
                  }
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />

                {signInState.status === 'error' ? <Alert severity="error">{signInState.message}</Alert> : null}
                {signInState.status === 'success' ? <Alert severity="success">{signInState.message}</Alert> : null}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={signInState.status === 'loading'}
                  endIcon={<LoginRoundedIcon />}
                >
                  {signInState.status === 'loading' ? 'Входим...' : 'Войти'}
                </Button>

                <Typography color="text.secondary">
                  Еще нет аккаунта?{' '}
                  <Box
                    component={NavLink}
                    to="/sign-up"
                    state={location.state}
                    sx={{ color: 'primary.main', fontWeight: 700 }}
                  >
                    Его легко создать
                  </Box>
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </PageSection>
  )
}
