// components/monitor/StatsChart.tsx

import { ResponsiveLine } from '@nivo/line'

interface MonitorStatsChartProps {
  history: Array<{ timestamp: string; status: 'UP' | 'DOWN' | 'DEGRADED' }>
}

export function MonitorStatsChart({ history }: MonitorStatsChartProps) {
  const data = [
    {
      id: 'Uptime',
      color: 'hsl(120, 70%, 50%)',
      data: (history ?? []).map((point) => ({
        x: new Date(point.timestamp), // ✅ keep as Date object
        y: point.status === 'UP' ? 1 : point.status === 'DEGRADED' ? 0.5 : 0,
      })),
    },
  ]

  return (
    <div className='bg-card rounded-lg p-4 h-[300px]'>
      <h3 className='text-sm font-medium mb-2'>Uptime History</h3>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 20, bottom: 50, left: 50 }}
        xScale={{ type: 'time', format: 'native', precision: 'minute' }} // ✅ respects actual time
        xFormat='time:%H:%M'
        yScale={{ type: 'linear', min: 0, max: 1 }}
        axisBottom={{
          format: '%H:%M', // show only hour:minute
          tickValues: 'every 2 hours', // adjust for clarity
          legend: 'Time',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickValues: [0, 0.5, 1],
          format: (v) => (v === 1 ? 'UP' : v === 0.5 ? 'DEGRADED' : 'DOWN'),
        }}
        curve='monotoneX' // ✅ smooth wavy lines
        colors={{ datum: 'color' }}
        enablePoints={false}
        enableGridX={false}
        enableGridY={true}
        enableArea={true}
        areaOpacity={0.1}
        useMesh={true}
        animate={true}
        motionConfig='gentle'
        enableSlices='x' // ✅ clean tooltips
      />
    </div>
  )
}
