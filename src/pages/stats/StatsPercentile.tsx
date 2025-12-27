import { LoadingScreen } from '@/components/LoadingScreen'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  stats: any
  loading: boolean
}

const percentiles = ['P50', 'P75', 'P90', 'P95', 'P99']

export function MonitorStatsPercentiles({ stats, loading }: Props) {
  if (loading) {
    return <LoadingScreen message='Loading percentiles...' />
  }

  return (
    <div className='flex flex-wrap gap-4 mt-4'>
      {percentiles.map((p) => (
        <div
          key={p}
          className='flex items-center gap-2 bg-muted p-3 rounded-none'>
          <div className='text-sm text-muted-foreground'>{p}</div>
          <div className='text-xl font-bold'>
            {stats?.[p.toLowerCase()] ?? '--'} ms
          </div>
        </div>
      ))}
    </div>
  )
}
