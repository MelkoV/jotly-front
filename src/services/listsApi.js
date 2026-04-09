import { privateApi } from './apiClient'

function unwrapResponse(response) {
  return response.data
}

export async function fetchListsRequest({ page = 1, perPage = 2, filters = {}, signal } = {}) {
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

export async function createListRequest(payload) {
  const response = await privateApi.post('/api/v1/lists', {
    name: payload.name,
    description: payload.description,
    type: payload.type,
    is_template: payload.isTemplate,
  })

  return unwrapResponse(response)
}
