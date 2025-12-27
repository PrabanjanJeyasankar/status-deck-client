import { getLatestMonitorResults } from '@/001-services/monitors'
import { useMonitorSocket } from '@/002-hooks/useMonitorSocket'
import { useCreateService, useServices } from '@/002-hooks/useServices'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/store/authenticationStore'
import type { MonitorWithLatestResult } from '@/types/monitorTypes'
import type { ServiceStatus } from '@/types/serviceTypes'
import {
  AlignLeft,
  Building2,
  CalendarDays,
  Clock,
  Hash,
  Mailbox,
  Plus,
  Server,
  Signal,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MonitorForm } from '../monitor/MonitorForm'
import { MonitorTable } from '../monitor/MonitorsTable'
import { ServiceCreateForm } from './ServiceCreateForm'
import { ServiceEmptyState } from './ServiceEmptyState'
import { DetailRow } from './ServiceItem'
import { ServiceList } from './ServiceList'

export function Services() {
  const [searchParams, setSearchParams] = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const [showCreate, setShowCreate] = useState(false)
  const [showCreateMonitor, setShowCreateMonitor] = useState(false)

  const organizationId = useAuthStore((s) => s.user?.organization_id)!
  const userRole = useAuthStore((s) => s.user?.role)
  const isAdmin = userRole === 'ADMIN'

  const { data: services = [], isLoading } = useServices(organizationId)
  const createServiceMutation = useCreateService(() => setShowCreate(false))

  const [monitors, setMonitors] = useState<MonitorWithLatestResult[]>([])
  const [isMonitorsLoading, setIsMonitorsLoading] = useState(true)

  useEffect(() => {
    const fetchMonitors = async () => {
      setIsMonitorsLoading(true)
      try {
        const data = await getLatestMonitorResults(organizationId)
        setMonitors(data)
      } catch (error) {
        console.error('[Services] Failed to fetch monitors:', error)
      } finally {
        setIsMonitorsLoading(false)
      }
    }

    fetchMonitors()
  }, [organizationId])

  const handleMonitorUpdate = useCallback(
    (updatedMonitor: MonitorWithLatestResult) => {
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
    },
    []
  )

  useMonitorSocket({ organizationId, onMonitorUpdate: handleMonitorUpdate })

  const serviceMonitors = monitors.filter(
    (monitor) => monitor.serviceId === serviceId
  )

  const handleCreate = (data: {
    name: string
    status: ServiceStatus
    description?: string
  }) => {
    createServiceMutation.mutate({ ...data, organizationId })
  }

  if (isLoading) {
    return <LoadingScreen message='Loading Services...' />
  }

  if (!services.length && !showCreate) {
    return isAdmin ? (
      <ServiceEmptyState onCreate={() => setShowCreate(true)} />
    ) : (
      <div className='text-center text-muted-foreground py-10'>
        No services available.
      </div>
    )
  }

  return (
    <div className=' mx-auto py-8 px-4'>
      {serviceId ? (
        <>
          <Button variant='secondary' onClick={() => setSearchParams({})}>
            ← Back to Services
          </Button>

          {services && (
            <div className='mt-6'>
              {services
                .filter((svc) => svc.id === serviceId)
                .map((svc) => (
                  <div
                    key={svc.id}
                    className='rounded-none border dark:bg-zinc-950 p-6 shadow-sm flex flex-col gap-4'>
                    <div className='flex justify-between items-start'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <Server className='w-6 h-6 text-primary shrink-0' />
                        <h2 className='text-xl font-semibold truncate'>
                          {svc.name}
                        </h2>
                      </div>
                      <div
                        className={`px-2 py-0.5 rounded-none text-xs font-medium ${
                          svc.status === 'OPERATIONAL'
                            ? 'bg-green-100 text-green-800'
                            : svc.status === 'DEGRADED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : svc.status === 'MAINTENANCE'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        <div className='flex items-center gap-1'>
                          <Signal className='w-3 h-3' />
                          {svc.status}
                        </div>
                      </div>
                    </div>

                    {svc.description && (
                      <div className='flex items-start gap-2 text-sm text-muted-foreground'>
                        <AlignLeft className='w-4 h-4 mt-0.5 shrink-0' />
                        <p className='line-clamp-3 wrap-break-word'>
                          {svc.description}
                        </p>
                      </div>
                    )}

                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground'>
                      <DetailRow
                        icon={<Hash className='w-4 h-4' />}
                        label='Service ID'
                        value={`${svc.id.slice(0, 8)}...`}
                      />
                      <DetailRow
                        icon={<Building2 className='w-4 h-4' />}
                        label='Org ID'
                        value={`${svc.organizationId.slice(0, 8)}...`}
                      />
                      <DetailRow
                        icon={<CalendarDays className='w-4 h-4' />}
                        label='Created'
                        value={new Date(svc.createdAt).toLocaleDateString()}
                      />
                      <DetailRow
                        icon={<Clock className='w-4 h-4' />}
                        label='Updated'
                        value={
                          svc.updatedAt
                            ? new Date(svc.updatedAt).toLocaleDateString()
                            : 'Not available'
                        }
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className='mt-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Monitors for this Service</h2>
            {isAdmin && (
              <Button size='sm' onClick={() => setShowCreateMonitor(true)}>
                <Plus className='w-4 h-4' /> Create Monitor
              </Button>
            )}
          </div>

          <div className='mt-4'>
            <MonitorTable
              monitors={serviceMonitors}
              isLoading={isMonitorsLoading}
              showServiceColumn={false}
              setMonitors={setMonitors}
            />
          </div>

          <Dialog open={showCreateMonitor} onOpenChange={setShowCreateMonitor}>
            <DialogContent className='!w-full'>
              <DialogHeader>
                <DialogTitle>Create Monitor</DialogTitle>
              </DialogHeader>
              <MonitorForm
                serviceId={serviceId}
                onSuccess={() => setShowCreateMonitor(false)}
                onCancel={() => setShowCreateMonitor(false)}
                showCancel
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl flex items-center gap-2 font-bold tracking-tight'>
                <Mailbox className='h-8 w-8 text-muted-foreground' /> Services
              </h1>
              <p className='text-muted-foreground mt-1'>
                View and manage your services.
              </p>
            </div>
            {isAdmin && (
              <Button onClick={() => setShowCreate(true)} size='lg'>
                <Plus className='w-4 h-4' /> Create Service
              </Button>
            )}
          </div>

          {isAdmin && showCreate && (
            <div className='mb-6'>
              <ServiceCreateForm
                onCreate={handleCreate}
                onCancel={() => setShowCreate(false)}
              />
            </div>
          )}

          <ServiceList services={services} setSearchParams={setSearchParams} />
        </>
      )}
    </div>
  )
}
