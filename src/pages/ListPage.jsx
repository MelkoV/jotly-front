import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageSection } from '../components/common/PageSection'
import templateIcon from '../assets/list-icons/list-kind-template.svg'
import regularIcon from '../assets/list-icons/list-kind-regular.svg'
import shoppingIcon from '../assets/list-icons/list-type-shopping.svg'
import todoIcon from '../assets/list-icons/list-type-todo.svg'
import wishIcon from '../assets/list-icons/list-type-wish.svg'
import { mapApiFieldErrors } from '../services/apiValidation'
import { useListStore } from '../store/listStore'

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const listTypeMeta = {
  shopping: {
    label: 'Список покупок',
    icon: shoppingIcon,
  },
  todo: {
    label: 'Список дел',
    icon: todoIcon,
  },
  wish: {
    label: 'Список желаний',
    icon: wishIcon,
  },
  wishlist: {
    label: 'Список желаний',
    icon: wishIcon,
  },
}

const listKindMeta = {
  template: {
    label: 'Шаблон',
    description: 'В шаблоне нельзя отмечать элементы выполненными, но на его основе можно создавать новые списки',
    icon: templateIcon,
  },
  regular: {
    label: 'Рабочая таблица',
    description: 'Обычный рабочий список для повседневного использования и совместной работы',
    icon: regularIcon,
  },
}

const listFiltersStorageKey = 'jotly.workspace.filters'

function readSavedFilters() {
  if (typeof window === 'undefined') {
    return {
      name: '',
      type: null,
      isTemplate: null,
    }
  }

  try {
    const rawValue = window.sessionStorage.getItem(listFiltersStorageKey)

    if (!rawValue) {
      return {
        name: '',
        type: null,
        isTemplate: null,
      }
    }

    const parsedValue = JSON.parse(rawValue)

    return {
      name: typeof parsedValue?.name === 'string' ? parsedValue.name : '',
      type: typeof parsedValue?.type === 'string' ? parsedValue.type : null,
      isTemplate:
        typeof parsedValue?.isTemplate === 'boolean' ? parsedValue.isTemplate : null,
    }
  } catch {
    return {
      name: '',
      type: null,
      isTemplate: null,
    }
  }
}

function buildApiFilters(filters) {
  return {
    ...(filters.name.trim() ? { text: filters.name.trim() } : {}),
    ...(filters.type
      ? { type: filters.type === 'wish' ? 'wishlist' : filters.type }
      : {}),
    ...(filters.isTemplate === true
      ? { template: 'template' }
      : filters.isTemplate === false
        ? { template: 'worksheet' }
        : {}),
  }
}

const initialFormData = {
  name: '',
  description: '',
  type: 'todo',
  isTemplate: false,
}

function validateCreateForm(formData) {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = 'Введите название списка.'
  }

  if (!formData.type) {
    errors.type = 'Выберите тип списка.'
  }

  return errors
}

