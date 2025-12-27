import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEffect, useRef, useState } from 'react'

interface MonitorStatsChartProps {
  history: Array<{ timestamp: string; status: 'UP' | 'DOWN' | 'DEGRADED' }>
}

const STATUS_LABEL: Record<
  MonitorStatsChartProps['history'][number]['status'],
  string
> = {
  UP: 'Operational',
  DEGRADED: 'Degraded',
  DOWN: 'Down',
}

const STATUS_COLOR: Record<
  MonitorStatsChartProps['history'][number]['status'],
  string
> = {
  UP: 'bg-emerald-500',
  DEGRADED: 'bg-amber-500',
  DOWN: 'bg-rose-500',
}

export function MonitorStatsChart({ history }: MonitorStatsChartProps) {
  const blocks = (history ?? []).slice(-90)
  const startDate = blocks[0]?.timestamp
  const endDate = blocks[blocks.length - 1]?.timestamp
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  const barWidth = 8
  const barGap = 4

  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }

    const updateCount = () => {
      const width = el.clientWidth
      const perBar = barWidth + barGap
      const nextCount = Math.max(1, Math.floor((width + barGap) / perBar))
      setVisibleCount(nextCount)
    }

    updateCount()
    const observer = new ResizeObserver(updateCount)
    observer.observe(el)
    return () => observer.disconnect()
  }, [barGap, barWidth])

  const visibleBlocks =
    visibleCount > 0 ? blocks.slice(-visibleCount) : blocks.slice(-1)

  return (
    <div className='rounded-none border border-white/10 bg-black/60 p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)]'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-white/80'>Uptime History</h3>
        <div className='flex items-center gap-3 text-xs text-white/60'>
          <span className='inline-flex items-center gap-1'>
            <span className='h-2 w-2 rounded-none bg-emerald-500' />
            Operational
          </span>
          <span className='inline-flex items-center gap-1'>
            <span className='h-2 w-2 rounded-none bg-amber-500' />
            Degraded
          </span>
          <span className='inline-flex items-center gap-1'>
            <span className='h-2 w-2 rounded-none bg-rose-500' />
            Down
          </span>
        </div>
      </div>
      <div
        ref={containerRef}
        className='mt-4 rounded-none border border-white/10 bg-black/60 px-2 py-3 overflow-hidden'>
        <div className='flex gap-1'>
          {blocks.length === 0 ? (
            <div className='text-center text-xs text-white/50'>
              No uptime data yet.
            </div>
          ) : (
            visibleBlocks.map((point, index) => (
              <Tooltip key={`${point.timestamp}-${index}`}>
                <TooltipTrigger asChild>
                  <div
                    className={`h-6 sm:h-8 ${STATUS_COLOR[point.status]}`}
                    style={{ width: barWidth }}
                    aria-label={`${
                      STATUS_LABEL[point.status]
                    } on ${formatDateTime(point.timestamp)}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {STATUS_LABEL[point.status]} •{' '}
                  {formatDateTime(point.timestamp)}
                </TooltipContent>
              </Tooltip>
            ))
          )}
        </div>
      </div>
      <div className='mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/40'>
        <span>{formatDateLabel(startDate)}</span>
        <span>{formatDateLabel(endDate)}</span>
      </div>
    </div>
  )
}

function formatDateLabel(timestamp?: string) {
  if (!timestamp) {
    return '—'
  }
  const parsed = new Date(timestamp)
  if (Number.isNaN(parsed.getTime())) {
    return timestamp
  }
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(timestamp: string) {
  const parsed = new Date(timestamp)
  if (Number.isNaN(parsed.getTime())) {
    return timestamp
  }
  return parsed.toLocaleString()
}
