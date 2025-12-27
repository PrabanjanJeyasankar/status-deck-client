interface UptimeCardProps {
  uptime: number
  uptimePercent: number
  children: React.ReactNode
}

export function UptimeCard({
  uptime,
  uptimePercent,
  children,
}: UptimeCardProps) {
  return (
    <div className='rounded-none border border-white/5 bg-black/80 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'>
      <div className='grid gap-8 lg:grid-cols-[1.1fr_1.9fr]'>
        <div className='space-y-4'>
          <p className='text-xs tracking-[0.35em] text-white/45'>
            SYSTEM UPTIME
          </p>
          <div className='text-8xl font-semibold tracking-tight'>
            {uptime >= 99.995 ? '100' : uptime.toFixed(2)}%
          </div>
          <div className='h-1 rounded-none bg-white/10'>
            <div
              className='h-1 rounded-none bg-emerald-500'
              style={{ width: `${uptimePercent}%` }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
