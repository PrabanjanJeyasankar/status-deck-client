export type IncidentStatus = 'OPEN' | 'RESOLVED' | 'MONITORING'

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface IncidentUpdateCreate {
  message: string
  createdBy?: string
}

export interface IncidentUpdateRead {
  id: string
  message: string
  createdAt: string
  createdBy?: string
}

export interface IncidentCreate {
  organizationId: string
  title: string
  description?: string
  severity: IncidentSeverity
  affectedServiceIds: string[]
  monitorId?: string
  autoCreated?: boolean
  createdByUserId?: string
}

export interface IncidentUpdate {
  status?: IncidentStatus
  resolvedAt?: string
  description?: string
}

export interface IncidentRead {
  autoResolved: boolean
  id: string
  organizationId: string
  title: string
  description?: string
  status: IncidentStatus
  severity: IncidentSeverity
  autoCreated: boolean
  monitorId?: string
  affectedServiceIds: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  createdByUserId?: string
  updates: IncidentUpdateRead[]
  failedPings?: {
    checkedAt: string
    responseTimeMs: number | null
    httpStatusCode: number | null
    error: string | null
  }[]
}
