import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
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
import { useState } from 'react'
import { PageSection } from '../components/common/PageSection'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { mapApiFieldErrors } from '../services/apiValidation'
import { createFeedbackRequest } from '../services/feedbackApi'

function validateForm(formData) {
  const errors = {}

  if (!formData.name.trim()) errors.name = 'Введите имя.'
  if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Введите корректный email.'
  if (!formData.message.trim()) errors.message = 'Введите сообщение.'

  return errors
}

export function ContactPage() {
  useDocumentTitle('Напишите нам')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitState, setSubmitState] = useState({
    status: 'idle',
    message: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState({ status: 'idle', message: '' })
      return
    }

    setSubmitState({ status: 'loading', message: '' })

    try {
      await createFeedbackRequest({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      })

      setSubmitState({
        status: 'success',
        message: 'Спасибо! Сообщение успешно отправлено.',
      })
      setFormData({
        name: '',
        email: '',
        message: '',
      })
      setErrors({})
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error?.response?.data?.message ?? error?.message ?? 'Не удалось отправить сообщение.',
      })
      setErrors(mapApiFieldErrors(error))
    }
  }

  return (
    <PageSection
      eyebrow="Feedback"
      title="Обратная связь"
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
                <SupportAgentRoundedIcon color="primary" />
              </Box>
              <Typography variant="h3">Расскажите о своих идеях</Typography>
              <Typography color="text.secondary">
                Мы будем рады любой обратной связи.
              </Typography>
              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                <Chip icon={<CampaignRoundedIcon />} label="Direct feedback" color="primary" />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <Paper
              elevation={0}
              className="surface-lift reveal-up reveal-up-delay-1"
              sx={{ width: 'min(580px, 100%)', p: { xs: 3, md: 4 } }}
            >
              <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <Typography variant="h3">Напишите нам</Typography>
                  <Typography color="text.secondary">
                    Мы обязательно прочитаем и ответим
                  </Typography>
                </Stack>

                <TextField
                  label="Имя"
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
                  label="Сообщение"
                  multiline
                  minRows={5}
                  value={formData.message}
                  onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                  error={Boolean(errors.message)}
                  helperText={errors.message}
                />

                {submitState.status === 'error' ? <Alert severity="error">{submitState.message}</Alert> : null}
                {submitState.status === 'success' ? <Alert severity="success">{submitState.message}</Alert> : null}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<MarkEmailUnreadRoundedIcon />}
                  disabled={submitState.status === 'loading'}
                >
                  {submitState.status === 'loading' ? 'Отправляем...' : 'Отправить сообщение'}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </PageSection>
  )
}
