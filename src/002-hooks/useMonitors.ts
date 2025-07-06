import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import {
  createMonitor,
  deleteMonitor,
  getAllMonitors,
  getLatestMonitorResults,
  getMonitor,
  getMonitorResults,
  getMonitorStats,
  getServiceMonitors,
  updateMonitor,
} from '@/001-services/monitors'
import type {
  MonitorFormData,
  Monitor,
  MonitorWithService,
  MonitorWithLatestResult,
  MonitorResult,
  MonitorStats,
} from '@/types/monitorTypes'

export function useAllMonitors(organizationId: string) {
  return useQuery<MonitorWithService[]>({
    queryKey: ['monitors', organizationId],
    queryFn: () => getAllMonitors(organizationId),
    enabled: !!organizationId,
  })
}

export function useServiceMonitors(serviceId: string, options?: { enabled?: boolean }) {
  return useQuery<Monitor[]>({
    queryKey: ['monitors', serviceId],
    queryFn: () => getServiceMonitors(serviceId),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateMonitor(serviceId: string, orgId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation<Monitor, AxiosError, MonitorFormData>({
    mutationFn: (data) => createMonitor(serviceId, data),
    onSuccess: () => {
      toast.success('Monitor created!')
      queryClient.invalidateQueries({ queryKey: ['monitors-with-latest', serviceId] })
      queryClient.invalidateQueries({ queryKey: ['monitors', orgId] })
      onSuccess?.()
    },
    onError: (error) => {
      const data = error.response?.data as { detail?: string }
      const message = data?.detail || error.message || 'Monitor creation failed, try again.'
      toast.error(message)
    },
  })
}

export function useLatestMonitorResults(orgId: string) {
  const query = useQuery<MonitorWithLatestResult[]>({
    queryKey: ['monitors-latest-results', orgId],
    queryFn: () => getLatestMonitorResults(orgId),
    enabled: !!orgId,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return query
}

// Update monitor
export function useUpdateMonitor(serviceId: string, orgId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation<Monitor, AxiosError, { monitorId: string; payload: Partial<Monitor> }>({
    mutationFn: ({ monitorId, payload }) => updateMonitor(serviceId, monitorId, payload),
    onSuccess: () => {
      toast.success('Monitor updated!')
      queryClient.invalidateQueries({ queryKey: ['monitors-with-latest', orgId] })
      queryClient.invalidateQueries({ queryKey: ['monitors', orgId] })
      onSuccess?.()
    },
    onError: (error) => {
      const data = error.response?.data as { detail?: string }
      toast.error(data?.detail || error.message || 'Failed to update monitor.')
    },
  })
}

// Delete monitor
export function useDeleteMonitor(serviceId: string, orgId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  return useMutation<{ success: boolean }, AxiosError, { monitorId: string }>({
    mutationFn: ({ monitorId }) => deleteMonitor(serviceId, monitorId),
    onSuccess: () => {
      toast.success('Monitor deleted!')
      queryClient.invalidateQueries({ queryKey: ['monitors-with-latest', orgId] })
      queryClient.invalidateQueries({ queryKey: ['monitors', orgId] })
      onSuccess?.()
    },
    onError: (error) => {
      const data = error.response?.data as { detail?: string }
      toast.error(data?.detail || error.message || 'Failed to delete monitor.')
    },
  })
}

// Hook to fetch monitor history
export function useMonitorResults(serviceId: string, monitorId: string) {
  return useQuery<MonitorResult[]>({
    queryKey: ['monitor-results', serviceId, monitorId],
    queryFn: () => getMonitorResults(serviceId, monitorId),
    enabled: !!serviceId && !!monitorId,
    refetchOnWindowFocus: false,
  })
}

// Hook to fetch monitor stats for charts
export function useMonitorStats(serviceId: string, monitorId: string) {
  return useQuery<MonitorStats>({
    queryKey: ['monitor-stats', serviceId, monitorId],
    queryFn: () => getMonitorStats(serviceId, monitorId),
    enabled: !!serviceId && !!monitorId,
    refetchOnWindowFocus: false,
  })
}

export function useMonitor(serviceId: string, monitorId: string) {
  return useQuery<Monitor>({
    queryKey: ['monitor', serviceId, monitorId],
    queryFn: () => getMonitor(serviceId, monitorId),
    enabled: !!serviceId && !!monitorId,
  })
}