export function ListPage() {
  const {
    items,
    status,
    message,
    pagination,
    fetchItems,
    cancelFetchItems,
    createItem,
    createState,
    resetCreateState,
  } = useListStore()
  const navigate = useNavigate()
  const [filters, setFilters] = useState(() => readSavedFilters())
  const [searchText, setSearchText] = useState(() => readSavedFilters().name)
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    void fetchItems({
      page,
      filters: buildApiFilters(filters),
    })
  }, [fetchItems, filters, page])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters((prev) => {
        if (prev.name === searchText) {
          return prev
        }

        return { ...prev, name: searchText }
      })
      setPage(1)
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [searchText])

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.sessionStorage.setItem(listFiltersStorageKey, JSON.stringify(filters))
  }, [filters])

  useEffect(() => () => {
    cancelFetchItems()
  }, [cancelFetchItems])

  const openCreateDialog = () => {
    setFormData(initialFormData)
    setFormErrors({})
    resetCreateState()
    setIsCreateDialogOpen(true)
  }

  const closeCreateDialog = () => {
    if (createState.status === 'loading') return

    setIsCreateDialogOpen(false)
    setFormData(initialFormData)
    setFormErrors({})
    resetCreateState()
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateCreateForm(formData)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const result = await createItem({
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type,
      isTemplate: formData.isTemplate,
    })

    if (result.ok) {
      if (page === 1) {
        await fetchItems({
          page: 1,
          filters: buildApiFilters(filters),
        })
      } else {
        setPage(1)
      }
      closeCreateDialog()
      return
    }

    const apiErrors = mapApiFieldErrors(result.error, {
      is_template: 'isTemplate',
    })

    if (Object.keys(apiErrors).length > 0) {
      setFormErrors(apiErrors)
    }
  }

  return (
    <PageSection
      eyebrow="Workspace"
    >

      <Paper
        elevation={0}
        className="reveal-up reveal-up-delay-2"
        sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2 }}
      >
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Typography variant="h3">Доступные списки</Typography>
              <Typography color="text.secondary">
                Создавайте списки на все случаи жизни, делитесь с родными и друзьями для совметной работы
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateDialog}>
                Создать
              </Button>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.5}
            useFlexGap
            sx={{ alignItems: { xs: 'stretch', lg: 'center' } }}
          >
            <ToggleButtonGroup
              exclusive
              value={filters.type}
              onChange={(_, nextValue) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, type: nextValue }))
              }}
              size="small"
              color="primary"
              sx={{
                flexWrap: 'nowrap',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                '& .MuiToggleButton-root': {
                  px: 1.75,
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <ToggleButton value={null}>Все</ToggleButton>
              <ToggleButton value="shopping">Покупки</ToggleButton>
              <ToggleButton value="todo">Дела</ToggleButton>
              <ToggleButton value="wish">Желания</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              exclusive
              value={filters.isTemplate}
              onChange={(_, nextValue) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, isTemplate: nextValue }))
              }}
              size="small"
              color="primary"
              sx={{
                flexWrap: 'nowrap',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                '& .MuiToggleButton-root': {
                  px: 1.75,
                  whiteSpace: 'nowrap',
                },
              }}
            >
              <ToggleButton value={null}>Все</ToggleButton>
              <ToggleButton value>Шаблоны</ToggleButton>
              <ToggleButton value={false}>Обычные</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              size="small"
              placeholder="Поиск"
              autoComplete="off"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value)
              }}
              inputProps={{ 'aria-label': 'Поиск' }}
              slotProps={{
                input: {
                  endAdornment: searchText ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        aria-label="Очистить поиск"
                        onClick={() => {
                          setSearchText('')
                        }}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                minWidth: { xs: '100%', lg: 280 },
                flex: { xs: '0 0 auto', lg: '1 1 320px' },
                ml: { lg: 'auto' },
              }}
            />
          </Stack>

          {status === 'error' ? <Alert severity="error">{message}</Alert> : null}

          <TableContainer
            sx={{
              overflowX: { xs: 'visible', sm: 'auto' },
              borderRadius: 1,
              border: '1px solid rgba(145, 158, 171, 0.14)',
            }}
          >
            <Table sx={{ minWidth: { xs: '100%', sm: 720 }, tableLayout: { xs: 'auto', sm: 'fixed' } }}>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        px: { xs: 1.5, sm: 2 },
                        py: 5,
                        textAlign: 'center',
                        color: 'text.secondary',
                        borderBottom: 'none',
                      }}
                    >
                      Пока нет подходящих списков. Вы можете создать новый список.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      onClick={() => navigate(`/workspace/${item.id}`)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 180ms ease',
                        '&:hover': { backgroundColor: 'rgba(32, 101, 209, 0.04)' },
                        '&:last-child td': { borderBottom: 'none' },
                      }}
                    >
                      <TableCell sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 2 } }}>
                        <Stack
                          direction="row"
                          spacing={{ xs: 1.25, sm: 1.5 }}
                          alignItems={item.description ? 'flex-start' : 'center'}
                          sx={{ width: '100%' }}
                        >
                          <Tooltip title={item.author}>
                            <Avatar
                              src={item.avatar ?? undefined}
                              alt={item.author}
                              sx={{
                                width: { xs: 34, sm: 40 },
                                height: { xs: 34, sm: 40 },
                                bgcolor: 'rgba(32, 101, 209, 0.12)',
                                color: 'primary.main',
                                fontSize: { xs: '0.78rem', sm: '0.9rem' },
                                fontWeight: 800,
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(item.author)}
                            </Avatar>
                          </Tooltip>
                          <Stack
                            spacing={item.description ? 0.55 : 0}
                            justifyContent={item.description ? 'flex-start' : 'center'}
                            sx={{ minWidth: 0, flex: 1, width: '100%' }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                whiteSpace: 'normal',
                                overflowWrap: 'anywhere',
                                wordBreak: 'break-word',
                                hyphens: 'auto',
                                lineHeight: 1.35,
                              }}
                            >
                              {item.title}
                            </Typography>
                            {item.description ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  whiteSpace: 'normal',
                                  overflowWrap: 'anywhere',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.4,
                                }}
                              >
                                {item.description}
                              </Typography>
                            ) : null}
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ display: { xs: 'flex', sm: 'none' }, pt: 0.25 }}
                            >
                              <Tooltip title={listTypeMeta[item.type]?.label ?? 'Тип списка'}>
                                <Box
                                  component="img"
                                  src={listTypeMeta[item.type]?.icon ?? todoIcon}
                                  alt={listTypeMeta[item.type]?.label ?? 'Тип списка'}
                                  sx={{ width: 22, height: 22, flexShrink: 0 }}
                                />
                              </Tooltip>
                              <Tooltip
                                title={
                                  item.isTemplate
                                    ? listKindMeta.template.description
                                    : listKindMeta.regular.description
                                }
                              >
                                <Box
                                  component="img"
                                  src={item.isTemplate ? templateIcon : regularIcon}
                                  alt={item.isTemplate ? listKindMeta.template.label : listKindMeta.regular.label}
                                  sx={{ width: 22, height: 22, flexShrink: 0 }}
                                />
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ width: 92, display: { xs: 'none', sm: 'table-cell' }, px: 2 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title={listTypeMeta[item.type]?.label ?? 'Тип списка'}>
                            <Box
                              component="img"
                              src={listTypeMeta[item.type]?.icon ?? todoIcon}
                              alt={listTypeMeta[item.type]?.label ?? 'Тип списка'}
                              sx={{ width: 24, height: 24 }}
                            />
                          </Tooltip>
                          <Tooltip
                            title={
                              item.isTemplate
                                ? listKindMeta.template.description
                                : listKindMeta.regular.description
                            }
                          >
                            <Box
                              component="img"
                              src={item.isTemplate ? templateIcon : regularIcon}
                              alt={item.isTemplate ? listKindMeta.template.label : listKindMeta.regular.label}
                              sx={{ width: 24, height: 24 }}
                            />
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Страница {pagination.page} из {pagination.pageCount}
            </Typography>
            <Pagination
              page={pagination.page}
              count={pagination.pageCount}
              color="primary"
              onChange={(_, nextPage) => {
                setPage(nextPage)
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      <Dialog
        open={isCreateDialogOpen}
        onClose={closeCreateDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: 'form',
          onSubmit: handleCreateSubmit,
          autoComplete: 'off',
          sx: { borderRadius: 1.5 },
        }}
      >
        <DialogTitle>Новый список</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Название"
              autoComplete="off"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              autoFocus
            />

            <TextField
              label="Описание"
              autoComplete="off"
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              error={Boolean(formErrors.description)}
              helperText={formErrors.description}
              multiline
              minRows={3}
            />

            <Stack spacing={1}>
              <Typography variant="subtitle1">Тип</Typography>
              <ToggleButtonGroup
                exclusive
                value={formData.type}
                onChange={(_, nextValue) => {
                  if (!nextValue) return

                  setFormData((prev) => ({ ...prev, type: nextValue }))
                  setFormErrors((prev) => ({ ...prev, type: '' }))
                }}
                color="primary"
                sx={{
                  flexWrap: 'wrap',
                  gap: 1,
                  '& .MuiToggleButton-root': {
                    borderRadius: 999,
                    px: 2,
                  },
                }}
              >
                <ToggleButton value="shopping">Покупки</ToggleButton>
                <ToggleButton value="todo">Дела</ToggleButton>
                <ToggleButton value="wish">Желания</ToggleButton>
              </ToggleButtonGroup>
              {formErrors.type ? (
                <Typography variant="body2" color="error">
                  {formErrors.type}
                </Typography>
              ) : null}
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={formData.isTemplate}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, isTemplate: event.target.checked }))
                    }
                  />
                }
                label="Это шаблон"
              />
              <Tooltip title="В шаблоне нельзя отмечать элементы выполненными, но на его основе можно создавать новые списки">
                <IconButton size="small" aria-label="Что такое шаблон?">
                  <HelpOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            {createState.status === 'error' ? <Alert severity="error">{createState.message}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeCreateDialog} color="inherit" disabled={createState.status === 'loading'}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={createState.status === 'loading'}>
            {createState.status === 'loading' ? 'Создаем...' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageSection>
  )
}
