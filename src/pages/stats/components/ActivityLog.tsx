import { AnimatePresence, motion } from 'framer-motion'
import { formatActivityTime } from '../utils/timeFormatters'

interface ActivityLogProps {
  activity: Array<{
    id: string
    status: string
    checkedAt: string
    httpStatusCode?: number | null
    responseTimeMs?: number | null
  }>
  activityEndRef: React.RefObject<HTMLDivElement | null>
  onLoadMore: () => void
}

export function ActivityLog({
  activity,
  activityEndRef,
  onLoadMore,
}: ActivityLogProps) {
  return (
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
            {activity.map((entry) => (
              <ActivityEntry key={entry.id} entry={entry} />
            ))}
          </AnimatePresence>
        )}
        <div ref={activityEndRef} />
      </motion.div>
      <div className='relative'>
        <div className='pointer-events-none absolute -top-40 left-0 right-0 h-40 bg-linear-to-t from-black to-transparent' />
        <button
          type='button'
          onClick={onLoadMore}
          className='mt-4 flex w-full items-center justify-center text-xs text-white/50 hover:text-white'>
          View Full Log
        </button>
      </div>
    </div>
  )
}

interface ActivityEntryProps {
  entry: {
    id: string
    status: string
    checkedAt: string
    httpStatusCode?: number | null
    responseTimeMs?: number | null
  }
}

function ActivityEntry({ entry }: ActivityEntryProps) {
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
    entry.responseTimeMs !== null && entry.responseTimeMs !== undefined
      ? `Latency: ${entry.responseTimeMs}ms`
      : 'Latency: —'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className='flex items-start justify-between gap-4 pl-6 border-b border-white/10 pb-3 last:border-0 last:pb-0'>
      <div className='flex items-start gap-3'>
        <span className={`mt-1.5 h-2.5 w-2.5 rounded-none ${statusColor}`} />
        <div className='space-y-1'>
          <p className='text-sm font-medium text-white/90'>{statusLabel}</p>
          <p className='text-xs text-white/50'>
            {statusText} • {latencyText}
          </p>
        </div>
      </div>
      <span className='text-xs text-white/40'>{timeLabel}</span>
    </motion.div>
  )
}
