import { useEffect } from 'react'

const titleSuffix = ' | Jotly'

export function buildDocumentTitle(title) {
  return `${title}${titleSuffix}`
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = buildDocumentTitle(title)
  }, [title])
}
