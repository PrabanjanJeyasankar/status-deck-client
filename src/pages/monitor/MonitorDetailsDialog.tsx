'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import { Trash2, Globe, Link, Clock, Timer, Activity, List } from 'lucide-react'

import { useDeleteMonitor } from '@/002-hooks/useMonitors'
import { MonitorForm } from './MonitorForm'
import type { MonitorDisplay } from '@/types/monitorTypes'

interface MonitorDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  monitor: MonitorDisplay | null
  organizationId: string
  refetchMonitors?: () => Promise<void>
}

export function MonitorDetailsDialog({
  open,
  onOpenChange,
  monitor,
  organizationId,
  refetchMonitors,
}: MonitorDetailsDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const { mutate: deleteMonitor, isPending: isDeleting } = useDeleteMonitor(
    monitor?.serviceId ?? '',
    organizationId,
    () => {
      toast.success('Monitor deleted')
      refetchMonitors?.()
      onOpenChange(false)
    }
  )

  if (!monitor) return null

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          onOpenChange(o)
          if (!o) {
            setIsEditMode(false)
          }
        }}>
        <DialogContent aria-describedby='' className='max-w-lg w-full space-y-4'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              {isEditMode ? 'Edit Monitor' : 'Monitor Details'}
            </DialogTitle>
          </DialogHeader>

          {isEditMode ? (
            <MonitorForm
              serviceId={monitor.serviceId}
              onSuccess={() => {
                setIsEditMode(false)
                refetchMonitors?.()
                onOpenChange(false)
              }}
              onCancel={() => setIsEditMode(false)}
              initialData={monitor}
              showCancel
            />
          ) : (
            <Card>
              <CardContent className='space-y-8 pt-6'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <List size={16} />
                    <p className='font-semibold'>Name</p>
                  </div>
                  <p>{monitor.name}</p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Link size={16} />
                      <p className='font-semibold'>URL</p>
                    </div>
                    <p className='break-all'>{monitor.url}</p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Activity size={16} />
                      <p className='font-semibold'>Status</p>
                    </div>
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
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Globe size={16} />
                      <p className='font-semibold'>Method</p>
                    </div>
                    <p>{monitor.method}</p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Clock size={16} />
                      <p className='font-semibold'>Interval (min)</p>
                    </div>
                    <p>{monitor.interval}</p>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Timer size={16} />
                      <p className='font-semibold'>Timeout (ms)</p>
                    </div>
                    <p>{monitor.timeout}</p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Clock size={16} />
                    <p className='font-semibold'>Last Checked</p>
                  </div>
                  <p>
                    {monitor.latestResult?.checkedAt
                      ? dayjs(monitor.latestResult.checkedAt).format('YYYY-MM-DD HH:mm:ss')
                      : '—'}
                  </p>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                  <Button variant='destructive' onClick={() => setIsDeleteConfirmOpen(true)} size='sm'>
                    <Trash2 size={16} className='mr-1' />
                    Delete
                  </Button>
                  {/* <Button onClick={() => setIsEditMode(true)} size='sm'>
                    <Pencil size={16} className='mr-1' />
                    Edit
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this monitor?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will permanently remove this monitor from your status page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className='bg-destructive'
              onClick={() => {
                if (monitor) {
                  deleteMonitor({ monitorId: monitor.id })
                }
              }}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
