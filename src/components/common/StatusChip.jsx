import { Chip } from '@mui/material'

const statusMap = {
  Draft: { label: 'Черновик', color: 'default' },
  'In Progress': { label: 'В работе', color: 'info' },
  Done: { label: 'Готово', color: 'success' },
  Archived: { label: 'Архив', color: 'warning' },
}

export function StatusChip({ status }) {
  const config = statusMap[status] ?? statusMap.Draft

  return <Chip label={config.label} color={config.color} variant="filled" size="small" />
}
