export function mapApiFieldErrors(error, fieldMap = {}) {
  const apiErrors = error?.response?.data?.errors

  if (!apiErrors || typeof apiErrors !== 'object') {
    return {}
  }

  return Object.entries(apiErrors).reduce((result, [field, messages]) => {
    const targetField = fieldMap[field] ?? field
    const nextMessage = Array.isArray(messages) ? messages[0] : messages

    if (typeof nextMessage === 'string' && nextMessage.trim()) {
      result[targetField] = nextMessage
    }

    return result
  }, {})
}
