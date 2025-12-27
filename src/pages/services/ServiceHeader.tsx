import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

import { Skeleton } from '@/components/ui/skeleton'
import type { Service } from '@/types/serviceTypes'
import { serviceStatusOptions } from '@/utils'

interface ServiceHeaderProps {
  serviceId: string
}

export function ServiceHeader({ serviceId }: ServiceHeaderProps) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/v1/services/${serviceId}`)
      .then((r) => r.json())
      .then((s: Service) => {
        setService(s)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [serviceId])

  if (loading) {
    return (
      <div className='mb-8'>
        <Skeleton className='h-8 w-2/3 mb-2' />
        <Skeleton className='h-5 w-1/4' />
      </div>
    )
  }

  if (!service) {
    return (
      <div className='mb-8'>
        <h2 className='text-2xl font-bold'>Service Not Found</h2>
      </div>
    )
  }

  const label = serviceStatusOptions.find((opt) => opt.value === service.status)?.label ?? service.status

  return (
    <div className='mb-8'>
      <div className='flex items-center gap-3 mb-1'>
        <h2 className='text-2xl font-bold'>{service.name}</h2>
        <Badge
          variant={
            service.status === 'OPERATIONAL'
              ? 'success'
              : service.status === 'DEGRADED'
              ? 'warning'
              : service.status === 'MAINTENANCE'
              ? 'secondary'
              : 'destructive'
          }>
          {label}
        </Badge>
      </div>
      {service.description && <div className='text-muted-foreground text-sm'>{service.description}</div>}
    </div>
  )
}
