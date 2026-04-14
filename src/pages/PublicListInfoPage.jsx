import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Alert, Avatar, Box, Button, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'
import { fetchPublicListInfoRequest, joinListRequest } from '../services/listsApi'
import { useAuthStore } from '../store/authStore'

function getErrorMessage(error, fallbackMessage = 'Не удалось загрузить информацию о списке.') {
  return error?.response?.data?.message ?? error?.message ?? fallbackMessage
}

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function normalizePublicListInfo(data) {
  if (!data || typeof data !== 'object') return null

  return {
    id: data.id ?? null,
    name: data.name ?? 'Список',
    description: data.description?.trim() ? data.description : null,
    ownerName: data.owner_name ?? 'Владелец не указан',
    ownerAvatar: data.owner_avatar ?? null,
  }
}

export function PublicListInfoPage() {
  const { short_url: shortUrl } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [listInfo, setListInfo] = useState(null)
  const [joinState, setJoinState] = useState('idle')

  useDocumentTitle(`Присоединиться к ${listInfo?.name ?? 'списку'}`)

  useEffect(() => {
    const abortController = new AbortController()

    const loadListInfo = async () => {
      setStatus('loading')
      setMessage('')

      try {
        const response = await fetchPublicListInfoRequest(shortUrl, {
          signal: abortController.signal,
        })
        setListInfo(normalizePublicListInfo(response))
        setStatus('success')
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return

        if (error?.response?.status === 404) {
          setStatus('not-found')
          setMessage('')
          return
        }

        setStatus('error')
        setMessage(getErrorMessage(error))
      }
    }

    if (shortUrl) {
      void loadListInfo()
    }

    return () => {
      abortController.abort()
    }
  }, [shortUrl])

  const handleOpenInJotly = async () => {
    if (!listInfo?.id) return

    if (!isAuthenticated) {
      navigate('/sign-in', {
        state: {
          redirectTo: location.pathname,
        },
      })
      return
    }

    setJoinState('loading')
    setMessage('')

    try {
      await joinListRequest(listInfo.id)
      navigate(`/workspace/${listInfo.id}`, { replace: true })
    } catch (error) {
      setJoinState('idle')
      setMessage(getErrorMessage(error, 'Не удалось открыть список в Jotly.'))
    }
  }

  if (status === 'not-found') {
    return <NotFoundPage />
  }

  return (
    <PageSection>
      <Stack spacing={2.5}>
        {status === 'error' ? <Alert severity="error">{message}</Alert> : null}

        <Paper
          elevation={0}
          className="surface-lift reveal-up"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(155deg, rgba(32, 101, 209, 0.08), rgba(0, 167, 111, 0.06))',
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={listInfo?.ownerAvatar ?? undefined}
                alt={listInfo?.ownerName ?? 'Владелец списка'}
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'rgba(32, 101, 209, 0.12)',
                  color: 'primary.main',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                }}
              >
                {getInitials(listInfo?.ownerName ?? 'Владелец')}
              </Avatar>

              <Box>
                <Typography variant="h3">{listInfo?.name ?? 'Список'}</Typography>
                <Typography color="text.secondary">{listInfo?.ownerName ?? 'Загружаем владельца...'}</Typography>
              </Box>
            </Stack>

            {listInfo?.description ? (
              <Typography color="text.secondary">{listInfo.description}</Typography>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={handleOpenInJotly}
                disabled={joinState === 'loading' || !listInfo?.id}
              >
                {joinState === 'loading' ? 'Открываем...' : 'Открыть в Jotly'}
              </Button>
              <Button component={NavLink} to="/" variant="outlined" color="inherit">
                На главную
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </PageSection>
  )
}
