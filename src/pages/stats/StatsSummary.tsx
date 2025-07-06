import type { MonitorStats } from '@/types/monitorTypes'
import {
  Clock,
  Gauge,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Timer,
  BarChart3,
  Eye,
  Calendar,
  Signal,
  Target,
  MonitorCheck,
} from 'lucide-react'

interface MonitorStatsSummaryProps {
  stats: MonitorStats
}

export function MonitorStatsSummary({ stats }: MonitorStatsSummaryProps) {
  const uptime = stats?.uptime ?? 0
  const failures = stats?.failures ?? 0
  const totalPings = stats?.totalPings ?? 0

  return (
    <div className='space-y-8'>
      <div className='bg-card rounded-2xl border border-border p-8 '>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl'>
            <MonitorCheck className='w-6 h-6 text-emerald-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>System Health</h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Reliability & uptime metrics</p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          {/* Uptime Card */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                {uptime >= 99 ? (
                  <CheckCircle className='w-5 h-5 text-emerald-500' />
                ) : uptime >= 95 ? (
                  <AlertTriangle className='w-5 h-5 text-amber-500' />
                ) : (
                  <XCircle className='w-5 h-5 text-red-500' />
                )}
                <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>Uptime</span>
              </div>
              <div className='flex items-center gap-1'>
                {uptime >= 99 ? (
                  <TrendingUp className='w-4 h-4 text-emerald-500' />
                ) : (
                  <TrendingDown className='w-4 h-4 text-red-500' />
                )}
              </div>
            </div>
            <div
              className={`text-3xl font-bold mb-2 ${
                uptime >= 99 ? 'text-emerald-600' : uptime >= 95 ? 'text-amber-600' : 'text-red-600'
              }`}>
              {uptime.toFixed(2)}%
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {uptime >= 99 ? 'Excellent' : uptime >= 95 ? 'Good' : 'Needs attention'}
            </div>
          </div>

          {/* Failures Card */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <AlertTriangle
                  className={`w-5 h-5 ${
                    failures === 0 ? 'text-emerald-500' : failures < 10 ? 'text-amber-500' : 'text-red-500'
                  }`}
                />
                <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>Failures</span>
              </div>
              <div className='flex items-center gap-1'>
                {failures === 0 ? (
                  <CheckCircle className='w-4 h-4 text-emerald-500' />
                ) : (
                  <XCircle className='w-4 h-4 text-red-500' />
                )}
              </div>
            </div>
            <div
              className={`text-3xl font-bold mb-2 ${
                failures === 0 ? 'text-emerald-600' : failures < 10 ? 'text-amber-600' : 'text-red-600'
              }`}>
              {failures}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {failures === 0 ? 'Perfect' : failures < 10 ? 'Minor issues' : 'Critical issues'}
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Activity */}
      <div className='bg-card rounded-2xl border border-border p-8 '>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl'>
            <Eye className='w-6 h-6 text-blue-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Monitoring Activity</h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Check frequency & coverage</p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
          {/* Total Checks */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <BarChart3 className='w-5 h-5 text-blue-500' />
                <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>Total Checks</span>
              </div>
              <div className='flex items-center gap-1'>
                <Target className='w-4 h-4 text-blue-500' />
              </div>
            </div>
            <div className='text-3xl font-bold  mb-2'>{totalPings.toLocaleString()}</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {totalPings > 1000 ? 'Comprehensive' : totalPings > 100 ? 'Good coverage' : 'Limited data'}
            </div>
          </div>

          {/* Last Check */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Clock className='w-5 h-5 text-blue-500' />
                <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>Last Check</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4 text-blue-500' />
              </div>
            </div>
            <div className='text-2xl font-bold  mb-2'>
              {stats?.lastPing ? formatRelativeTime(stats.lastPing) : 'Never'}
            </div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>
              {stats?.lastPing ? 'Recently active' : 'No data'}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className='bg-card rounded-2xl border border-border p-8 '>
        {' '}
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl'>
            <Zap className='w-6 h-6 text-orange-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Performance Metrics</h3>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Response time distribution</p>
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4'>
          {/* P50 */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Signal className='w-4 h-4 text-emerald-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>P50</span>
            </div>
            <div className='text-xl font-bold text-emerald-600 mb-1'>{stats?.p50 ?? '-'} ms</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Median</div>
          </div>

          {/* P75 */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Gauge className='w-4 h-4 text-blue-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>P75</span>
            </div>
            <div className='text-xl font-bold text-blue-600 mb-1'>{stats?.p75 ?? '-'} ms</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Good</div>
          </div>

          {/* P90 */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Timer className='w-4 h-4 text-amber-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>P90</span>
            </div>
            <div className='text-xl font-bold text-amber-600 mb-1'>{stats?.p90 ?? '-'} ms</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Acceptable</div>
          </div>

          {/* P95 */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Timer className='w-4 h-4 text-orange-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>P95</span>
            </div>
            <div className='text-xl font-bold text-orange-600 mb-1'>{stats?.p95 ?? '-'} ms</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Slow</div>
          </div>

          {/* P99 */}
          <div className='bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-center'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Timer className='w-4 h-4 text-red-500' />
              <span className='text-xs font-medium text-slate-700 dark:text-slate-300'>P99</span>
            </div>
            <div className='text-xl font-bold text-red-600 mb-1'>{stats?.p99 ?? '-'} ms</div>
            <div className='text-xs text-slate-500 dark:text-slate-400'>Critical</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatRelativeTime(timestamp: string | number): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }
}
