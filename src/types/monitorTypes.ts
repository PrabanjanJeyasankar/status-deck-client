export type MonitorType = 'HTTP'

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']

export interface Monitor {
  id: string
  name: string
  url: string
  method: string
  interval: number
  type: MonitorType
  headers: { key: string; value: string }[]
  active: boolean
  degradedThreshold?: number
  timeout?: number
  serviceId: string
  serviceName?: string
  createdAt: string
  updatedAt: string
}

export interface MonitorFormData {
  name: string
  url: string
  method: string
  headers: { key: string; value: string }[]
  active: boolean
  interval: number
  type: MonitorType
  degradedThreshold?: number
  timeout?: number
}

export interface MonitorWithService extends Monitor {
  serviceName: string
}

export interface MonitorLatestResult {
  status: 'UP' | 'DOWN' | 'DEGRADED' | null
  responseTimeMs: number | null
  httpStatusCode: number | null
  checkedAt: string | null
  error: string | null
}

export interface MonitorWithLatestResult {
  id: string
  name: string
  url: string
  method: string
  interval: number
  type: string
  headers: { key: string; value: string }[]
  active: boolean
  degradedThreshold: number
  timeout: number
  serviceId: string
  serviceName: string
  latestResult?: MonitorLatestResult | null
}

export type MonitorDisplay = MonitorWithLatestResult & {
  createdAt?: string
  updatedAt?: string
}

export type MonitorResult = {
  id: string
  monitorId: string
  checkedAt: string
  status: 'UP' | 'DEGRADED' | 'DOWN'
  responseTimeMs: number | null
  httpStatusCode: number | null
  error: string | null
}

export type MonitorStats = {
  uptime: number
  failures: number
  p50: number | null
  p75: number | null
  p90: number | null
  p95: number | null
  p99: number | null
  totalPings: number
  lastPing: string | null
  historyGraph: Array<{
    timestamp: string
    status: 'UP' | 'DOWN' | 'DEGRADED'
  }>
}
