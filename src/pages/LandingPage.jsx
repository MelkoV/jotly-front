import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'

const featureCards = [
  {
    title: 'Unified workspace',
    description:
      'Lists, priorities, ownership, and project context live inside one polished system instead of scattered tools.',
    icon: <LayersRoundedIcon color="primary" />,
  },
  {
    title: 'Clarity for every team',
    description:
      'Product, design, and operations can read progress instantly through calm visual hierarchy and clean status signals.',
    icon: <InsightsRoundedIcon color="primary" />,
  },
  {
    title: 'Confident control',
    description:
      'Jotly helps teams stay on top of delivery without turning the product into a dense admin dashboard.',
    icon: <ShieldRoundedIcon color="primary" />,
  },
]

const stats = [
  { value: '24%', label: 'less operational noise' },
  { value: '3.2x', label: 'faster project kickoff' },
  { value: '99%', label: 'first-screen clarity' },
]

const workflowCards = [
  {
    title: 'Plan',
    text: 'Collect campaign ideas, release tasks, and internal notes inside a structured workspace with room to think.',
  },
  {
    title: 'Execute',
    text: 'Track active work, owners, and status changes through a layout that feels lightweight but reliable.',
  },
  {
    title: 'Review',
    text: 'See which areas are moving, blocked, or complete before the team even needs another sync.',
  },
  {
    title: 'Archive',
    text: 'Keep high-value context from previous cycles so great ideas and decisions stay discoverable later.',
  },
]

const slides = [
  {
    title: 'Workspace overview',
    description: 'A calm command center for teams that need clarity without clutter.',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Focused collaboration',
    description: 'Clean product surfaces with enough visual structure to keep everyone aligned.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Modern planning flow',
    description: 'A placeholder visual for release planning, task curation, and fast cross-team review.',
    image:
      'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1600&q=80',
  },
]

