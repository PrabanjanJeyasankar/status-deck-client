import { useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { Server, Hash, Building2, CalendarDays, Clock, MoreHorizontal, AlignLeft, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useUpdateService, useDeleteService } from '@/002-hooks/useServices'
import type { Service, ServiceStatus } from '@/types/serviceTypes'
import { ServiceEditDialog } from './EditDialog'
import { ServiceDeleteDialog } from './DeleteDialog'

import { StatusBadge } from '@/components/StatusBadge'
import { useAuthStore } from '@/store/authenticationStore'

export function ServiceItem({
  service,
  setSearchParams,
}: {
  service: Service
  setSearchParams: (params: Record<string, string>) => void
}) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const userRole = useAuthStore((s) => s.user?.role)
  const isAdmin = userRole === 'ADMIN'

  const updateServiceMutation = useUpdateService(() => setShowEdit(false))
  const deleteServiceMutation = useDeleteService(() => setShowDelete(false))

  const handleEdit = (updates: { name: string; status: ServiceStatus; description?: string }) => {
    updateServiceMutation.mutate({ id: service.id, payload: updates })
  }

  const handleDelete = () => {
    deleteServiceMutation.mutate(service.id)
  }

  return (
    <>
      <Card
        onClick={() => setSearchParams({ serviceId: service.id })}
        className='rounded-2xl border bg-white dark:bg-zinc-950 hover:shadow-lg transition-shadow cursor-pointer p-6 flex flex-col gap-5'>
        {/* Header */}
        <div className='flex justify-between items-start'>
          <div className='flex items-center gap-3 min-w-0'>
            <Server className='w-6 h-6 text-primary shrink-0' />
            <CardTitle className='text-lg font-semibold truncate'>{service.name}</CardTitle>
          </div>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='ghost' onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className='w-5 h-5 text-muted-foreground' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowEdit(true)
                  }}>
                  <Pencil className='w-4 h-4 mr-2' /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDelete(true)
                  }}
                  className='text-destructive'>
                  <Trash2 className='w-4 h-4 mr-2' /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Status */}
        <StatusBadge status={service.status} />
        {/* Description */}
        {service.description && (
          <div className='flex items-start gap-2 text-sm text-muted-foreground'>
            <AlignLeft className='w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground' />
            <div className='min-w-0'>
              <p className='line-clamp-2 break-all'>{service.description}</p>
            </div>
          </div>
        )}

        {/* Details */}
        <div className='flex flex-col gap-4 text-sm text-muted-foreground'>
          <DetailRow
            icon={<Hash className='w-4 h-4 text-muted-foreground' />}
            label='ID'
            value={`${service.id.slice(0, 8)}...`}
          />
          <DetailRow
            icon={<Building2 className='w-4 h-4 text-muted-foreground' />}
            label='Org'
            value={`${service.organizationId.slice(0, 8)}...`}
          />
          <DetailRow
            icon={<CalendarDays className='w-4 h-4 text-muted-foreground' />}
            label='Created'
            value={new Date(service.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          />
          <DetailRow
            icon={<Clock className='w-4 h-4 text-muted-foreground' />}
            label='Updated'
            value={
              service.updatedAt
                ? new Date(service.updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                : 'Not available'
            }
          />
        </div>
      </Card>

      {/* Edit Dialog */}
      <ServiceEditDialog open={showEdit} onOpenChange={setShowEdit} service={service} onSubmit={handleEdit} />

      {/* Delete Dialog */}
      <ServiceDeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        serviceName={service.name}
      />
    </>
  )
}

export function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className='flex items-center gap-2 min-w-0'>
      {icon}
      <span className='font-medium'>{label}:</span>
      <span className='truncate'>{value}</span>
    </div>
  )
}
