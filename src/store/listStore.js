import { create } from 'zustand'
import { createListRequest, fetchListsRequest } from '../services/listsApi'
import { useAuthStore } from './authStore'

const initialFeedback = {
  status: 'idle',
  message: '',
}

let listsAbortController = null

function getErrorMessage(error, fallbackMessage = 'Something went wrong.') {
  return error?.response?.data?.message ?? error?.message ?? fallbackMessage
}

function isAbortError(error) {
  return error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED'
}

function getCreatedListPayload(responseData) {
  if (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
    return responseData.data
  }

  if (responseData?.item && typeof responseData.item === 'object') {
    return responseData.item
  }

  return responseData
}

function normalizeListItem(item, fallbackPayload, currentUser) {
  const title = item?.title ?? item?.name ?? fallbackPayload.name
  const description = item?.description ?? fallbackPayload.description
  const type = item?.type ?? fallbackPayload.type
  const isTemplate = item?.isTemplate ?? item?.is_template ?? fallbackPayload.isTemplate
  const author =
    item?.author ??
    item?.owner_name ??
    item?.user?.name ??
    item?.owner?.name ??
    currentUser?.name ??
    'Вы'
  const avatar =
    item?.author_avatar ??
    item?.author_avatar_url ??
    item?.authorAvatar ??
    item?.owner_avatar ??
    null

  return {
    id: item?.id ?? `local-${Date.now()}`,
    author,
    avatar,
    date: item?.date ?? item?.touched_at ?? new Date().toISOString().slice(0, 10),
    title,
    status: item?.status ?? 'Draft',
    type,
    isTemplate: Boolean(isTemplate),
    description: description?.trim() ? description : null,
  }
}

function getListCollectionPayload(responseData) {
  if (Array.isArray(responseData)) {
    return {
      items: responseData,
      pagination: {},
    }
  }

  if (Array.isArray(responseData?.data)) {
    return {
      items: responseData.data,
      pagination: responseData.meta ?? responseData,
    }
  }

  if (Array.isArray(responseData?.items)) {
    return {
      items: responseData.items,
      pagination: responseData.meta ?? responseData,
    }
  }

  return {
    items: [],
    pagination: responseData?.meta ?? responseData ?? {},
  }
}

function buildPagination(pagination, fallbackPage, fallbackPerPage, totalItemsOnPage) {
  const currentPage = Number(pagination?.current_page ?? pagination?.page ?? fallbackPage) || 1
  const perPage = Number(pagination?.per_page ?? pagination?.perPage ?? fallbackPerPage) || fallbackPerPage
  const total = Number(pagination?.total ?? totalItemsOnPage) || totalItemsOnPage
  const numericLinks = Array.isArray(pagination?.links)
    ? pagination.links.filter((link) => Number.isInteger(link?.page))
    : []
  const lastLinkedPage = numericLinks.length > 0 ? Math.max(...numericLinks.map((link) => link.page)) : 0
  const pageCount =
    Number(
      pagination?.last_page ??
      pagination?.lastPage ??
      lastLinkedPage ??
      Math.max(1, Math.ceil(total / perPage)),
    ) || 1

  return {
    page: currentPage,
    perPage,
    total,
    pageCount: Math.max(pageCount, 1),
  }
}

export const useListStore = create((set) => ({
  items: [],
  status: 'idle',
  message: '',
  pagination: {
    page: 1,
    perPage: 50,
    total: 0,
    pageCount: 1,
  },
  createState: initialFeedback,
  fetchItems: async ({ page = 1, filters = {} } = {}) => {
    listsAbortController?.abort()
    const requestController = new AbortController()
    listsAbortController = requestController

    set({ status: 'loading', message: '' })

    try {
      const perPage = useListStore.getState().pagination.perPage
      const response = await fetchListsRequest({
        page,
        perPage,
        filters,
        signal: requestController.signal,
      })
      const collection = getListCollectionPayload(response)
      const currentUser = useAuthStore.getState().user
      const normalizedItems = collection.items.map((item) => normalizeListItem(item, {}, currentUser))

      set({
        items: normalizedItems,
        status: 'success',
        message: response?.message ?? '',
        pagination: buildPagination(collection.pagination, page, perPage, normalizedItems.length),
      })

      if (listsAbortController === requestController) {
        listsAbortController = null
      }
      return { ok: true, data: normalizedItems }
    } catch (error) {
      if (isAbortError(error)) {
        if (listsAbortController === requestController) {
          listsAbortController = null
        }
        return { ok: false, aborted: true }
      }

      set({ status: 'error', message: getErrorMessage(error) })
      if (listsAbortController === requestController) {
        listsAbortController = null
      }
      return { ok: false, error }
    }
  },
  cancelFetchItems: () => {
    listsAbortController?.abort()
    listsAbortController = null
  },
  resetCreateState: () => set({ createState: initialFeedback }),
  createItem: async (payload) => {
    set({ createState: { status: 'loading', message: '' } })

    try {
      const response = await createListRequest(payload)
      const createdItem = normalizeListItem(
        getCreatedListPayload(response),
        payload,
        useAuthStore.getState().user,
      )

      set((state) => ({
        items: [createdItem, ...state.items],
        createState: {
          status: 'success',
          message: response?.message ?? 'Список успешно создан.',
        },
      }))

      return { ok: true, data: createdItem }
    } catch (error) {
      set({
        createState: {
          status: 'error',
          message: getErrorMessage(error),
        },
      })

      return { ok: false, error }
    }
  },
}))
