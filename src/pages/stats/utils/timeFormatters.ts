export function formatRelativeTime(timestamp: string | number): string {
  const now = new Date()
  const time = new Date(timestamp)
  if (Number.isNaN(time.getTime())) {
    return '—'
  }
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function formatActivityTime(timestamp: string): string {
  const parsed = parseTimestamp(timestamp)
  if (!parsed) {
    return '—'
  }

  const now = new Date()
  const isToday = parsed.toDateString() === now.toDateString()
  const time = parsed.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  if (isToday) {
    return `Today, ${time}`
  }
  const date = parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  return `${date}, ${time}`
}

function parseTimestamp(timestamp: string): Date | null {
  const parsed = new Date(timestamp)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }
  return parseLegacyTimestamp(timestamp)
}

function parseLegacyTimestamp(timestamp: string): Date | null {
  const parts = timestamp.trim().split(' ')
  if (parts.length < 3) {
    return null
  }
  const [datePart, timePart, meridiem] = parts
  const [year, month, day] = datePart.split('-').map(Number)
  const [rawHour, minute] = timePart.split(':').map(Number)
  if (!year || !month || !day || !rawHour || Number.isNaN(minute)) {
    return null
  }
  const isPm = meridiem.toUpperCase() === 'PM'
  let hour = rawHour % 12
  if (isPm) {
    hour += 12
  }
  return new Date(year, month - 1, day, hour, minute)
}
