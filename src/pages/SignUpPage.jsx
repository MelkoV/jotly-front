import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
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

  if (!formData.name.trim()) errors.name = 'Enter your name.'
  if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email.'
  if (formData.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (formData.repeatPassword !== formData.password) {
    errors.repeatPassword = 'Passwords must match.'
  }

  return errors
}

export function SignUpPage() {
  const navigate = useNavigate()
  const { signUp, signUpState, resetSignUpState } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
    })
    setErrors({})
    resetSignUpState()
  }, [resetSignUpState])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const result = await signUp(formData)
    if (result.ok) {
      setErrors({})
      navigate('/workspace', { replace: true })
      return
    }

    const apiErrors = mapApiFieldErrors(result.error, {
      repeat_password: 'repeatPassword',
    })

    if (Object.keys(apiErrors).length > 0) {
      setErrors(apiErrors)
    }
  }

  return (
    <PageSection
      eyebrow="Registration"
      title="The signup flow now has the same confidence and polish as the rest of the product"
      description="This page is designed to feel lighter, faster, and more intentional, with a cleaner onboarding moment for new users."
    >
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            className="surface-lift reveal-up"
            sx={{
              p: { xs: 3, md: 4 },
              height: '100%',
              background: 'linear-gradient(155deg, rgba(0, 167, 111, 0.1), rgba(32, 101, 209, 0.08))',
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
                <RocketLaunchRoundedIcon color="secondary" />
              </Box>
              <Typography variant="h3">Onboarding that looks product-grade from the first step</Typography>
              <Typography color="text.secondary">
                Instead of a generic utility form, signup now feels like part of a thoughtfully designed SaaS journey.
              </Typography>
              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                <Chip label="Short form" color="secondary" />
                <Chip label="Clear hierarchy" />
                <Chip label="Friendly validation" />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <Paper elevation={0} className="surface-lift reveal-up reveal-up-delay-1" sx={{ width: 'min(580px, 100%)', p: { xs: 3, md: 4 } }}>
              <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <Typography variant="h3">Create account</Typography>
                  <Typography color="text.secondary">
                    Set up a new workspace identity and move directly into the redesigned profile and list experience.
                  </Typography>
                </Stack>

                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
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
                <TextField
                  label="Confirm password"
                  type="password"
                  value={formData.repeatPassword}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, repeatPassword: event.target.value }))
                  }
                  error={Boolean(errors.repeatPassword)}
                  helperText={errors.repeatPassword}
                />

                {signUpState.status === 'error' ? <Alert severity="error">{signUpState.message}</Alert> : null}
                {signUpState.status === 'success' ? <Alert severity="success">{signUpState.message}</Alert> : null}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={signUpState.status === 'loading'}
                  endIcon={<PersonAddAltRoundedIcon />}
                >
                  {signUpState.status === 'loading' ? 'Creating account...' : 'Create account'}
                </Button>

                <Typography color="text.secondary">
                  Already have an account?{' '}
                  <Box component={NavLink} to="/sign-in" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Go to sign in
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
