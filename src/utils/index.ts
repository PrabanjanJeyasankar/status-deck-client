import { CheckCircle, AlertTriangle, Wrench, XCircle } from 'lucide-react'
import type { ServiceStatus } from '@/types/serviceTypes'
import type { BadgeVariant } from '@/components/ui/badge'

export const FREQUENCY_OPTIONS = [
  { label: 'Every 10 seconds', value: '10' },
  { label: 'Every 30 seconds', value: '30' },
  { label: 'Every 1 minute', value: '60' },
  { label: 'Every 5 minutes', value: '300' },
  { label: 'Every 10 minutes', value: '600' },
  { label: 'Every 20 minutes', value: '1200' },
]

export const serviceStatusOptions: { value: ServiceStatus; label: string }[] = [
  { value: 'OPERATIONAL', label: 'Operational' },
  { value: 'DEGRADED', label: 'Degraded' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUTAGE', label: 'Outage' },
]

export const statusColorMap: Record<
  ServiceStatus,
  { bg: string; text: string; icon: React.FC<{ className?: string }> }
> = {
  OPERATIONAL: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  DEGRADED: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle },
  MAINTENANCE: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Wrench },
  OUTAGE: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
}

export function getMethodBadgeVariant(method: string): BadgeVariant {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'info' // blue
    case 'POST':
      return 'success' // green
    case 'PUT':
      return 'warning' // yellow
    case 'PATCH':
      return 'violet' // violet
    case 'DELETE':
      return 'destructive' // red
    case 'HEAD':
      return 'cyan' // cyan
    case 'OPTIONS':
      return 'pink' // pink
    default:
      return 'secondary' // gray fallback
  }
}
