import axiosInstance from '@/utils/axiosInstance'
import type { Service, ServiceStatus } from '@/types/serviceTypes'

export async function getServices(organizationId: string): Promise<Service[]> {
  const response = await axiosInstance.get(`/services?organizationId=${organizationId}`)
  return response.data
}

export async function getService(serviceId: string): Promise<Service> {
  const response = await axiosInstance.get(`/services/${serviceId}`)
  return response.data
}

export async function createService(payload: {
  name: string
  status: ServiceStatus
  description?: string
  organizationId: string
}): Promise<Service> {
  const response = await axiosInstance.post('/services', payload)
  return response.data
}

export async function updateService(
  serviceId: string,
  payload: {
    name?: string
    status?: ServiceStatus
    description?: string
  }
): Promise<Service> {
  const response = await axiosInstance.patch(`/services/${serviceId}`, payload)
  return response.data
}

export async function deleteService(serviceId: string): Promise<void> {
  await axiosInstance.delete(`/services/${serviceId}`)
}

export async function getServiceMonitorsWithLatest(serviceId: string) {
  const response = await axiosInstance.get(`/services/${serviceId}/monitors-with-latest`)
  return response.data
}
