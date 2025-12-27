import {
  useMonitor,
  useMonitorResults,
  useMonitorStats,
} from '@/002-hooks/useMonitors'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { MonitorStatsChart } from './StatsChart'
import { MonitorStatsSummary } from './StatsSummary'

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut', staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export function MonitorStatsPage() {
  const { monitorId } = useParams<{ monitorId: string }>()
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const navigate = useNavigate()

  const { data: monitor, isLoading: isLoadingMonitor } = useMonitor(
    serviceId!,
    monitorId!
  )
  const { data: stats, isLoading: isLoadingStats } = useMonitorStats(
    serviceId!,
    monitorId!
  )

  const [activityLimit, setActivityLimit] = useState(10)
  const activityEndRef = useRef<HTMLDivElement | null>(null)
  const shouldScrollToEnd = useRef(false)
  const { data: results } = useMonitorResults(
    serviceId!,
    monitorId!,
    activityLimit
  )

  useEffect(() => {
    if (monitor?.name) {
      const previousTitle = document.title
      document.title = `${monitor.name} | Status Deck`
      return () => {
        document.title = previousTitle
      }
    }
  }, [monitor?.name])

  useEffect(() => {
    if (!shouldScrollToEnd.current) {
      return
    }
    shouldScrollToEnd.current = false

    // Wait for layout and animations to complete before scrolling
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          activityEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          })
        })
      })
    }, 300)
  }, [activityLimit])

  if (isLoadingMonitor || isLoadingStats) {
    return <LoadingScreen message='Loading monitor details...' />
  }

  if (!monitor || !stats) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen text-muted-foreground'>
        Monitor not found.
        <Button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1)
            } else {
              window.close()
            }
          }}
          className='mt-4'>
          <ArrowLeft className='w-4 h-4 mr-1' /> Back
        </Button>
      </div>
    )
  }

  const uptimePercent = Math.min(Math.max(stats.uptime ?? 0, 0), 100)
  const lastUpdated = stats.lastPing
    ? formatRelativeTime(stats.lastPing)
    : 'Never'
  const intervalLabel = `${monitor.interval}s`
  const timeoutLabel = monitor.timeout ? `${monitor.timeout}ms` : '—'
  const statusLabel = monitor.active
    ? stats.uptime >= 99
      ? 'Operational'
      : stats.uptime >= 95
      ? 'Degraded'
      : 'Down'
    : 'Paused'
  const statusDot = monitor.active
    ? stats.uptime >= 99
      ? 'bg-emerald-500'
      : stats.uptime >= 95
      ? 'bg-amber-500'
      : 'bg-rose-500'
    : 'bg-slate-500'

  const activity = results ?? []

  return (
    <div className='dark min-h-screen bg-black tewhitext-'>
      <motion.div
        className='max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8'
        variants={containerVariants}
        initial='hidden'
        animate='show'>
        <motion.div
          variants={itemVariants}
          className='flex items-center justify-between'>
          <div className='flex items-center justify-baseline gap-2 text-white'>
            <a href='/' className='flex items-center font-medium'>
              <div className='flex size-8 items-center justify-center rounded-none '>
                <Logo size={10} color='#ffffff' />
              </div>
              <span className='text-base font-semibold tracking-tight'>
                Status Deck
              </span>
            </a>
            <span className='text-xs text-white/50'>
              | API health monitoring app
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-3'>
              <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight'>
                {monitor.name}
              </h1>
              <a
                href={monitor.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-white/60 hover:text-white'>
                <ExternalLink className='w-5 h-5' />
              </a>
            </div>
            <div className='flex flex-wrap items-center gap-3 text-sm text-white/60'>
              <span className='flex items-center gap-2'>
                <span className={`size-2 rounded-none ${statusDot}`} />
                {statusLabel}
              </span>
              <span className='hidden sm:inline text-white/30'>•</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
            <p className='text-xs sm:text-sm text-white/40 break-words'>
              {monitor.url}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='rounded-none border border-white/5 bg-black/80 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'>
          <div className='grid gap-8 lg:grid-cols-[1.1fr_1.9fr]'>
            <div className='space-y-4'>
              <p className='text-xs tracking-[0.35em] text-white/45'>
                SYSTEM UPTIME
              </p>
              <div className='text-5xl sm:text-6xl font-semibold tracking-tight'>
                {stats.uptime.toFixed(2)}%
              </div>
              <div className='h-1 rounded-none bg-white/10'>
                <div
                  className='h-1 rounded-none bg-emerald-500'
                  style={{ width: `${uptimePercent}%` }}
                />
              </div>
            </div>
            <div className='grid gap-6 sm:grid-cols-[1px_1fr]'>
              <div className='hidden sm:block w-px bg-white/10' />
              <div className='grid grid-cols-3 gap-x-8 gap-y-6'>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
                      Last Check
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='text-white/35 hover:text-white/70 inline-flex items-center'>
                          <Info className='h-3.5 w-3.5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        The most recent time this monitor ran.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className='mt-2 text-lg font-semibold'>{lastUpdated}</p>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
                      Total Checks
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='text-white/35 hover:text-white/70 inline-flex items-center'>
                          <Info className='h-3.5 w-3.5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Total number of checks executed so far.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className='mt-2 text-lg font-semibold'>
                    {stats.totalPings.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
                      Total Failures
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='text-white/35 hover:text-white/70 inline-flex items-center'>
                          <Info className='h-3.5 w-3.5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Count of failed checks recorded.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className='mt-2 text-lg font-semibold'>{stats.failures}</p>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
                      Method
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='text-white/35 hover:text-white/70 inline-flex items-center'>
                          <Info className='h-3.5 w-3.5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        HTTP method used for each request.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className='mt-2 text-lg font-semibold'>
                    <span className='inline-flex items-center rounded-none border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-semibold tracking-widest text-white/80'>
                      {monitor.method}
                    </span>
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
                      Interval
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='text-white/35 hover:text-white/70 inline-flex items-center'>
                          <Info className='h-3.5 w-3.5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        How often the monitor runs.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className='mt-2 text-lg font-semibold'>{intervalLabel}</p>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-[11px] uppercase tracking-[0.3em] text-white/45'>
                      Timeout
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type='button'
                          className='text-white/35 hover:text-white/70 inline-flex items-center'>
                          <Info className='h-3.5 w-3.5' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Max time allowed before a check fails.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className='mt-2 text-lg font-semibold'>{timeoutLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MonitorStatsSummary stats={stats} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MonitorStatsChart history={stats.historyGraph} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className='rounded-none border border-white/10 bg-black/60 px-6 py-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)]'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-white/90'>
                Monitoring Activity
              </h3>
            </div>
            <motion.div layout className='relative mt-4 space-y-2'>
              <span className='absolute left-0 top-0 bottom-0 w-px bg-white/10' />
              {activity.length === 0 ? (
                <p className='pl-6 text-sm text-white/50'>No activity yet.</p>
              ) : (
                <AnimatePresence initial={false}>
                  {activity.map((entry) => {
                    const statusLabel =
                      entry.status === 'UP'
                        ? 'Successful check'
                        : entry.status === 'DEGRADED'
                        ? 'High latency detected'
                        : 'Check failed'
                    const statusColor =
                      entry.status === 'UP'
                        ? 'bg-emerald-500'
                        : entry.status === 'DEGRADED'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    const timeLabel = formatActivityTime(entry.checkedAt)
                    const statusText = entry.httpStatusCode
                      ? `Status: ${entry.httpStatusCode}`
                      : 'Status: —'
                    const latencyText =
                      entry.responseTimeMs !== null &&
                      entry.responseTimeMs !== undefined
                        ? `Latency: ${entry.responseTimeMs}ms`
                        : 'Latency: —'

                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className='flex items-start justify-between gap-4 pl-6 border-b border-white/10 pb-3 last:border-0 last:pb-0'>
                        <div className='flex items-start gap-3'>
                          <span
                            className={`mt-1.5 h-2.5 w-2.5 rounded-none ${statusColor}`}
                          />
                          <div className='space-y-1'>
                            <p className='text-sm font-medium text-white/90'>
                              {statusLabel}
                            </p>
                            <p className='text-xs text-white/50'>
                              {statusText} • {latencyText}
                            </p>
                          </div>
                        </div>
                        <span className='text-xs text-white/40'>
                          {timeLabel}
                        </span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
              <div ref={activityEndRef} />
            </motion.div>
            <div className='relative'>
              <div className='pointer-events-none absolute -top-40 left-0 right-0 h-40 bg-linear-to-t from-black to-transparent' />

              <button
                type='button'
                onClick={() => {
                  shouldScrollToEnd.current = true
                  setActivityLimit((prev) => prev + 10)
                }}
                className='mt-4 flex w-full items-center justify-center text-xs text-white/50 hover:text-white'>
                View Full Log
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function formatRelativeTime(timestamp: string | number): string {
  const now = new Date()
  const time = new Date(timestamp)
  if (Number.isNaN(time.getTime())) {
    return '—'
  }
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

function formatActivityTime(timestamp: string): string {
  const parsed = parseTimestamp(timestamp)
  if (!parsed) {
    return '—'
  }

  const now = new Date()
  const isToday = parsed.toDateString() === now.toDateString()
  const time = parsed.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
  if (isToday) {
    return `Today, ${time}`
  }
  const date = parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  return `${date}, ${time}`
}

function parseTimestamp(timestamp: string): Date | null {
  const parsed = new Date(timestamp)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed
  }
  return parseLegacyTimestamp(timestamp)
}

function parseLegacyTimestamp(timestamp: string): Date | null {
  const parts = timestamp.trim().split(' ')
  if (parts.length < 3) {
    return null
  }
  const [datePart, timePart, meridiem] = parts
  const [year, month, day] = datePart.split('-').map(Number)
  const [rawHour, minute] = timePart.split(':').map(Number)
  if (!year || !month || !day || !rawHour || Number.isNaN(minute)) {
    return null
  }
  const isPm = meridiem.toUpperCase() === 'PM'
  let hour = rawHour % 12
  if (isPm) {
    hour += 12
  }
  return new Date(year, month - 1, day, hour, minute)
}
