import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Timer, Clock, AlertTriangle, ArrowLeftRight } from 'lucide-react'
import { useMonitor, useMonitorStats } from '@/002-hooks/useMonitors'
import { MonitorStatsSummary } from './StatsSummary'
import { MonitorStatsChart } from './StatsChart'
import { Logo } from '@/components/Logo'
import { Badge } from '@/components/ui/badge'
import { getMethodBadgeVariant } from '@/utils'
import { useEffect } from 'react'
import { LoadingScreen } from '@/components/LoadingScreen'

export function MonitorStatsPage() {
  const { monitorId } = useParams<{ monitorId: string }>()
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  const navigate = useNavigate()

  const { data: monitor, isLoading: isLoadingMonitor } = useMonitor(serviceId!, monitorId!)
  const { data: stats, isLoading: isLoadingStats } = useMonitorStats(serviceId!, monitorId!)

  useEffect(() => {
    if (monitor?.name) {
      const previousTitle = document.title
      document.title = `${monitor.name} | Status Deck`
      return () => {
        document.title = previousTitle
      }
    }
  }, [monitor?.name])

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

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <div className='flex flex-col items-center gap-1 mb-6'>
        <a href='/' className='flex items-center gap-2 font-medium'>
          <div className='flex size-6 items-center justify-center rounded-md'>
            <Logo size={10} />
          </div>
          <span className='text-lg font-semibold'>Status Deck.</span>
        </a>
        <p className='text-sm text-muted-foreground ml-4'>API health monitoring app</p>
      </div>

      {/* Monitor Name + URL */}
      <div>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          {monitor.name}
          <a
            href={monitor.url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground hover:text-foreground'>
            <ExternalLink className='w-5 h-5' />
          </a>
        </h1>
        <p className='text-muted-foreground break-words'>{monitor.url}</p>
      </div>

      <div className='bg-card rounded-2xl border border-border p-6'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl'>
            <ArrowLeftRight className='w-6 h-6 text-sky-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Monitor Details</h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Configuration & basic properties</p>
          </div>
        </div>

        <div className='grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Method */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <ArrowLeftRight className='w-4 h-4 text-blue-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>Method</span>
            </div>
            <div className='text-xl font-bold mb-1'>
              <Badge variant={getMethodBadgeVariant(monitor.method)}>{monitor.method}</Badge>
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>HTTP Method</div>
          </div>

          {/* Interval */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Clock className='w-4 h-4 text-green-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>Interval</span>
            </div>
            <div className='text-xl font-bold text-green-600 mb-1'>
              {monitor.interval} {monitor.interval >= 60 ? 's' : 'm'}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Check frequency</div>
          </div>

          {/* Timeout */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Timer className='w-4 h-4 text-yellow-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>Timeout</span>
            </div>
            <div className='text-xl font-bold text-yellow-600 mb-1'>{monitor.timeout ?? '—'}</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Max wait (ms)</div>
          </div>

          {/* Degraded Threshold */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <AlertTriangle className='w-4 h-4 text-orange-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>Degraded</span>
            </div>
            <div className='text-xl font-bold text-orange-600 mb-1'>{monitor.degradedThreshold ?? '—'}</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Degraded threshold (ms)</div>
          </div>

          {/* Service */}
        </div>
      </div>

      <MonitorStatsSummary stats={stats} />
      <MonitorStatsChart history={stats.historyGraph} />
    </div>
  )
}
