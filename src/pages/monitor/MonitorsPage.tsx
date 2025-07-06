import { useCallback, useEffect, useState } from 'react'
import { Activity, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MonitorForm } from './MonitorForm'
import { useAuthStore } from '@/store/authenticationStore'
import { useMonitorSocket } from '@/002-hooks/useMonitorSocket'
import type { MonitorWithLatestResult } from '@/types/monitorTypes'
import { MonitorTable } from './MonitorsTable'
import { getLatestMonitorResults } from '@/001-services/monitors'

import { useNavigate } from 'react-router-dom'
import { useServices } from '@/002-hooks/useServices'

export function MonitorPage() {
  const organizationId = useAuthStore((s) => s.user?.organization_id)!
  const userRole = useAuthStore((s) => s.user?.role)
  const isAdmin = userRole === 'ADMIN'

  const [monitors, setMonitors] = useState<MonitorWithLatestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateMonitor, setShowCreateMonitor] = useState(false)

  const { data: services, isLoading: isLoadingServices } = useServices(organizationId)
  const navigate = useNavigate()

  const fetchMonitors = async () => {
    setIsLoading(true)
    try {
      const data = await getLatestMonitorResults(organizationId)
      setMonitors(data)
    } catch (error) {
      console.error('[MonitorPage] Failed to fetch monitors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonitors()
  }, [organizationId])

  const handleMonitorUpdate = useCallback((updatedMonitor: MonitorWithLatestResult) => {
    setMonitors((prev) => {
      const index = prev.findIndex((m) => m.id === updatedMonitor.id)
      if (index !== -1) {
        const newData = structuredClone(prev)
        newData[index] = {
          ...newData[index],
          ...updatedMonitor,
          latestResult: updatedMonitor.latestResult ?? null,
        }
        return newData
      } else {
        return [updatedMonitor, ...prev]
      }
    })
  }, [])

  useMonitorSocket({
    organizationId,
    onMonitorUpdate: handleMonitorUpdate,
  })

  if (!isLoadingServices && services?.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
        <Activity className='h-10 w-10 text-muted-foreground mb-4' />
        <h2 className='text-2xl font-semibold mb-2'>No Services Found</h2>
        <p className='text-muted-foreground mb-4 max-w-md'>
          You need to create a service before you can add monitors and start tracking uptime and health.
        </p>
        <Button onClick={() => navigate('/services')}>Create Service</Button>
      </div>
    )
  }

  return (
    <div className='max-w-6xl p-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight flex items-center gap-2'>
            <Activity className='w-7 h-7 text-muted-foreground' />
            All Monitors
          </h1>
          <p className='text-muted-foreground mt-1'>Uptime, status, and health checks for all services.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateMonitor(true)}>
            <Plus className='w-4 h-4' /> Create Monitor
          </Button>
        )}
      </div>

      <MonitorTable
        monitors={monitors}
        isLoading={isLoading}
        onRowClick={(monitor) => {
          const url = `${window.location.origin}/monitor/${monitor.id}/stats?serviceId=${monitor.serviceId}`
          window.open(url, '_blank', 'noopener')
        }}
        showServiceColumn={true}
        setMonitors={setMonitors}
      />

      <Dialog open={showCreateMonitor} onOpenChange={setShowCreateMonitor}>
        <DialogContent className='max-w-lg w-full'>
          <DialogHeader>
            <DialogTitle>Create Monitor</DialogTitle>
          </DialogHeader>
          <MonitorForm
            onSuccess={async () => {
              await fetchMonitors()
              setShowCreateMonitor(false)
            }}
            onCancel={() => setShowCreateMonitor(false)}
            showCancel
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
