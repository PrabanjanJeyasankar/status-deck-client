import axiosInstance from '@/utils/axiosInstance'
import type {
  Monitor,
  MonitorFormData,
  MonitorResult,
  MonitorStats,
  MonitorWithLatestResult,
  MonitorWithService,
} from '@/types/monitorTypes'

//all monitors from all services
export async function getAllMonitors(organizationId: string): Promise<MonitorWithService[]> {
  const response = await axiosInstance.get(`/monitors`, {
    params: { organizationId },
  })
  return response.data
}

export async function getServiceMonitors(serviceId: string): Promise<Monitor[]> {
  const response = await axiosInstance.get(`/services/${serviceId}/monitors`)
  return response.data
}
// Create a monitor
export async function createMonitor(serviceId: string, data: MonitorFormData): Promise<Monitor> {
  const payload = {
    ...data,
    interval: Number(data.interval),
    timeout: data.timeout ? Number(data.timeout) : 5000,
    degradedThreshold: data.degradedThreshold ?? 2000,
    type: 'HTTP',
  }
  const response = await axiosInstance.post(`/services/${serviceId}/monitors`, payload)
  return response.data
}
// List monitors for a service
export async function getMonitors(serviceId: string): Promise<Monitor[]> {
  const response = await axiosInstance.get(`/services/${serviceId}/monitors`)
  return response.data
}

// Get one monitor
export async function getMonitor(serviceId: string, monitorId: string): Promise<Monitor> {
  const response = await axiosInstance.get(`/services/${serviceId}/monitors/${monitorId}`)
  return response.data
}

// Update a monitor
export async function updateMonitor(
  serviceId: string,
  monitorId: string,
  payload: Partial<Omit<Monitor, 'id' | 'createdAt'>>
): Promise<Monitor> {
  const response = await axiosInstance.patch(`/services/${serviceId}/monitors/${monitorId}`, payload)
  return response.data
}

// Delete a monitor
export async function deleteMonitor(serviceId: string, monitorId: string): Promise<{ success: boolean }> {
  const response = await axiosInstance.delete(`/services/${serviceId}/monitors/${monitorId}`)
  return response.data
}

export async function getLatestMonitorResults(orgId: string): Promise<MonitorWithLatestResult[]> {
  const response = await axiosInstance.get('/monitors/latest-results', {
    params: { organizationId: orgId },
  })
  return response.data
}

// Fetch monitoring results for a monitor
export async function getMonitorResults(
  serviceId: string,
  monitorId: string,
  limit?: number
): Promise<MonitorResult[]> {
  const res = await axiosInstance.get(`/services/${serviceId}/monitors/${monitorId}/results`, {
    params: limit ? { limit } : undefined,
  })
  return res.data
}

// Fetch monitor stats for chart
export async function getMonitorStats(serviceId: string, monitorId: string): Promise<MonitorStats> {
  const res = await axiosInstance.get(`/services/${serviceId}/monitors/${monitorId}/stats`)
  return res.data
}

export async function getMonitorById(monitorId: string): Promise<Monitor> {
  const response = await axiosInstance.get(`/monitors/${monitorId}`)
  return response.data
}
