import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { MonitorStats } from '@/types/monitorTypes'
import { Info } from 'lucide-react'

interface MonitorStatsSummaryProps {
  stats: MonitorStats
}

export function MonitorStatsSummary({ stats }: MonitorStatsSummaryProps) {
  return (
    <div className='space-y-8 text-white'>
      {/* Performance Latency */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-white'>
              Performance Latency
            </h3>
          </div>
          <p className='text-[11px] uppercase tracking-[0.35em] text-white/40'>
            Global Avg
          </p>
        </div>
        <div className='rounded-none border border-white/10 bg-black/60 px-4 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]'>
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-4 text-center'>
            <div className='space-y-2'>
              <div className='text-2xl font-semibold'>
                {stats?.p50 ?? '-'}
                <span className='text-sm text-white/60'>ms</span>
              </div>
              <div className='mx-auto h-1 w-10 rounded-none bg-emerald-500' />
              <div className='flex items-center justify-center gap-2'>
                <p className='text-xs tracking-[0.2em] text-white/40'>P50</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='text-white/35 hover:text-white/70 inline-flex items-center'>
                      <Info className='h-3.5 w-3.5' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Half of all checks are faster than this time.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-2xl font-semibold'>
                {stats?.p75 ?? '-'}
                <span className='text-sm text-white/60'>ms</span>
              </div>
              <div className='mx-auto h-1 w-10 rounded-none bg-green-400' />
              <div className='flex items-center justify-center gap-2'>
                <p className='text-xs tracking-[0.2em] text-white/40'>P75</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='text-white/35 hover:text-white/70 inline-flex items-center'>
                      <Info className='h-3.5 w-3.5' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    3 out of 4 checks are faster than this time.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-2xl font-semibold'>
                {stats?.p90 ?? '-'}
                <span className='text-sm text-white/60'>ms</span>
              </div>
              <div className='mx-auto h-1 w-10 rounded-none bg-amber-400' />
              <div className='flex items-center justify-center gap-2'>
                <p className='text-xs tracking-[0.2em] text-white/40'>P90</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='text-white/35 hover:text-white/70 inline-flex items-center'>
                      <Info className='h-3.5 w-3.5' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    9 out of 10 checks are faster than this time.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-2xl font-semibold'>
                {stats?.p95 ?? '-'}
                <span className='text-sm text-white/60'>ms</span>
              </div>
              <div className='mx-auto h-1 w-10 rounded-none bg-orange-400' />
              <div className='flex items-center justify-center gap-2'>
                <p className='text-xs tracking-[0.2em] text-white/40'>P95</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='text-white/35 hover:text-white/70 inline-flex items-center'>
                      <Info className='h-3.5 w-3.5' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Only 5% of checks take longer than this time.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-2xl font-semibold'>
                {stats?.p99 ?? '-'}
                <span className='text-sm text-white/60'>ms</span>
              </div>
              <div className='mx-auto h-1 w-10 rounded-none bg-red-500' />
              <div className='flex items-center justify-center gap-2'>
                <p className='text-xs tracking-[0.2em] text-white/40'>P99</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type='button'
                      className='text-white/35 hover:text-white/70 inline-flex items-center'>
                      <Info className='h-3.5 w-3.5' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Only 1% of checks take longer than this time.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
