import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface MonitorDetailsGridProps {
  lastUpdated: string
  totalPings: number
  failures: number
  method: string
  intervalLabel: string
  timeoutLabel: string
}

export function MonitorDetailsGrid({
  lastUpdated,
  totalPings,
  failures,
  method,
  intervalLabel,
  timeoutLabel,
}: MonitorDetailsGridProps) {
  return (
    <div className='grid gap-6 sm:grid-cols-[1px_1fr]'>
      <div className='hidden sm:block w-px bg-white/10' />
      <div className='grid grid-cols-3 gap-x-8 gap-y-6'>
        <DetailItem
          label='Last Check'
          value={lastUpdated}
          tooltip='The most recent time this monitor ran.'
        />
        <DetailItem
          label='Total Checks'
          value={totalPings.toLocaleString()}
          tooltip='Total number of checks executed so far.'
        />
        <DetailItem
          label='Total Failures'
          value={failures.toString()}
          tooltip='Count of failed checks recorded.'
        />
        <DetailItem
          label='Method'
          value={
            <span className='inline-flex items-center rounded-none border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-semibold tracking-widest text-white/80'>
              {method}
            </span>
          }
          tooltip='HTTP method used for each request.'
        />
        <DetailItem
          label='Interval'
          value={intervalLabel}
          tooltip='How often the monitor runs.'
        />
        <DetailItem
          label='Timeout'
          value={timeoutLabel}
          tooltip='Max time allowed before a check fails.'
        />
      </div>
    </div>
  )
}

interface DetailItemProps {
  label: string
  value: string | React.ReactNode
  tooltip: string
}

function DetailItem({ label, value, tooltip }: DetailItemProps) {
  return (
    <div>
      <div className='flex items-center gap-2'>
        <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
          {label}
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type='button'
              className='text-white/35 hover:text-white/70 inline-flex items-center'>
              <Info className='h-3.5 w-3.5' />
            </button>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </div>
      <p className='mt-2 text-lg font-semibold'>{value}</p>
    </div>
  )
}
