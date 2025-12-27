import type { ServiceStatus } from '@/types/serviceTypes'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Wrench, XCircle } from 'lucide-react'

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const config: Record<
    ServiceStatus,
    { icon: React.FC<{ className?: string }>; variant: 'success' | 'warning' | 'info' | 'destructive' }
  > = {
    OPERATIONAL: { icon: CheckCircle, variant: 'success' },
    DEGRADED: { icon: AlertTriangle, variant: 'warning' },
    MAINTENANCE: { icon: Wrench, variant: 'info' },
    OUTAGE: { icon: XCircle, variant: 'destructive' },
  }
  const { icon: Icon, variant } = config[status]

  return (
    <Badge variant={variant}>
      <span className='flex items-center gap-1'>
        <Icon className='w-3 h-3' />
        {status}
      </span>
    </Badge>
  )
}
