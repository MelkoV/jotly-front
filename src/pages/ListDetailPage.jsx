import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded'
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import templateIcon from '../assets/list-icons/list-kind-template.svg'
import regularIcon from '../assets/list-icons/list-kind-regular.svg'
import shoppingIcon from '../assets/list-icons/list-type-shopping.svg'
import todoIcon from '../assets/list-icons/list-type-todo.svg'
import wishIcon from '../assets/list-icons/list-type-wish.svg'
import { PageSection } from '../components/common/PageSection'
import { mapApiFieldErrors } from '../services/apiValidation'
import {
  copyListRequest,
  completeListItemRequest,
  createListItemRequest,
  createFromTemplateRequest,
  deleteListRequest,
  deleteListItemRequest,
  fetchListShareRequest,
  fetchListDeleteTypesRequest,
  fetchListDetailRequest,
  leaveListRequest,
  uncompleteListItemRequest,
  updateListRequest,
  updateListShareRequest,
  updateListItemRequest,
} from '../services/listsApi'
import { useAuthStore } from '../store/authStore'

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

const priorityLabelMap = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

const unitLabelMap = {
  thing: 'шт',
  package: 'уп',
  kg: 'кг',
}

const initialCreateFeedback = {
  status: 'idle',
  message: '',
}

const initialFormData = {
  name: '',
  description: '',
  isCompleted: false,
  priority: '',
  deadline: '',
  unit: '',
  price: '',
  cost: '',
  count: '',
}

const initialListFormData = {
  name: '',
  description: '',
}

const initialDeleteOptions = {
  left: false,
  delete: false,
}

const initialShareFormData = {
  isShareLink: false,
  shortUrl: '',
  canEdit: false,
}

const initialCloneFormData = {
  name: '',
}

