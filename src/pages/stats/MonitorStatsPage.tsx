import {
  useMonitor,
  useMonitorResults,
  useMonitorStats,
} from '@/002-hooks/useMonitors'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ActivityLog } from './components/ActivityLog'
import { MonitorDetailsGrid } from './components/MonitorDetailsGrid'
import { MonitorHeader } from './components/MonitorHeader'
import { PageHeader } from './components/PageHeader'
import { UptimeCard } from './components/UptimeCard'
import { useActivityScroll } from './hooks/useActivityScroll'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { MonitorStatsChart } from './StatsChart'
import { MonitorStatsSummary } from './StatsSummary'
import { getMonitorStatus } from './utils/monitorStatus'
import { formatRelativeTime } from './utils/timeFormatters'

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
  const { data: results } = useMonitorResults(
    serviceId!,
    monitorId!,
    activityLimit
  )

  useDocumentTitle(monitor?.name)
  const { activityEndRef, markForScroll } = useActivityScroll(activityLimit)

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
  const { label: statusLabel, dot: statusDot } = getMonitorStatus(
    monitor.active,
    stats.uptime
  )

  const activity = results ?? []

  const handleLoadMore = () => {
    markForScroll()
    setActivityLimit((prev) => prev + 10)
  }

  return (
    <div className='dark min-h-screen bg-black tewhitext-'>
      <motion.div
        className='max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8'
        variants={containerVariants}
        initial='hidden'
        animate='show'>
        <PageHeader variants={itemVariants} />

        <MonitorHeader
          monitorName={monitor.name}
          monitorUrl={monitor.url}
          statusLabel={statusLabel}
          statusDot={statusDot}
          lastUpdated={lastUpdated}
          variants={itemVariants}
        />

        <motion.div variants={itemVariants}>
          <UptimeCard uptime={stats.uptime} uptimePercent={uptimePercent}>
            <MonitorDetailsGrid
              lastUpdated={lastUpdated}
              totalPings={stats.totalPings}
              failures={stats.failures}
              method={monitor.method}
              intervalLabel={intervalLabel}
              timeoutLabel={timeoutLabel}
            />
          </UptimeCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <MonitorStatsChart history={stats.historyGraph} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MonitorStatsSummary stats={stats} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActivityLog
            activity={activity}
            activityEndRef={activityEndRef}
            onLoadMore={handleLoadMore}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
