import type {
  IncidentCreate,
  IncidentRead,
  IncidentUpdate,
  IncidentUpdateCreate,
  IncidentUpdateRead,
} from '@/types/incidentTypes'
import axiosInstance from '@/utils/axiosInstance'

export async function getIncidents(organizationId: string): Promise<IncidentRead[]> {
  const response = await axiosInstance.get(`/incidents?organizationId=${organizationId}`)
  return response.data
}

export async function getIncident(incidentId: string): Promise<IncidentRead> {
  const response = await axiosInstance.get(`/incidents/${incidentId}`)
  return response.data
}

export async function createIncident(payload: IncidentCreate): Promise<IncidentRead> {
  const response = await axiosInstance.post('/incidents', payload)
  return response.data
}

export async function updateIncident(incidentId: string, payload: IncidentUpdate): Promise<IncidentRead> {
  const response = await axiosInstance.patch(`/incidents/${incidentId}`, payload)
  return response.data
}

export async function addIncidentUpdate(
  incidentId: string,
  payload: IncidentUpdateCreate
): Promise<IncidentUpdateRead> {
  const response = await axiosInstance.post(`/incidents/${incidentId}/updates`, payload)
  return response.data
}
