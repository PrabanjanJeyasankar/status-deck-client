export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'OUTAGE'

export interface Service {
  id: string
  name: string
  status: ServiceStatus
  description?: string
  organizationId: string
  organizationName: string
  createdAt: string
  updatedAt?: string
}
