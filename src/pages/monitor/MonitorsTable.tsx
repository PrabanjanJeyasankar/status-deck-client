import { useDeleteMonitor } from '@/002-hooks/useMonitors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthStore } from '@/store/authenticationStore'
import type { MonitorDisplay } from '@/types/monitorTypes'
import { getMethodBadgeVariant } from '@/utils'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CircleAlert, ExternalLink, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

dayjs.extend(relativeTime)

interface MonitorTableProps {
  monitors: MonitorDisplay[]
  isLoading: boolean
  onRowClick?: (monitor: MonitorDisplay) => void
  refetchMonitors?: () => void
  showServiceColumn?: boolean
  setMonitors: React.Dispatch<React.SetStateAction<MonitorDisplay[]>>
}

export function MonitorTable({
  monitors,
  isLoading,
  onRowClick,
  showServiceColumn = true,
  setMonitors,
}: MonitorTableProps) {
  const organizationId = useAuthStore((s) => s.user?.organization_id)!
  const userRole = useAuthStore((s) => s.user?.role)
  const isAdmin = userRole === 'ADMIN'

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorDisplay | null>(
    null
  )

  const { mutate: deleteMonitor, isPending: isDeleting } = useDeleteMonitor(
    selectedMonitor?.serviceId ?? '',
    organizationId,
    () => {
      toast.success('Monitor deleted')
      setIsDeleteConfirmOpen(false)
      if (selectedMonitor) {
        setMonitors((prev) => prev.filter((m) => m.id !== selectedMonitor.id))
      }
    }
  )

  if (isLoading) {
    return (
      <div className='space-y-2'>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className='h-10 w-full rounded-none' />
        ))}
      </div>
    )
  }

  if (monitors.length === 0) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        No monitors found.
      </div>
    )
  }

  return (
    <>
      <div className='overflow-x-auto rounded-none border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Interval (s/m)</TableHead>
              <TableHead>Timeout</TableHead>
              <TableHead>Degraded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resp Time</TableHead>
              <TableHead>Last Checked</TableHead>
              {showServiceColumn && <TableHead>Service</TableHead>}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {monitors.map((monitor) => (
              <TableRow
                key={monitor.id}
                onClick={() => onRowClick?.(monitor)}
                className='cursor-pointer hover:bg-muted/50 transition'>
                <TableCell className='font-medium flex items-center gap-2'>
                  {monitor.name}
                  <a
                    href={`/monitor/${monitor.id}/stats?serviceId=${monitor.serviceId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className='w-4 h-4 text-muted-foreground hover:text-foreground' />
                  </a>
                </TableCell>

                <TableCell>
                  <Badge variant={getMethodBadgeVariant(monitor.method)}>
                    {monitor.method}
                  </Badge>
                </TableCell>
                <TableCell className='max-w-[100px] truncate'>
                  {monitor.url}
                </TableCell>

                <TableCell>{monitor.interval}</TableCell>
                <TableCell>{monitor.timeout ?? '—'}</TableCell>
                <TableCell>{monitor.degradedThreshold ?? '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      monitor.latestResult?.status === 'UP'
                        ? 'success'
                        : monitor.latestResult?.status === 'DEGRADED'
                        ? 'warning'
                        : monitor.latestResult?.status === 'DOWN'
                        ? 'destructive'
                        : 'secondary'
                    }>
                    {monitor.latestResult?.status ?? '—'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {monitor.latestResult?.status === 'DOWN' ? (
                    <CircleAlert className='h-4 w-4 ml-3 text-muted-foreground' />
                  ) : monitor.latestResult?.responseTimeMs != null ? (
                    `${monitor.latestResult.responseTimeMs} ms`
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  {monitor.latestResult?.checkedAt
                    ? format(
                        new Date(monitor.latestResult.checkedAt),
                        'dd MMM yyyy hh:mm:ss a'
                      )
                    : 'N/A'}
                </TableCell>
                {showServiceColumn && (
                  <TableCell>
                    {monitor.serviceName ?? monitor.serviceId ?? '—'}
                  </TableCell>
                )}
                <TableCell className='w-4 '>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}>
                        <Button variant='ghost' size='icon' className='h-6 w-6'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start'>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMonitor(monitor)
                            setIsDeleteConfirmOpen(true)
                          }}>
                          <Trash2 className='w-4 h-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Monitor</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to delete "{selectedMonitor?.name}"? This
            action cannot be undone.
          </div>
          <DialogFooter className='mt-4'>
            <Button
              variant='outline'
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (selectedMonitor) {
                  deleteMonitor({ monitorId: selectedMonitor.id })
                }
              }}
              disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
