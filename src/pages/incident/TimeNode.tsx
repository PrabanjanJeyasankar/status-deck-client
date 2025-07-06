import { useState } from 'react'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import type { IncidentRead } from '@/types/incidentTypes'
import { IncidentUpdateForm } from './IncidentUpdateForm'
import { CheckCircle, CircleCheckBig, Zap } from 'lucide-react'
import { useUpdateIncident } from '@/002-hooks/useIncidents'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authenticationStore'

interface IncidentTimelineNodeProps {
  incident: IncidentRead
  onIncidentResolved?: (incident: IncidentRead) => void
}

export function IncidentTimelineNode({ incident, onIncidentResolved }: IncidentTimelineNodeProps) {
  const [open, setOpen] = useState(false)

  const userRole = useAuthStore((s) => s.user?.role)
  const isAdmin = userRole === 'ADMIN'

  const updateIncident = useUpdateIncident(() => {
    toast.success('Incident resolved manually.')
  })

  const handleResolve = () => {
    updateIncident.mutate(
      {
        id: incident.id,
        payload: {
          status: 'RESOLVED',
          resolvedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: (data) => {
          onIncidentResolved?.(data)
        },
      }
    )
  }

  const severityColors = {
    LOW: 'bg-blue-400',
    MEDIUM: 'bg-yellow-400',
    HIGH: 'bg-orange-400',
    CRITICAL: 'bg-red-500',
  }

  const badgeColors = {
    LOW: 'bg-blue-100 text-blue-700',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-700',
  }

  return (
    <div className={clsx('relative', incident.status === 'RESOLVED' && 'opacity-80')}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='flex items-center justify-between w-full text-left hover:bg-muted/50 rounded px-2 py-1 transition'>
        <div className='flex items-center gap-3'>
          <span className='relative flex items-center justify-center'>
            {incident.status === 'OPEN' && (
              <span
                className={clsx(
                  'absolute inline-flex h-6 w-6 animate-ping rounded-full opacity-50',
                  severityColors[incident.severity]
                )}
              />
            )}
            <span
              className={clsx(
                'relative inline-flex h-4 w-4 rounded-full border border-background shadow-sm',
                severityColors[incident.severity]
              )}
            />
          </span>
          <div className='flex items-center gap-2 font-medium'>
            <span className='opacity-70'>{incident.title}</span>
            {incident.status === 'RESOLVED' && (
              <span className='flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/20 rounded px-1 py-0.5 text-xs'>
                {incident.autoResolved ? (
                  <>
                    <Zap size={12} strokeWidth={2.5} /> Auto Resolved
                  </>
                ) : (
                  <>
                    <CircleCheckBig size={12} strokeWidth={2.5} /> Resolved
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='hidden sm:inline'>
            {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
          </span>
          <span className={clsx('text-[10px] font-medium rounded px-1 py-0.5', badgeColors[incident.severity])}>
            {incident.severity}
          </span>
        </div>
      </button>

      {open && (
        <div className='ml-8 mt-2 border-l pl-4 border-muted space-y-3'>
          {incident.description && <div className='text-sm text-muted-foreground'>{incident.description}</div>}

          {incident.status === 'RESOLVED' ? (
            <div className='text-sm text-green-600'>
              This incident was resolved at{' '}
              {incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString() : 'N/A'}.
            </div>
          ) : (
            <>
              {isAdmin && (
                <div className='flex justify-end'>
                  <Button
                    size='sm'
                    variant='default'
                    onClick={handleResolve}
                    disabled={updateIncident.isPending}
                    className='flex items-center gap-1'>
                    <CheckCircle className='w-4 h-4' />
                    {updateIncident.isPending ? 'Resolving...' : 'Resolve Incident'}
                  </Button>
                </div>
              )}

              {isAdmin && <IncidentUpdateForm incidentId={incident.id} />}
            </>
          )}

          {incident?.updates?.length > 0 && (
            <div className='space-y-2'>
              <div className='text-sm font-medium'>Updates:</div>
              <ul className='space-y-1 text-sm'>
                {incident.updates.map((update) => (
                  <li key={update.id} className='border rounded p-2'>
                    <div>{update.message}</div>
                    <div className='text-xs text-muted-foreground'>{new Date(update.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {incident.failedPings && incident.failedPings.length > 0 && (
            <div className='space-y-2'>
              <div className='text-sm font-medium'>Down Times:</div>
              <ul className='space-y-1 text-sm'>
                {incident.failedPings.map((ping, idx) => (
                  <li key={idx} className='border rounded p-2'>
                    <div>Down at: {new Date(ping.checkedAt).toLocaleString()}</div>
                    {ping.responseTimeMs !== null && <div>Response Time: {ping.responseTimeMs} ms</div>}
                    {ping.httpStatusCode !== null && <div>HTTP Status: {ping.httpStatusCode}</div>}
                    {ping.error && <div className='text-red-600'>Error: {ping.error}</div>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
