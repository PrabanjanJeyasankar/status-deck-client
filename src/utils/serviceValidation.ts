import type { ServiceStatus } from '@/types/serviceTypes'

interface ServiceFormData {
  name: string
  status: ServiceStatus
  description?: string
}

export function validateServiceForm(data: ServiceFormData): Partial<Record<keyof ServiceFormData, string>> {
  const errors: Partial<Record<keyof ServiceFormData, string>> = {}

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Service name is required and must be at least 2 characters.'
  }
  if (!data.status) {
    errors.status = 'Status is required.'
  }

  return errors
}
