import type { ServiceStatus } from '@/types/serviceTypes'
import { statusColorMap } from '@/utils'

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const { bg, text, icon: Icon } = statusColorMap[status]

  return (
    <div className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${bg} ${text}`}>
      <div className='flex items-center gap-1'>
        <Icon className='w-3 h-3' />
        {status}
      </div>
    </div>
  )
}
