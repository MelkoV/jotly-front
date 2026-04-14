import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
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
import shoppingIcon from '../assets/list-icons/list-type-shopping.svg'
import todoIcon from '../assets/list-icons/list-type-todo.svg'
import wishIcon from '../assets/list-icons/list-type-wish.svg'
import { PageSection } from '../components/common/PageSection'

const featureCards = [
  {
    title: 'TODO',
    description:
      'Списки дел с приоритетом, дедлайном',
    icon: todoIcon,
  },
  {
    title: 'Списки покупок',
    description:
      'С расчетом цены, стоимости и количества',
    icon: shoppingIcon,
  },
  {
    title: 'Списки желаний',
    description:
      'Отправь друзьям список желаний, чтобы они знали, что тебе подарить',
    icon: wishIcon,
  },
]

const stats = [
  { value: '24%', label: 'less operational noise' },
  { value: '3.2x', label: 'faster project kickoff' },
  { value: '99%', label: 'first-screen clarity' },
]

const workflowCards = [
  {
    title: 'Задача',
    text: 'Так приятно отметить задачу выполненной!',
  },
  {
    title: 'Покупка',
    text: 'Кончилась зубная паста? Сразу запиши, точно не забудешь!',
  },
  {
    title: 'Шаблоны',
    text: 'Есть часто повторяющиеся наборы? Создай шаблон!',
  },
  {
    title: 'Контроль',
    text: 'Jotly сам посчитает, кто сколько потратил при совместных покупках',
  },
]

const slides = [
  {
    title: 'Пространство',
    description: 'Организуйте комфортную работу с нужными списками',
    image:
      '/img/1.png',
  },
  {
    title: 'Сфокусируйтесь на главном',
    description: 'Всё важное теперь всегда под рукой',
    image:
      '/img/2.png',
  },
  {
    title: 'Работайте совместно',
    description: 'Делитесь списками для совместной работы',
    image:
      '/img/3.png',
  },
  {
    title: 'Ничего не потеряется',
    description: 'Записывайте каждую идею, чтобы потом к ней вернуться',
    image:
      '/img/4.png',
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
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={3.5} className="reveal-up reveal-up-delay-1">
            <Stack spacing={1.5} sx={{ maxWidth: 760 }}>

              <Typography variant="h2">Всё под рукой и под контролем.</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                Удобные инструменты работы со списками
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
        eyebrow="Работай в команде"
        title="Со списками можно одновременно работать командой"
        description="Делись списками с друзьями и родными, настраивай доступ и смотри, кто что выполнил"
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
                      <Box
                        component="img"
                        src={feature.icon}
                        alt={feature.title}
                        sx={{ width: 24, height: 24, display: 'block' }}
                      />
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
        eyebrow="От идеи до результата"
        title="Заноси в список каждую деталь"
        description="И тогда всё будет под контролем, а ты ничего не забудешь"
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

                <Typography variant="h2">Попробуй прямо сейчас</Typography>
                <Typography color="text.secondary">
                  Простая регистрация в два клика
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={1.5}>
                <Button component={NavLink} to="/sign-up" variant="contained" endIcon={<EastRoundedIcon />}>
                  Регистрация
                </Button>
                <Button component={NavLink} to="/sign-in" variant="outlined" color="inherit">
                  Уже есть учетная запись
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </PageSection>
    </>
  )
}
