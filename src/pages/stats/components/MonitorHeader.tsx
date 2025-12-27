import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface MonitorHeaderProps {
  monitorName: string
  monitorUrl: string
  statusLabel: string
  statusDot: string
  lastUpdated: string
  variants: import('framer-motion').Variants
}

export function MonitorHeader({
  monitorName,
  monitorUrl,
  statusLabel,
  statusDot,
  lastUpdated,
  variants,
}: MonitorHeaderProps) {
  return (
    <motion.div
      variants={variants}
      className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
      <div className='space-y-2'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight'>
            {monitorName}
          </h1>
          <a
            href={monitorUrl}
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
        <p className='text-xs sm:text-sm text-white/40 wrap-break-word'>
          {monitorUrl}
        </p>
      </div>
    </motion.div>
  )
}
