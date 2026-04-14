import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Не найдено')

  return (
    <PageSection
      eyebrow="404"
      title="Ууупс... Не найдено..."
      description="Возможно, Вам прислали неправильную ссылку. Или она устарела."
    >
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            className="surface-lift reveal-up"
            sx={{
              p: { xs: 3, md: 4 },
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(155deg, rgba(32, 101, 209, 0.1), rgba(0, 167, 111, 0.08))',
            }}
          >
            <Stack spacing={2.5}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.68)',
                }}
              >
                <SearchOffRoundedIcon color="primary" />
              </Box>

              <Stack spacing={1.25}>
                <Typography variant="h3">Нечего Вам показать</Typography>
                <Typography color="text.secondary">
                  По Вашему запросу мы не можем для Вас что-либо найти.
                </Typography>
              </Stack>

            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            className="surface-lift reveal-up reveal-up-delay-1"
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%' }}
          >
            <Stack spacing={2}>
              <Typography variant="overline" color="primary.main">
                Suggested routes
              </Typography>
              <Typography variant="h3">Что дальше?</Typography>
              <Typography color="text.secondary">

              </Typography>

              <Button component={NavLink} to="/" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>
                На главную
              </Button>
              <Button component={NavLink} to="/workspace" variant="outlined" color="inherit">
                К спискам
              </Button>
              <Button component={NavLink} to="/contact" variant="text" color="inherit">
                Написать нам
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </PageSection>
  )
}
