import type { Service } from '@/types/serviceTypes'
import { ServiceItem } from './ServiceItem'

export function ServiceList({
  services,
  setSearchParams,
}: {
  services: Service[]
  setSearchParams: (params: Record<string, string>) => void
}) {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {services.map((service) => (
        <ServiceItem key={service.id} service={service} setSearchParams={setSearchParams} />
      ))}
    </div>
  )
}
