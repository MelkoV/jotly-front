import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded'
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'

export function NotFoundPage() {
  return (
    <PageSection
      eyebrow="404"
      title="This page slipped outside the workspace"
      description="The address is valid as a URL, but there is no screen here yet. Use one of the main routes below to get back into the product flow."
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
                <Typography variant="h3">Nothing is mapped to this route</Typography>
                <Typography color="text.secondary">
                  If you refreshed an old link or typed the address manually, the quickest recovery is to return to the main screens below.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                <Chip label="Unknown route" color="primary" />
                <Chip label="Safe fallback" />
                <Chip label="No data lost" />
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
              <Typography variant="h3">Choose where to go next</Typography>
              <Typography color="text.secondary">
                The app is working, only this specific page is missing.
              </Typography>

              <Button component={NavLink} to="/" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>
                Go to home
              </Button>
              <Button component={NavLink} to="/workspace" variant="outlined" color="inherit">
                Open workspace
              </Button>
              <Button component={NavLink} to="/contact" variant="text" color="inherit">
                Contact page
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </PageSection>
  )
}