export function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const handlePrev = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  return (
    <>
      <PageSection sx={{ pt: { xs: 4, md: 7 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3.5} className="reveal-up">
              <Chip
                icon={<AutoAwesomeRoundedIcon />}
                label="Modern SaaS direction inspired by Zone UI"
                color="primary"
                sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(32, 101, 209, 0.12)' }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.9rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.04em',
                  maxWidth: 520,
                }}
              >
                Jotly turns task management into a product people actually enjoy opening.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620 }}>
                Built with a cleaner SaaS rhythm across every page: spacious layouts, soft gradients, premium
                surfaces, and just enough signal to keep teams fast without feeling crowded.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  component={NavLink}
                  to="/sign-up"
                  variant="contained"
                  endIcon={<EastRoundedIcon />}
                >
                  Start for free
                </Button>
                <Button component={NavLink} to="/workspace" variant="outlined" color="inherit">
                  Open demo workspace
                </Button>
              </Stack>
              <Stack direction="row" spacing={2.5} useFlexGap flexWrap="wrap">
                {['Clean SaaS hierarchy', 'Fast team onboarding', 'Strong mobile readability'].map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center">
                    <CheckCircleRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative' }} className="reveal-up reveal-up-delay-1">
              <Paper
                elevation={0}
                className="surface-lift"
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 4,
                  background:
                    'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(244,248,255,0.9))',
                }}
              >
                <Box className="glass-grid" />
                <Stack spacing={2.5} sx={{ position: 'relative' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="overline" color="primary.main">
                        Workspace Overview
                      </Typography>
                      <Typography variant="h3">One calm dashboard for the whole team</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>J</Avatar>
                  </Stack>

                  <Grid container spacing={2}>
                    {stats.map((item) => (
                      <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
                        <Card
                          elevation={0}
                          className="surface-lift"
                          sx={{ height: '100%', bgcolor: 'rgba(255,255,255,0.72)' }}
                        >
                          <CardContent>
                            <Typography variant="h3">{item.value}</Typography>
                            <Typography color="text.secondary">{item.label}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      background:
                        'linear-gradient(135deg, rgba(32, 101, 209, 0.08), rgba(0, 167, 111, 0.08))',
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1">What the flow looks like in practice</Typography>
                      {[
                        'Plan launches, releases, and internal workflows in one place.',
                        'Track owners, timing, and status without visual overload.',
                        'Move between management, execution, and archive with zero friction.',
                      ].map((item) => (
                        <Stack key={item} direction="row" spacing={1.25} alignItems="center">
                          <CheckCircleRoundedIcon color="primary" fontSize="small" />
                          <Typography variant="body2">{item}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>

                  <Box className="status-meter">
                    <span>Draft queue stable</span>
                    <span>Review velocity up</span>
                    <span>Shipping rhythm healthy</span>
                  </Box>
                </Stack>
              </Paper>

              <Box
                className="hero-orb"
                sx={{
                  top: -24,
                  right: -18,
                  width: 120,
                  height: 120,
                  background: 'radial-gradient(circle, rgba(32, 101, 209, 0.24), transparent 66%)',
                }}
              />
              <Box
                className="hero-orb hero-orb-secondary"
                sx={{
                  bottom: -18,
                  left: -12,
                  width: 104,
                  height: 104,
                  background: 'radial-gradient(circle, rgba(0, 167, 111, 0.2), transparent 66%)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </PageSection>

      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={3.5} className="reveal-up reveal-up-delay-1">
            <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 999,
                  bgcolor: 'rgba(32, 101, 209, 0.08)',
                }}
              >
                Product gallery
              </Typography>
              <Typography variant="h2">A product slider adds a stronger visual accent without breaking the page grid.</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                For now this uses curated placeholder imagery, but the section is ready to be replaced with real product shots, mockups, or campaign visuals later.
              </Typography>
            </Stack>

            <Box sx={{ position: 'relative' }}>
              <Box sx={{ overflow: 'hidden', borderRadius: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    width: `${slides.length * 100}%`,
                    transform: `translateX(-${activeSlide * (100 / slides.length)}%)`,
                    transition: 'transform 520ms ease',
                  }}
                >
                  {slides.map((slide) => (
                    <Box key={slide.title} sx={{ width: `${100 / slides.length}%` }}>
                      <Box
                        sx={{
                          position: 'relative',
                          minHeight: { xs: 220, md: 340 },
                          borderRadius: 4,
                          overflow: 'hidden',
                          border: '1px solid rgba(145, 158, 171, 0.18)',
                          boxShadow: '0 24px 64px rgba(145, 158, 171, 0.18)',
                        }}
                      >
                        <Box
                          component="img"
                          src={slide.image}
                          alt={slide.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            minHeight: { xs: 220, md: 340 },
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(90deg, rgba(17, 25, 40, 0.72) 0%, rgba(17, 25, 40, 0.28) 44%, rgba(17, 25, 40, 0.1) 100%)',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'flex-end',
                            p: { xs: 3, md: 4 },
                          }}
                        >
                          <Stack spacing={1.25} sx={{ maxWidth: 420, color: '#fff' }}>
                            <Chip
                              label="Placeholder slide"
                              sx={{
                                alignSelf: 'flex-start',
                                bgcolor: 'rgba(255,255,255,0.16)',
                                color: '#fff',
                                borderRadius: 2,
                              }}
                            />
                            <Typography variant="h3" sx={{ color: '#fff', maxWidth: 420 }}>
                              {slide.title}
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.82)' }}>{slide.description}</Typography>
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 1.5, md: 2 },
                  pointerEvents: 'none',
                }}
              >
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    pointerEvents: 'auto',
                    bgcolor: 'rgba(255,255,255,0.86)',
                    borderRadius: 2.5,
                    '&:hover': { bgcolor: '#fff' },
                  }}
                  aria-label="Previous slide"
                >
                  <ChevronLeftRoundedIcon />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    pointerEvents: 'auto',
                    bgcolor: 'rgba(255,255,255,0.86)',
                    borderRadius: 2.5,
                    '&:hover': { bgcolor: '#fff' },
                  }}
                  aria-label="Next slide"
                >
                  <ChevronRightRoundedIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {slides.map((slide, index) => (
                  <Box
                    key={slide.title}
                    onClick={() => setActiveSlide(index)}
                    sx={{
                      width: index === activeSlide ? 36 : 10,
                      height: 10,
                      borderRadius: 999,
                      bgcolor: index === activeSlide ? 'primary.main' : 'rgba(145, 158, 171, 0.34)',
                      transition: 'all 180ms ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <PageSection
        eyebrow="What teams get"
        title="A cleaner interface that looks like a mature SaaS product and still stays practical"
        description="The design direction keeps the product intentional: soft light surfaces, expressive hierarchy, restrained color, and crisp calls to action."
      >
        <Grid container spacing={3}>
          {featureCards.map((feature, index) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                className={`surface-lift reveal-up reveal-up-delay-${Math.min(index + 1, 3)}`}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 4,
                        bgcolor: 'rgba(32, 101, 209, 0.08)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h3">{feature.title}</Typography>
                    <Typography color="text.secondary">{feature.description}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        eyebrow="From idea to delivery"
        title="Every view now fits inside one coherent product story"
        description="The experience no longer feels like isolated screens. It behaves like one platform with consistent spacing, surfaces, and visual logic."
        sx={{ pt: 0 }}
      >
        <Grid container spacing={3}>
          {workflowCards.map((item, index) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                className={`surface-lift reveal-up reveal-up-delay-${Math.min(index + 1, 3)}`}
                sx={{ p: 3.5, borderRadius: 4, height: '100%' }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="h3">{item.title}</Typography>
                  <Typography color="text.secondary">{item.text}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </PageSection>

      <PageSection sx={{ pt: 0 }}>
        <Paper
          elevation={0}
          className="surface-lift reveal-up reveal-up-delay-2"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(32, 101, 209, 0.1), rgba(0, 167, 111, 0.08))',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={1.5}>
                <Chip
                  icon={<SpeedRoundedIcon />}
                  label="Ready for the next pass"
                  color="primary"
                  sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.58)' }}
                />
                <Typography variant="h2">The visual foundation is ready to scale into deeper product flows.</Typography>
                <Typography color="text.secondary">
                  This gives us a strong base for future views like board mode, analytics, settings modules, and richer content workflows.
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Button component={NavLink} to="/sign-up" variant="contained" endIcon={<EastRoundedIcon />}>
                  Create account
                </Button>
                <Button component={NavLink} to="/profile" variant="outlined" color="inherit">
                  Explore profile
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </PageSection>
    </>
  )
}
