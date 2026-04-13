import { publicApi } from './apiClient'

function unwrapResponse(response) {
  return response.data
}

export async function createFeedbackRequest(payload) {
  const response = await publicApi.post('/api/v1/feedback', {
    name: payload.name,
    email: payload.email,
    message: payload.message,
  })

  return unwrapResponse(response)
}