function getErrorMessage(error, fallbackMessage = 'Не удалось загрузить список.') {
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

function normalizeListModel(model) {
  if (!model || typeof model !== 'object') return null

  return {
    id: model.id,
    ownerId: model.owner_id ?? null,
    name: model.name ?? 'Список',
    ownerName: model.owner_name ?? 'Без владельца',
    ownerAvatar: model.owner_avatar ?? null,
    type: model.type,
    isTemplate: Boolean(model.is_template),
    canEdit: Boolean(model.can_edit),
    description: model.description?.trim() ? model.description : null,
  }
}

function normalizeListItem(item) {
  const attributes = item?.attributes && typeof item.attributes === 'object' ? item.attributes : {}

  return {
    id: item?.id ?? `item-${Date.now()}`,
    name: item?.name ?? 'Без названия',
    description: item?.description?.trim() ? item.description : null,
    userName: item?.user_name ?? 'Не указан',
    userAvatar: item?.user_avatar ?? null,
    isCompleted: Boolean(item?.is_completed),
    version: item?.version ?? null,
    completedUserName: item?.completed_user_name ?? null,
    completedUserAvatar: item?.completed_user_avatar ?? null,
    priority: item?.priority ?? attributes.priority ?? null,
    deadline: item?.deadline ?? attributes.deadline ?? null,
    unit: item?.unit ?? attributes.unit ?? null,
    price: item?.price ?? attributes.price ?? null,
    cost: item?.cost ?? attributes.cost ?? null,
    count: item?.count ?? attributes.count ?? null,
  }
}

function normalizeListMember(member) {
  return {
    id: member?.id ?? `${member?.name ?? 'member'}-${member?.item_count ?? 0}-${member?.sum ?? 0}`,
    name: member?.name ?? 'Участник',
    avatar: member?.avatar ?? null,
    itemCount: member?.item_count ?? 0,
    sum: member?.sum ?? 0,
  }
}

function getItemMetaRows(item, listType) {
  if (listType === 'todo') {
    return [
      item.priority ? `Приоритет: ${priorityLabelMap[item.priority] ?? item.priority}` : null,
      item.deadline ? `Дедлайн: ${item.deadline}` : null,
    ].filter(Boolean)
  }

  if (listType === 'shopping') {
    return [
      item.unit ? `Единица: ${unitLabelMap[item.unit] ?? item.unit}` : null,
      item.price !== null && item.price !== undefined && item.price !== '' ? `Цена: ${item.price}` : null,
      item.cost !== null && item.cost !== undefined && item.cost !== '' ? `Стоимость: ${item.cost}` : null,
      item.count !== null && item.count !== undefined && item.count !== '' ? `Количество: ${item.count}` : null,
    ].filter(Boolean)
  }

  return []
}

function getPriorityChipColor(priority) {
  if (priority === 'high') return 'error'
  if (priority === 'medium') return 'warning'
  return 'primary'
}

function formatDeadline(deadline) {
  if (!deadline) return ''

  const parsedDate = new Date(deadline)
  if (Number.isNaN(parsedDate.getTime())) return deadline

  return new Intl.DateTimeFormat('ru-RU').format(parsedDate)
}

function normalizeDeadlineForInput(deadline) {
  if (!deadline) return ''

  if (typeof deadline === 'string') {
    const matchedDate = deadline.match(/^(\d{4}-\d{2}-\d{2})/)
    if (matchedDate) return matchedDate[1]
  }

  const parsedDate = new Date(deadline)
  if (Number.isNaN(parsedDate.getTime())) return ''

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function isToday(deadline) {
  if (!deadline) return false

  const parsedDate = new Date(deadline)
  if (Number.isNaN(parsedDate.getTime())) return false

  const today = new Date()

  return (
    parsedDate.getFullYear() === today.getFullYear() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getDate() === today.getDate()
  )
}

function getEmptyStateColSpan(listType) {
  if (listType === 'todo') return 4
  if (listType === 'shopping') return 5
  return 2
}

function parseDecimalValue(value) {
  if (value === '' || value === null || value === undefined) return null

  const normalizedValue = String(value).replace(',', '.')
  const parsedValue = Number(normalizedValue)

  return Number.isFinite(parsedValue) ? parsedValue : null
}

function formatDecimalValue(value) {
  if (!Number.isFinite(value)) return ''

  const roundedValue = Math.round(value * 1000) / 1000
  return Number.isInteger(roundedValue) ? String(roundedValue) : String(roundedValue)
}

function buildCreatePayload(listId, listType, formData) {
  const basePayload = {
    list_id: listId,
    name: formData.name.trim(),
    is_completed: Boolean(formData.isCompleted),
    ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
  }

  if (listType === 'todo') {
    return {
      ...basePayload,
      ...(formData.priority ? { priority: formData.priority } : {}),
      ...(formData.deadline ? { deadline: formData.deadline } : {}),
    }
  }

  if (listType === 'shopping') {
    return {
      ...basePayload,
      ...(formData.unit ? { unit: formData.unit } : {}),
      ...(formData.price !== '' ? { price: formData.price } : {}),
      ...(formData.cost !== '' ? { cost: formData.cost } : {}),
      ...(formData.count !== '' ? { count: formData.count } : {}),
    }
  }

  return basePayload
}

function buildUpdatePayload(itemVersion, listType, formData) {
  const basePayload = {
    version: itemVersion,
    name: formData.name.trim(),
    ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
  }

  if (listType === 'todo') {
    return {
      ...basePayload,
      ...(formData.priority ? { priority: formData.priority } : {}),
      ...(formData.deadline ? { deadline: formData.deadline } : {}),
    }
  }

  if (listType === 'shopping') {
    return {
      ...basePayload,
      ...(formData.unit ? { unit: formData.unit } : {}),
      ...(formData.price !== '' ? { price: formData.price } : {}),
      ...(formData.cost !== '' ? { cost: formData.cost } : {}),
      ...(formData.count !== '' ? { count: formData.count } : {}),
    }
  }

  return basePayload
}

function validateCreateForm(formData) {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = 'Введите название элемента.'
  }

  return errors
}

function validateListForm(formData) {
  const errors = {}

  if (!formData.name.trim()) {
    errors.name = 'Введите название списка.'
  }

  return errors
}

function getListIdFromResponse(response) {
  if (response?.id) return response.id
  if (response?.data?.id) return response.data.id
  if (response?.model?.id) return response.model.id
  return null
}

function normalizeShareFormData(data) {
  return {
    isShareLink: Boolean(data?.is_share_link),
    shortUrl: typeof data?.short_url === 'string' ? data.short_url : '',
    canEdit: Boolean(data?.can_edit),
  }
}

function buildPublicShareUrl(shortUrl) {
  if (!shortUrl) return ''

  if (typeof window === 'undefined') {
    return `/j/${shortUrl}`
  }

  return `${window.location.origin}/j/${shortUrl}`
}

export function ListDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUserId = useAuthStore((state) => state.user?.id ?? null)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [listModel, setListModel] = useState(null)
  const [items, setItems] = useState([])
  const [members, setMembers] = useState([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createState, setCreateState] = useState(initialCreateFeedback)
  const [formData, setFormData] = useState(initialFormData)
  const [formErrors, setFormErrors] = useState({})
  const [editingItemId, setEditingItemId] = useState(null)
  const [actionState, setActionState] = useState('idle')
  const [isEditListDialogOpen, setIsEditListDialogOpen] = useState(false)
  const [editListFormData, setEditListFormData] = useState(initialListFormData)
  const [editListFormErrors, setEditListFormErrors] = useState({})
  const [editListState, setEditListState] = useState(initialCreateFeedback)
  const [isDeleteListDialogOpen, setIsDeleteListDialogOpen] = useState(false)
  const [deleteListOptions, setDeleteListOptions] = useState(initialDeleteOptions)
  const [deleteListState, setDeleteListState] = useState(initialCreateFeedback)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareFormData, setShareFormData] = useState(initialShareFormData)
  const [shareFormErrors, setShareFormErrors] = useState({})
  const [shareState, setShareState] = useState(initialCreateFeedback)
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false)
  const [cloneMode, setCloneMode] = useState('copy')
  const [cloneFormData, setCloneFormData] = useState(initialCloneFormData)
  const [cloneFormErrors, setCloneFormErrors] = useState({})
  const [cloneState, setCloneState] = useState(initialCreateFeedback)

  const loadList = async (signal) => {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetchListDetailRequest(id, { signal })
      setListModel(normalizeListModel(response?.model))
      setItems(Array.isArray(response?.items) ? response.items.map(normalizeListItem) : [])
      setMembers(Array.isArray(response?.members) ? response.members.map(normalizeListMember) : [])
      setStatus('success')
      return response
    } catch (error) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return null

      setStatus('error')
      setMessage(getErrorMessage(error))
      throw error
    }
  }

  useEffect(() => {
    const abortController = new AbortController()

    if (id) {
      void loadList(abortController.signal)
    }

    return () => {
      abortController.abort()
    }
  }, [id])

  const typeMeta = listTypeMeta[listModel?.type] ?? {
    label: 'Тип списка',
    icon: todoIcon,
  }
  const kindMeta = listModel?.isTemplate ? listKindMeta.template : listKindMeta.regular
  const canEdit = Boolean(listModel?.canEdit)
  const isTemplateList = Boolean(listModel?.isTemplate)
  const isEditing = Boolean(editingItemId)
  const editingItem = isEditing ? items.find((item) => item.id === editingItemId) ?? null : null
  const isCompletedEditingItem = Boolean(editingItem?.isCompleted)
  const isOwner = Boolean(listModel?.ownerId && currentUserId && listModel.ownerId === currentUserId)

  const updateShoppingValue = (field, rawValue) => {
    setFormData((prev) => {
      const nextFormData = {
        ...prev,
        [field]: rawValue,
      }

      const countValue = parseDecimalValue(field === 'count' ? rawValue : nextFormData.count)
      const priceValue = parseDecimalValue(field === 'price' ? rawValue : nextFormData.price)
      const costValue = parseDecimalValue(field === 'cost' ? rawValue : nextFormData.cost)

      if (field === 'price') {
        nextFormData.cost =
          countValue !== null && priceValue !== null ? formatDecimalValue(priceValue * countValue) : prev.cost
      }

      if (field === 'cost') {
        nextFormData.price =
          countValue !== null && countValue !== 0 && costValue !== null
            ? formatDecimalValue(costValue / countValue)
            : prev.price
      }

      if (field === 'count') {
        if (priceValue !== null && countValue !== null) {
          nextFormData.cost = formatDecimalValue(priceValue * countValue)
        } else if (costValue !== null && countValue !== null && countValue !== 0) {
          nextFormData.price = formatDecimalValue(costValue / countValue)
        }
      }

      return nextFormData
    })
  }

  const openCreateDialog = () => {
    if (!canEdit) return

    setFormData(initialFormData)
    setFormErrors({})
    setCreateState(initialCreateFeedback)
    setEditingItemId(null)
    setActionState('idle')
    setIsCreateDialogOpen(true)
  }

  const openEditListDialog = () => {
    if (!isOwner || !listModel?.id) return

    setEditListFormData({
      name: listModel.name ?? '',
      description: listModel.description ?? '',
    })
    setEditListFormErrors({})
    setEditListState(initialCreateFeedback)
    setIsEditListDialogOpen(true)
  }

  const openEditDialog = (item) => {
    if (!canEdit) return

    setFormData({
      name: item.name ?? '',
      description: item.description ?? '',
      isCompleted: Boolean(item.isCompleted),
      priority: item.priority ?? '',
      deadline: normalizeDeadlineForInput(item.deadline),
      unit: item.unit ?? '',
      price: item.price ?? '',
      cost: item.cost ?? '',
      count: item.count ?? '',
    })
    setFormErrors({})
    setCreateState(initialCreateFeedback)
    setEditingItemId(item.id)
    setActionState('idle')
    setIsCreateDialogOpen(true)
  }

  const closeCreateDialog = () => {
    if (createState.status === 'loading') return

    setIsCreateDialogOpen(false)
    setFormData(initialFormData)
    setFormErrors({})
    setCreateState(initialCreateFeedback)
    setEditingItemId(null)
    setActionState('idle')
  }

  const closeEditListDialog = () => {
    if (editListState.status === 'loading') return

    setIsEditListDialogOpen(false)
    setEditListFormData(initialListFormData)
    setEditListFormErrors({})
    setEditListState(initialCreateFeedback)
  }

  const closeDeleteListDialog = () => {
    if (deleteListState.status === 'loading') return

    setIsDeleteListDialogOpen(false)
    setDeleteListOptions(initialDeleteOptions)
    setDeleteListState(initialCreateFeedback)
  }

  const closeShareDialog = () => {
    if (shareState.status === 'loading') return

    setIsShareDialogOpen(false)
    setShareFormData(initialShareFormData)
    setShareFormErrors({})
    setShareState(initialCreateFeedback)
  }

  const closeCloneDialog = () => {
    if (cloneState.status === 'loading') return

    setIsCloneDialogOpen(false)
    setCloneMode('copy')
    setCloneFormData(initialCloneFormData)
    setCloneFormErrors({})
    setCloneState(initialCreateFeedback)
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()

    if (!listModel?.id || !canEdit) return

    const nextErrors = validateCreateForm(formData)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setCreateState({ status: 'loading', message: '' })

    try {
      if (isEditing) {
        const itemToUpdate = editingItem

        if (!itemToUpdate?.version) {
          throw new Error('Не удалось определить версию элемента для редактирования.')
        }

        const response = await updateListItemRequest(
          editingItemId,
          buildUpdatePayload(itemToUpdate.version, listModel.type, formData),
        )
        void response
        await loadList()
        setCreateState({ status: 'success', message: 'Элемент списка обновлен.' })
      } else {
        await createListItemRequest(buildCreatePayload(listModel.id, listModel.type, formData))
        await loadList()
        setCreateState({ status: 'success', message: 'Элемент списка создан.' })
      }

      closeCreateDialog()
    } catch (error) {
      setCreateState({
        status: 'error',
        message: getErrorMessage(error, isEditing ? 'Не удалось обновить элемент.' : 'Не удалось создать элемент.'),
      })
      setFormErrors(mapApiFieldErrors(error))
    }
  }

  const handleCompleteItem = async () => {
    if (!isEditing || !editingItemId || !canEdit || isCompletedEditingItem) return

    const itemToComplete = editingItem
    if (!itemToComplete?.version) return

    setActionState('completing')
    setFormErrors({})
    setCreateState(initialCreateFeedback)

    try {
      await completeListItemRequest(
        editingItemId,
        buildUpdatePayload(itemToComplete.version, listModel.type, formData),
      )
      await loadList()
      closeCreateDialog()
    } catch (error) {
      setCreateState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось выполнить элемент.'),
      })
      setFormErrors(mapApiFieldErrors(error))
    } finally {
      setActionState('idle')
    }
  }

  const handleUncompleteItem = async () => {
    if (!isEditing || !editingItemId || !canEdit || !isCompletedEditingItem) return

    const itemToUncomplete = editingItem
    if (!itemToUncomplete?.version) return

    setActionState('uncompleting')
    setFormErrors({})
    setCreateState(initialCreateFeedback)

    try {
      await uncompleteListItemRequest(
        editingItemId,
        buildUpdatePayload(itemToUncomplete.version, listModel.type, formData),
      )
      await loadList()
      closeCreateDialog()
    } catch (error) {
      setCreateState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось снять выполнение элемента.'),
      })
      setFormErrors(mapApiFieldErrors(error))
    } finally {
      setActionState('idle')
    }
  }

  const handleDeleteItem = async () => {
    if (!isEditing || !editingItemId || !canEdit || isCompletedEditingItem) return

    const itemToDelete = editingItem
    if (!itemToDelete?.version) return

    const shouldDelete = window.confirm('Удалить этот элемент списка?')
    if (!shouldDelete) return

    setActionState('deleting')
    setFormErrors({})
    setCreateState(initialCreateFeedback)

    try {
      await deleteListItemRequest(editingItemId, itemToDelete.version)
      await loadList()
      closeCreateDialog()
    } catch (error) {
      setCreateState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось удалить элемент.'),
      })
    } finally {
      setActionState('idle')
    }
  }

  const handleEditListSubmit = async (event) => {
    event.preventDefault()

    if (!isOwner || !listModel?.id) return

    const nextErrors = validateListForm(editListFormData)
    setEditListFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setEditListState({ status: 'loading', message: '' })

    try {
      await updateListRequest(listModel.id, {
        name: editListFormData.name.trim(),
        description: editListFormData.description.trim() || null,
      })
      await loadList()
      closeEditListDialog()
    } catch (error) {
      setEditListState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось обновить список.'),
      })
      setEditListFormErrors(mapApiFieldErrors(error))
    }
  }

  const openDeleteListDialog = async () => {
    if (!listModel?.id) return

    setDeleteListState({ status: 'loading', message: '' })
    setDeleteListOptions(initialDeleteOptions)

    try {
      const response = await fetchListDeleteTypesRequest(listModel.id)
      setDeleteListOptions({
        left: Boolean(response?.left),
        delete: Boolean(response?.delete),
      })
      setDeleteListState(initialCreateFeedback)
      setIsDeleteListDialogOpen(true)
    } catch (error) {
      setDeleteListState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось получить доступные действия для списка.'),
      })
      setIsDeleteListDialogOpen(true)
    }
  }

  const openShareDialog = async () => {
    if (!isOwner || !listModel?.id) return

    setShareState({ status: 'loading', message: '' })
    setShareFormErrors({})

    try {
      const response = await fetchListShareRequest(listModel.id)
      setShareFormData(normalizeShareFormData(response))
      setShareState(initialCreateFeedback)
      setIsShareDialogOpen(true)
    } catch (error) {
      setShareState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось загрузить настройки доступа.'),
      })
      setIsShareDialogOpen(true)
    }
  }

  const handleCopyShortUrl = async () => {
    if (!shareFormData.shortUrl) return

    try {
      await navigator.clipboard.writeText(buildPublicShareUrl(shareFormData.shortUrl))
      setShareState({ status: 'success', message: 'Ссылка скопирована.' })
    } catch {
      setShareState({ status: 'error', message: 'Не удалось скопировать ссылку.' })
    }
  }

  const handleShareSubmit = async (event) => {
    event.preventDefault()

    if (!isOwner || !listModel?.id) return

    setShareState({ status: 'loading', message: '' })
    setShareFormErrors({})

    try {
      const response = await updateListShareRequest(listModel.id, {
        is_share_link: shareFormData.isShareLink,
        can_edit: shareFormData.isShareLink ? shareFormData.canEdit : false,
      })
      setShareFormData(normalizeShareFormData(response))
      setShareState({ status: 'success', message: 'Настройки доступа обновлены.' })
    } catch (error) {
      setShareState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось обновить настройки доступа.'),
      })
      setShareFormErrors(
        mapApiFieldErrors(error, {
          is_share_link: 'isShareLink',
          can_edit: 'canEdit',
        }),
      )
    }
  }

  const openCloneDialog = (mode) => {
    if (!listModel?.id) return

    setCloneMode(mode)
    setCloneFormData({
      name: listModel?.name ?? '',
    })
    setCloneFormErrors({})
    setCloneState(initialCreateFeedback)
    setIsCloneDialogOpen(true)
  }

  const handleCloneSubmit = async (event) => {
    event.preventDefault()

    if (!listModel?.id) return

    const nextErrors = validateListForm(cloneFormData)
    setCloneFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setCloneState({ status: 'loading', message: '' })

    try {
      const response =
        cloneMode === 'template'
          ? await createFromTemplateRequest(listModel.id, { name: cloneFormData.name.trim() })
          : await copyListRequest(listModel.id, { name: cloneFormData.name.trim() })

      const nextListId = getListIdFromResponse(response)

      if (!nextListId) {
        throw new Error('Не удалось определить id созданного списка.')
      }

      closeCloneDialog()
      navigate(`/workspace/${nextListId}`)
    } catch (error) {
      setCloneState({
        status: 'error',
        message: getErrorMessage(
          error,
          cloneMode === 'template'
            ? 'Не удалось создать список на основе шаблона.'
            : 'Не удалось скопировать список.',
        ),
      })
      setCloneFormErrors(mapApiFieldErrors(error))
    }
  }

  const handleLeaveList = async () => {
    if (!listModel?.id) return

    setDeleteListState({ status: 'loading', message: '' })

    try {
      await leaveListRequest(listModel.id)
      navigate('/workspace')
    } catch (error) {
      setDeleteListState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось покинуть список.'),
      })
    }
  }

  const handleDeleteList = async () => {
    if (!listModel?.id) return

    setDeleteListState({ status: 'loading', message: '' })

    try {
      await deleteListRequest(listModel.id)
      navigate('/workspace')
    } catch (error) {
      setDeleteListState({
        status: 'error',
        message: getErrorMessage(error, 'Не удалось удалить список.'),
      })
    }
  }

  return (
    <PageSection
      eyebrow="Workspace"
      eyebrowAction={
        <Button
          component={RouterLink}
          to="/workspace"
          variant="text"
          color="inherit"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Вернуться ко всем спискам
        </Button>
      }
    >
      <Stack spacing={2.5}>
        {status === 'error' ? <Alert severity="error">{message}</Alert> : null}

        <Paper elevation={0} className="reveal-up" sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2 }}>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  src={listModel?.ownerAvatar ?? undefined}
                  alt={listModel?.ownerName ?? 'Владелец списка'}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'rgba(32, 101, 209, 0.12)',
                    color: 'primary.main',
                    fontWeight: 800,
                  }}
                >
                  {getInitials(listModel?.ownerName ?? 'Владелец')}
                </Avatar>
                <Box>
                  <Typography variant="h3">
                    {listModel?.name ?? (status === 'loading' ? 'Загрузка...' : 'Список')}
                  </Typography>
                  <Typography color="text.secondary">
                    {listModel?.ownerName ?? 'Загружаем владельца...'}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={1.25} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Tooltip title={typeMeta.label}>
                    <Chip
                      icon={
                        <Box
                          component="img"
                          src={typeMeta.icon}
                          alt={typeMeta.label}
                          sx={{ width: 18, height: 18 }}
                        />
                      }
                      label={typeMeta.label}
                      variant="outlined"
                    />
                  </Tooltip>
                  <Tooltip title={kindMeta.description}>
                    <Chip
                      icon={
                        <Box
                          component="img"
                          src={kindMeta.icon}
                          alt={kindMeta.label}
                          sx={{ width: 18, height: 18 }}
                        />
                      }
                      label={kindMeta.label}
                      variant="outlined"
                    />
                  </Tooltip>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    maxWidth: '100%',
                  }}
                >
                  {isOwner ? (
                    <>
                      <Tooltip title="Поделиться">
                        <IconButton color="default" onClick={openShareDialog}>
                          <IosShareRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton color="default" onClick={openEditListDialog}>
                          <EditRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : null}
                  <Tooltip title="Удалить">
                    <IconButton color="error" onClick={openDeleteListDialog}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Копировать">
                    <IconButton color="default" onClick={() => openCloneDialog('copy')}>
                      <ContentCopyRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  {isTemplateList ? (
                    <Tooltip title="Создать на основе">
                      <IconButton color="default" onClick={() => openCloneDialog('template')}>
                        <LibraryAddRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
              </Stack>
            </Stack>

            {listModel?.description ? (
              <Typography color="text.secondary">{listModel.description}</Typography>
            ) : null}
          </Stack>
        </Paper>

        {listModel?.type === 'wishlist' ? (
          <Paper
            elevation={0}
            className="reveal-up reveal-up-delay-1"
            sx={{
              p: { xs: 2.25, md: 2.75 },
              borderRadius: 1,
              background: 'linear-gradient(155deg, rgba(32, 101, 209, 0.06), rgba(255,255,255,0.92))',
            }}
          >
            <Typography color="text.secondary">
              В списке желаний никто не видит, кто что отметил, даже владелец. Будет виден сам факт
              отметки, чтобы другие знали, какой пункт уже занят.
            </Typography>
          </Paper>
        ) : null}

        <Paper
          elevation={0}
          className="reveal-up reveal-up-delay-1"
          sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2 }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Typography variant="h3">Элементы списка</Typography>
              {canEdit ? (
                <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreateDialog}>
                  Создать
                </Button>
              ) : null}
            </Stack>

            <TableContainer
              sx={{
                overflowX: { xs: 'visible', sm: 'auto' },
                borderRadius: 1,
                border: '1px solid rgba(145, 158, 171, 0.14)',
              }}
            >
              <Table sx={{ minWidth: { xs: '100%', sm: 720 }, tableLayout: { xs: 'auto', sm: 'fixed' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5, fontWeight: 700 }}>
                      Название
                    </TableCell>
                    {listModel?.type === 'todo' ? (
                      <TableCell
                        align="center"
                        sx={{ width: 150, px: 2, py: 1.5, fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        Приоритет
                      </TableCell>
                    ) : null}
                    {listModel?.type === 'todo' ? (
                      <TableCell
                        align="center"
                        sx={{ width: 140, px: 2, py: 1.5, fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        Дедлайн
                      </TableCell>
                    ) : null}
                    {listModel?.type === 'shopping' ? (
                      <TableCell
                        align="center"
                        sx={{ width: 110, px: 2, py: 1.5, fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        Цена
                      </TableCell>
                    ) : null}
                    {listModel?.type === 'shopping' ? (
                      <TableCell
                        align="center"
                        sx={{ width: 120, px: 2, py: 1.5, fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        Стоимость
                      </TableCell>
                    ) : null}
                    {listModel?.type === 'shopping' ? (
                      <TableCell
                        align="center"
                        sx={{ width: 120, px: 2, py: 1.5, fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}
                      >
                        Количество
                      </TableCell>
                    ) : null}
                    {!isTemplateList ? (
                      <TableCell
                        align="center"
                        sx={{ width: 80, px: 2, py: 1.5 }}
                      />
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={getEmptyStateColSpan(listModel?.type)}
                        sx={{
                          px: { xs: 1.5, sm: 2 },
                          py: 5,
                          textAlign: 'center',
                          color: 'text.secondary',
                          borderBottom: 'none',
                        }}
                      >
                        В этом списке пока нет элементов.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow
                        key={item.id}
                        hover
                        onClick={canEdit ? () => openEditDialog(item) : undefined}
                        sx={{
                          cursor: canEdit ? 'pointer' : 'default',
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
                          >
                            <Tooltip title={item.userName}>
                              <Avatar
                                src={item.userAvatar ?? undefined}
                                alt={item.userName}
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
                                {getInitials(item.userName)}
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
                                  color: item.isCompleted ? 'text.disabled' : 'text.primary',
                                  whiteSpace: 'normal',
                                  overflowWrap: 'anywhere',
                                  wordBreak: 'break-word',
                                  hyphens: 'auto',
                                  lineHeight: 1.35,
                                }}
                              >
                                {item.name}
                              </Typography>
                              {item.description ? (
                                <Typography
                                  variant="body2"
                                  color={item.isCompleted ? 'text.disabled' : 'text.secondary'}
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
                              {listModel?.type !== 'todo' && listModel?.type !== 'shopping'
                                ? getItemMetaRows(item, listModel?.type).map((metaRow) => (
                                    <Typography key={`${item.id}-${metaRow}`} variant="caption" color="text.secondary">
                                      {metaRow}
                                    </Typography>
                                  ))
                                : null}
                              {listModel?.type === 'todo' ? (
                                <Stack
                                  direction={{ xs: 'column', sm: 'row' }}
                                  spacing={{ xs: 0.75, sm: 1 }}
                                  useFlexGap
                                  sx={{ display: { xs: 'flex', sm: 'none' }, pt: item.description ? 0.35 : 0.1 }}
                                >
                                  {item.priority ? (
                                    <Chip
                                      label={priorityLabelMap[item.priority] ?? item.priority}
                                      size="small"
                                      color={item.isCompleted ? 'default' : getPriorityChipColor(item.priority)}
                                      variant={item.isCompleted ? 'outlined' : 'filled'}
                                      sx={
                                        item.isCompleted
                                          ? {
                                              alignSelf: 'flex-start',
                                              color: 'text.disabled',
                                              borderColor: 'rgba(145, 158, 171, 0.32)',
                                            }
                                          : { alignSelf: 'flex-start' }
                                      }
                                    />
                                  ) : null}
                                  {item.deadline ? (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: item.isCompleted
                                          ? 'text.disabled'
                                          : isToday(item.deadline)
                                            ? 'error.main'
                                            : 'text.secondary',
                                        fontWeight: item.isCompleted ? 400 : isToday(item.deadline) ? 700 : 500,
                                      }}
                                    >
                                      Дедлайн: {formatDeadline(item.deadline)}
                                    </Typography>
                                  ) : null}
                                </Stack>
                              ) : null}
                              {listModel?.type === 'shopping' ? (
                                <Stack
                                  direction="column"
                                  spacing={0.45}
                                  sx={{ display: { xs: 'flex', sm: 'none' }, pt: item.description ? 0.35 : 0.1 }}
                                >
                                  {item.price !== null && item.price !== undefined && item.price !== '' ? (
                                    <Typography variant="caption" color={item.isCompleted ? 'text.disabled' : 'text.secondary'}>
                                      Цена: {item.price}
                                    </Typography>
                                  ) : null}
                                  {item.cost !== null && item.cost !== undefined && item.cost !== '' ? (
                                    <Typography variant="caption" color={item.isCompleted ? 'text.disabled' : 'text.secondary'}>
                                      Стоимость: {item.cost}
                                    </Typography>
                                  ) : null}
                                  {item.count !== null && item.count !== undefined && item.count !== '' ? (
                                    <Typography variant="caption" color={item.isCompleted ? 'text.disabled' : 'text.secondary'}>
                                      Количество: {item.count}
                                      {item.unit ? ` (${unitLabelMap[item.unit] ?? item.unit})` : ''}
                                    </Typography>
                                  ) : null}
                                </Stack>
                              ) : null}
                            </Stack>
                          </Stack>
                        </TableCell>

                        {listModel?.type === 'todo' ? (
                          <TableCell align="center" sx={{ width: 150, px: 2, display: { xs: 'none', sm: 'table-cell' } }}>
                            {item.priority ? (
                              <Chip
                                label={priorityLabelMap[item.priority] ?? item.priority}
                                size="small"
                                color={item.isCompleted ? 'default' : getPriorityChipColor(item.priority)}
                                variant={item.isCompleted ? 'outlined' : 'filled'}
                                sx={
                                  item.isCompleted
                                    ? {
                                        color: 'text.disabled',
                                        borderColor: 'rgba(145, 158, 171, 0.32)',
                                      }
                                    : undefined
                                }
                              />
                            ) : null}
                          </TableCell>
                        ) : null}

                        {listModel?.type === 'todo' ? (
                          <TableCell align="center" sx={{ width: 140, px: 2, display: { xs: 'none', sm: 'table-cell' } }}>
                            {item.deadline ? (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: item.isCompleted
                                    ? 'text.disabled'
                                    : isToday(item.deadline)
                                      ? 'error.main'
                                      : 'text.secondary',
                                  fontWeight: item.isCompleted ? 400 : isToday(item.deadline) ? 700 : 500,
                                }}
                              >
                                {formatDeadline(item.deadline)}
                              </Typography>
                            ) : null}
                          </TableCell>
                        ) : null}

                        {listModel?.type === 'shopping' ? (
                          <TableCell align="center" sx={{ width: 110, px: 2, display: { xs: 'none', sm: 'table-cell' } }}>
                            {item.price !== null && item.price !== undefined && item.price !== '' ? (
                              <Typography variant="body2" color={item.isCompleted ? 'text.disabled' : 'text.secondary'}>
                                {item.price}
                              </Typography>
                            ) : null}
                          </TableCell>
                        ) : null}

                        {listModel?.type === 'shopping' ? (
                          <TableCell align="center" sx={{ width: 120, px: 2, display: { xs: 'none', sm: 'table-cell' } }}>
                            {item.cost !== null && item.cost !== undefined && item.cost !== '' ? (
                              <Typography variant="body2" color={item.isCompleted ? 'text.disabled' : 'text.secondary'}>
                                {item.cost}
                              </Typography>
                            ) : null}
                          </TableCell>
                        ) : null}

                        {listModel?.type === 'shopping' ? (
                          <TableCell align="center" sx={{ width: 120, px: 2, display: { xs: 'none', sm: 'table-cell' } }}>
                            {item.count !== null && item.count !== undefined && item.count !== '' ? (
                              <Typography variant="body2" color={item.isCompleted ? 'text.disabled' : 'text.secondary'}>
                                {item.count}
                                {item.unit ? ` (${unitLabelMap[item.unit] ?? item.unit})` : ''}
                              </Typography>
                            ) : null}
                          </TableCell>
                        ) : null}

                        {!isTemplateList ? (
                          <TableCell align="center" sx={{ width: 80, px: 2 }}>
                            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.75}>
                              <Tooltip title={item.isCompleted ? 'Выполнено' : 'Не выполнено'}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: item.isCompleted ? 'success.main' : 'text.secondary',
                                  }}
                                >
                                  {item.isCompleted ? (
                                    <CheckCircleRoundedIcon fontSize="small" />
                                  ) : (
                                    <RadioButtonUncheckedRoundedIcon fontSize="small" />
                                  )}
                                </Box>
                              </Tooltip>
                              {listModel?.type !== 'wishlist' && item.isCompleted && item.completedUserName ? (
                                <Tooltip title={item.completedUserName}>
                                  <Avatar
                                    src={item.completedUserAvatar ?? undefined}
                                    alt={item.completedUserName}
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      fontSize: '0.62rem',
                                      bgcolor: 'rgba(32, 101, 209, 0.12)',
                                      color: 'primary.main',
                                      fontWeight: 800,
                                    }}
                                  >
                                    {getInitials(item.completedUserName)}
                                  </Avatar>
                                </Tooltip>
                              ) : null}
                            </Stack>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>

        {listModel?.type !== 'wishlist' && members.length > 0 ? (
          <Paper
            elevation={0}
            className="reveal-up reveal-up-delay-2"
            sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 2 }}
          >
            <Stack spacing={2}>
              <Typography variant="h3">Участники</Typography>

              <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                {members.map((member) => (
                  <Paper
                    key={member.id}
                    variant="outlined"
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      borderRadius: 3,
                      minWidth: { xs: '100%', sm: 220 },
                      flex: { xs: '1 1 100%', sm: '0 1 240px' },
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar
                        src={member.avatar ?? undefined}
                        alt={member.name}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: 'rgba(32, 101, 209, 0.12)',
                          color: 'primary.main',
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(member.name)}
                      </Avatar>

                      <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            whiteSpace: 'normal',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                            lineHeight: 1.3,
                          }}
                        >
                          {member.name}
                        </Typography>
                        {listModel?.type === 'shopping' ? (
                          <>
                            <Typography variant="caption" color="text.secondary">
                              Покупок: {member.itemCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Потрачено: {member.sum}
                            </Typography>
                          </>
                        ) : null}
                        {listModel?.type === 'todo' ? (
                          <Typography variant="caption" color="text.secondary">
                            Выполнено: {member.itemCount}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>
        ) : null}

        <Dialog
          open={isCloneDialogOpen}
          onClose={closeCloneDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            component: 'form',
            onSubmit: handleCloneSubmit,
            autoComplete: 'off',
            sx: { borderRadius: 1.5 },
          }}
        >
          <DialogTitle>{cloneMode === 'template' ? 'Создать на основе' : 'Копировать список'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label="Название"
                autoComplete="off"
                value={cloneFormData.name}
                onChange={(event) => setCloneFormData({ name: event.target.value })}
                error={Boolean(cloneFormErrors.name)}
                helperText={cloneFormErrors.name}
                autoFocus
              />

              {cloneState.status === 'error' ? <Alert severity="error">{cloneState.message}</Alert> : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeCloneDialog} color="inherit" disabled={cloneState.status === 'loading'}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={cloneState.status === 'loading'}>
              {cloneState.status === 'loading'
                ? cloneMode === 'template'
                  ? 'Создаем...'
                  : 'Копируем...'
                : cloneMode === 'template'
                  ? 'Создать'
                  : 'Копировать'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isShareDialogOpen}
          onClose={closeShareDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            component: 'form',
            onSubmit: handleShareSubmit,
            sx: { borderRadius: 1.5 },
          }}
        >
          <DialogTitle>Поделиться списком</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              {shareState.status === 'error' ? <Alert severity="error">{shareState.message}</Alert> : null}
              {shareState.status === 'success' ? <Alert severity="success">{shareState.message}</Alert> : null}

              <TextField
                select
                label="Доступен по ссылке"
                value={shareFormData.isShareLink ? 'true' : 'false'}
                onChange={(event) =>
                  setShareFormData((prev) => ({
                    ...prev,
                    isShareLink: event.target.value === 'true',
                    canEdit: event.target.value === 'true' ? prev.canEdit : false,
                  }))
                }
                error={Boolean(shareFormErrors.isShareLink)}
                helperText={shareFormErrors.isShareLink}
              >
                <MenuItem value="true">Да</MenuItem>
                <MenuItem value="false">Нет</MenuItem>
              </TextField>

              {shareFormData.isShareLink ? (
                <TextField
                  label="Ссылка"
                  value={buildPublicShareUrl(shareFormData.shortUrl)}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button onClick={handleCopyShortUrl} size="small" color="inherit">
                        Скопировать
                      </Button>
                    ),
                  }}
                />
              ) : null}

              {shareFormData.isShareLink ? (
                <TextField
                  select
                  label="Все могут редактировать элементы списка"
                  value={shareFormData.canEdit ? 'true' : 'false'}
                  onChange={(event) =>
                    setShareFormData((prev) => ({
                      ...prev,
                      canEdit: event.target.value === 'true',
                    }))
                  }
                  error={Boolean(shareFormErrors.canEdit)}
                  helperText={shareFormErrors.canEdit}
                >
                  <MenuItem value="true">Да</MenuItem>
                  <MenuItem value="false">Нет</MenuItem>
                </TextField>
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeShareDialog} color="inherit" disabled={shareState.status === 'loading'}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={shareState.status === 'loading'}>
              {shareState.status === 'loading' ? 'Сохраняем...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isDeleteListDialogOpen}
          onClose={closeDeleteListDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 1.5 },
          }}
        >
          <DialogTitle>Действия со списком</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              {deleteListState.status === 'error' ? <Alert severity="error">{deleteListState.message}</Alert> : null}

              {deleteListOptions.left ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Покинуть список</Typography>
                  <Typography color="text.secondary">
                    Покинуть список. Список больше не будет у Вас отображаться, но у остальных участников он останется.
                  </Typography>
                </Stack>
              ) : null}

              {deleteListOptions.delete ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle1">Удалить список</Typography>
                  <Typography color="text.secondary">
                    Удалить список. Список удалится у Вас и у всех участников.
                  </Typography>
                </Stack>
              ) : null}

              {deleteListState.status !== 'error' && !deleteListOptions.left && !deleteListOptions.delete ? (
                <Typography color="text.secondary">
                  Для этого списка сейчас нет доступных действий удаления.
                </Typography>
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Button onClick={closeDeleteListDialog} color="inherit" disabled={deleteListState.status === 'loading'}>
              Отмена
            </Button>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {deleteListOptions.left ? (
                <Button
                  onClick={handleLeaveList}
                  color="inherit"
                  variant="outlined"
                  disabled={deleteListState.status === 'loading'}
                >
                  Покинуть список
                </Button>
              ) : null}
              {deleteListOptions.delete ? (
                <Button
                  onClick={handleDeleteList}
                  color="error"
                  variant="contained"
                  disabled={deleteListState.status === 'loading'}
                >
                  Удалить список
                </Button>
              ) : null}
            </Stack>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isEditListDialogOpen}
          onClose={closeEditListDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            component: 'form',
            onSubmit: handleEditListSubmit,
            autoComplete: 'off',
            sx: { borderRadius: 1.5 },
          }}
        >
          <DialogTitle>Редактировать список</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label="Название"
                autoComplete="off"
                value={editListFormData.name}
                onChange={(event) =>
                  setEditListFormData((prev) => ({ ...prev, name: event.target.value }))
                }
                error={Boolean(editListFormErrors.name)}
                helperText={editListFormErrors.name}
                autoFocus
              />

              <TextField
                label="Описание"
                autoComplete="off"
                value={editListFormData.description}
                onChange={(event) =>
                  setEditListFormData((prev) => ({ ...prev, description: event.target.value }))
                }
                error={Boolean(editListFormErrors.description)}
                helperText={editListFormErrors.description}
                multiline
                minRows={3}
              />

              {editListState.status === 'error' ? <Alert severity="error">{editListState.message}</Alert> : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeEditListDialog} color="inherit" disabled={editListState.status === 'loading'}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={editListState.status === 'loading'}>
              {editListState.status === 'loading' ? 'Сохраняем...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>

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
          <DialogTitle>{isEditing ? 'Редактировать элемент списка' : 'Новый элемент списка'}</DialogTitle>
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

              {!isEditing && !isTemplateList ? (
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Checkbox
                      checked={formData.isCompleted}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, isCompleted: event.target.checked }))
                      }
                    />
                  }
                  label="Сразу отметить выполненным"
                />
              ) : null}

              {listModel?.type === 'todo' ? (
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Приоритет"
                    autoComplete="off"
                    value={formData.priority}
                    onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
                    error={Boolean(formErrors.priority)}
                    helperText={formErrors.priority}
                  >
                    <MenuItem value="">Не выбран</MenuItem>
                    <MenuItem value="low">{priorityLabelMap.low}</MenuItem>
                    <MenuItem value="medium">{priorityLabelMap.medium}</MenuItem>
                    <MenuItem value="high">{priorityLabelMap.high}</MenuItem>
                  </TextField>

                  <TextField
                    label="Дедлайн"
                    type="date"
                    autoComplete="off"
                    value={formData.deadline}
                    onChange={(event) => setFormData((prev) => ({ ...prev, deadline: event.target.value }))}
                    error={Boolean(formErrors.deadline)}
                    helperText={formErrors.deadline}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Stack>
              ) : null}

              {listModel?.type === 'shopping' ? (
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Единица"
                    autoComplete="off"
                    value={formData.unit}
                    onChange={(event) => setFormData((prev) => ({ ...prev, unit: event.target.value }))}
                    error={Boolean(formErrors.unit)}
                    helperText={formErrors.unit}
                  >
                    <MenuItem value="">Не выбрана</MenuItem>
                    <MenuItem value="thing">{unitLabelMap.thing}</MenuItem>
                    <MenuItem value="package">{unitLabelMap.package}</MenuItem>
                    <MenuItem value="kg">{unitLabelMap.kg}</MenuItem>
                  </TextField>

                  <TextField
                    label="Цена"
                    type="number"
                    autoComplete="off"
                    value={formData.price}
                    onChange={(event) => updateShoppingValue('price', event.target.value)}
                    error={Boolean(formErrors.price)}
                    helperText={formErrors.price}
                    slotProps={{ htmlInput: { step: '0.001', min: '0' } }}
                  />

                  <TextField
                    label="Стоимость"
                    type="number"
                    autoComplete="off"
                    value={formData.cost}
                    onChange={(event) => updateShoppingValue('cost', event.target.value)}
                    error={Boolean(formErrors.cost)}
                    helperText={formErrors.cost}
                    slotProps={{ htmlInput: { step: '0.001', min: '0' } }}
                  />

                  <TextField
                    label="Количество"
                    type="number"
                    autoComplete="off"
                    value={formData.count}
                    onChange={(event) => updateShoppingValue('count', event.target.value)}
                    error={Boolean(formErrors.count)}
                    helperText={formErrors.count}
                    slotProps={{ htmlInput: { step: '0.001', min: '0' } }}
                  />
                </Stack>
              ) : null}

              {createState.status === 'error' ? <Alert severity="error">{createState.message}</Alert> : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeCreateDialog} color="inherit" disabled={createState.status === 'loading'}>
              Отмена
            </Button>
            {isEditing && !isCompletedEditingItem ? (
              <Button
                onClick={handleDeleteItem}
                color="error"
                disabled={createState.status === 'loading' || actionState !== 'idle'}
              >
                {actionState === 'deleting' ? 'Удаляем...' : 'Удалить'}
              </Button>
            ) : null}
            {isEditing && !isCompletedEditingItem && !isTemplateList ? (
              <Button
                onClick={handleCompleteItem}
                color="success"
                disabled={createState.status === 'loading' || actionState !== 'idle'}
              >
                {actionState === 'completing' ? 'Выполняем...' : 'Выполнить'}
              </Button>
            ) : null}
            {isEditing && isCompletedEditingItem && !isTemplateList ? (
              <Button
                onClick={handleUncompleteItem}
                color="inherit"
                disabled={createState.status === 'loading' || actionState !== 'idle'}
              >
                {actionState === 'uncompleting' ? 'Возвращаем...' : 'Не выполнено'}
              </Button>
            ) : null}
            <Button type="submit" variant="contained" disabled={createState.status === 'loading'}>
              {createState.status === 'loading'
                ? isEditing
                  ? 'Сохраняем...'
                  : 'Создаем...'
                : isEditing
                  ? 'Сохранить'
                  : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </PageSection>
  )
}
