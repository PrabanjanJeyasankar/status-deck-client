import type { MonitorFormData } from '@/types/monitorTypes'

export type MonitorFormError = Partial<Record<keyof MonitorFormData | string, string>>

export function validateMonitorForm(form: MonitorFormData): MonitorFormError {
  const errors: MonitorFormError = {}

  if (!form.name.trim()) errors.name = 'Monitor name is required'

  if (!form.url.trim()) {
    errors.url = 'Endpoint URL is required'
  } else if (!/^https?:\/\/.+/i.test(form.url.trim())) {
    errors.url = 'Enter a valid URL (must start with http:// or https://)'
  }

  if (!form.method) errors.method = 'Select HTTP method'
  if (!form.interval || form.interval < 10) errors.interval = 'Minimum interval is 10 seconds.'
  if (!form.timeout || form.timeout < 500) errors.timeout = 'Timeout must be at least 500ms.'
  if (!form.degradedThreshold || form.degradedThreshold < 100) errors.degradedThreshold = 'Must be at least 100ms.'

  form.headers.forEach((header, idx) => {
    if (header.key && !header.value) errors[`header_${idx}`] = 'Value required if key is set'
    if (!header.key && header.value) errors[`header_${idx}`] = 'Key required if value is set'
  })

  return errors
}
