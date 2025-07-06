// src/hooks/useServices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceMonitorsWithLatest,
} from '@/001-services/services'
import type { Service } from '@/types/serviceTypes'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useServicesStore } from '@/store/servicesStore'
import { useEffect } from 'react'
import type { MonitorWithLatestResult } from '@/types/monitorTypes'

export function useServices(organizationId?: string) {
  const setServices = useServicesStore((s) => s.setServices)

  const query = useQuery<Service[], Error>({
    queryKey: ['services', organizationId],
    queryFn: () => getServices(organizationId!),
    enabled: Boolean(organizationId),
  })

  useEffect(() => {
    if (query.data) {
      setServices(query.data)
    }
  }, [query.data, setServices])

  return query
}

export function useService(serviceId?: string) {
  return useQuery<Service>({
    queryKey: ['service', serviceId],
    queryFn: () => getService(serviceId!),
    enabled: !!serviceId,
  })
}

export function useCreateService(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      toast.success('Service created!')
      onSuccess?.()
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail?: string }
      toast.error(data?.detail || error.message || 'Could not create service.')
    },
  })
}

export function useUpdateService(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; payload: { name: string } }) => updateService(data.id, data.payload),
    onSuccess: () => {
      toast.success('Service updated')
      queryClient.invalidateQueries({ queryKey: ['services'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to update service')
    },
  })
}

export function useDeleteService(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      toast.success('Service deleted')
      queryClient.invalidateQueries({ queryKey: ['services'] })
      onSuccess?.()
    },
    onError: () => {
      toast.error('Failed to delete service')
    },
  })
}

export function useServiceMonitorsWithLatest(serviceId: string, options?: { enabled?: boolean }) {
  return useQuery<MonitorWithLatestResult[]>({
    queryKey: ['monitors-with-latest', serviceId],
    queryFn: () => getServiceMonitorsWithLatest(serviceId),
    enabled: options?.enabled ?? !!serviceId,
  })
}
