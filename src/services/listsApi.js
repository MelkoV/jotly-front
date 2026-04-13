import { privateApi, publicApi } from './apiClient'

function unwrapResponse(response) {
  return response.data
}

export async function fetchListsRequest({ page = 1, perPage = 50, filters = {}, signal } = {}) {
  const response = await privateApi.get('/api/v1/lists', {
    params: {
      page,
      per_page: perPage,
      ...filters,
    },
    signal,
  })

  return unwrapResponse(response)
}

export async function fetchListDetailRequest(id, { signal } = {}) {
  const response = await privateApi.get(`/api/v1/lists/${id}`, { signal })
  return unwrapResponse(response)
}

export async function createListItemRequest(payload) {
  const response = await privateApi.post('/api/v1/list-items', payload)
  return unwrapResponse(response)
}

export async function updateListItemRequest(id, payload) {
  const response = await privateApi.put(`/api/v1/list-items/${id}`, payload)
  return unwrapResponse(response)
}

export async function completeListItemRequest(id, payload) {
  const response = await privateApi.put(`/api/v1/list-items/complete/${id}`, payload)
  return unwrapResponse(response)
}

export async function uncompleteListItemRequest(id, payload) {
  const response = await privateApi.put(`/api/v1/list-items/uncomplete/${id}`, payload)
  return unwrapResponse(response)
}

export async function deleteListItemRequest(id, version) {
  const response = await privateApi.delete(`/api/v1/list-items/${id}`, {
    params: { version },
  })
  return unwrapResponse(response)
}

export async function updateListRequest(id, payload) {
  const response = await privateApi.put(`/api/v1/lists/${id}`, payload)
  return unwrapResponse(response)
}

export async function fetchListDeleteTypesRequest(id) {
  const response = await privateApi.get(`/api/v1/lists/delete-types/${id}`)
  return unwrapResponse(response)
}

export async function leaveListRequest(id) {
  const response = await privateApi.delete(`/api/v1/lists/left/${id}`)
  return unwrapResponse(response)
}

export async function deleteListRequest(id) {
  const response = await privateApi.delete(`/api/v1/lists/${id}`)
  return unwrapResponse(response)
}

export async function fetchListShareRequest(id) {
  const response = await privateApi.get(`/api/v1/lists/share/${id}`)
  return unwrapResponse(response)
}

export async function updateListShareRequest(id, payload) {
  const response = await privateApi.put(`/api/v1/lists/share/${id}`, payload)
  return unwrapResponse(response)
}

export async function fetchPublicListInfoRequest(shortUrl, { signal } = {}) {
  const response = await publicApi.get(`/api/v1/lists/info/${shortUrl}`, { signal })
  return unwrapResponse(response)
}

export async function joinListRequest(id) {
  const response = await privateApi.post(`/api/v1/lists/join/${id}`)
  return unwrapResponse(response)
}

export async function copyListRequest(id, payload) {
  const response = await privateApi.post(`/api/v1/lists/copy/${id}`, payload)
  return unwrapResponse(response)
}

export async function createFromTemplateRequest(id, payload) {
  const response = await privateApi.post(`/api/v1/lists/create-from-template/${id}`, payload)
  return unwrapResponse(response)
}

export async function createListRequest(payload) {
  const response = await privateApi.post('/api/v1/lists', {
    name: payload.name,
    description: payload.description,
    type: payload.type === 'wish' ? 'wishlist' : payload.type,
    is_template: payload.isTemplate,
  })

  return unwrapResponse(response)
}
