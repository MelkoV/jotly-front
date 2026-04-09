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
import { NavLink, useNavigate } from 'react-router-dom'
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
  const { signIn, signInState, resetSignInState } = useAuthStore()
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
      navigate('/workspace', { replace: true })
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
      title="Sign in now feels like part of the product, not a detached utility screen"
      description="The login flow uses the same polished visual language as the rest of Jotly, with clearer hierarchy and calmer feedback states."
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
              <Typography variant="h3">Fast entry, calm hierarchy, premium product feel</Typography>
              <Typography color="text.secondary">
                The auth pages now inherit the same SaaS presentation as landing and workspace views, so the whole journey feels intentional.
              </Typography>
              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                <Chip icon={<AutoAwesomeRoundedIcon />} label="Soft glass surfaces" color="primary" />
                <Chip label="Better feedback states" />
                <Chip label="Mobile-friendly layout" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Authentication now works against the live API contract, including token refresh and silent session restore.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <Paper elevation={0} className="surface-lift reveal-up reveal-up-delay-1" sx={{ width: 'min(580px, 100%)', p: { xs: 3, md: 4 } }}>
              <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <Typography variant="h3">Welcome back</Typography>
                  <Typography color="text.secondary">
                    Sign in with your account to restore access to the workspace and keep the session active in the background.
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
                  label="Password"
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
                  {signInState.status === 'loading' ? 'Signing in...' : 'Sign in'}
                </Button>

                <Typography color="text.secondary">
                  Need an account?{' '}
                  <Box component={NavLink} to="/sign-up" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Create one
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
