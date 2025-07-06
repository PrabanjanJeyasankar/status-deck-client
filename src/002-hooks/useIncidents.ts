import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getIncidents, getIncident, createIncident, updateIncident, addIncidentUpdate } from '@/001-services/incidents'
import type { IncidentRead, IncidentUpdate, IncidentUpdateCreate } from '@/types/incidentTypes'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

export function useIncidents(organizationId?: string) {
  return useQuery<IncidentRead[]>({
    queryKey: ['incidents', organizationId],
    queryFn: () => getIncidents(organizationId!),
    enabled: Boolean(organizationId),
  })
}

export function useIncident(incidentId?: string) {
  return useQuery<IncidentRead>({
    queryKey: ['incident', incidentId],
    queryFn: () => getIncident(incidentId!),
    enabled: Boolean(incidentId),
  })
}

export function useCreateIncident(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      toast.success('Incident created!')
      onSuccess?.()
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail?: string }
      toast.error(data?.detail || error.message || 'Could not create incident.')
    },
  })
}

export function useUpdateIncident(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; payload: IncidentUpdate }) => updateIncident(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      onSuccess?.()
    },
    onError: (error: AxiosError) => {
      toast.error(error.message || 'Could not update incident.')
    },
  })
}

export function useAddIncidentUpdate(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { incidentId: string; payload: IncidentUpdateCreate }) =>
      addIncidentUpdate(data.incidentId, data.payload),
    onSuccess: () => {
      toast.success('Incident update added!')
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      onSuccess?.()
    },
    onError: (error: AxiosError) => {
      toast.error(error.message || 'Could not add incident update.')
    },
  })
}
