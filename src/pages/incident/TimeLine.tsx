// app/incidents/IncidentTimeline.tsx

import { useMemo } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import type { IncidentRead } from '@/types/incidentTypes'
import { IncidentTimelineNode } from './TimeNode'

interface IncidentTimelineProps {
  incidents: IncidentRead[]
  onIncidentResolved?: (incident: IncidentRead) => void
}

export function IncidentTimeline({ incidents, onIncidentResolved }: IncidentTimelineProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, IncidentRead[]> = {}

    incidents
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'OPEN' ? -1 : 1
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .forEach((incident) => {
        const createdDate = new Date(incident.createdAt)
        let groupLabel = format(createdDate, 'MMMM d, yyyy')
        if (isToday(createdDate)) groupLabel = 'Today'
        else if (isYesterday(createdDate)) groupLabel = 'Yesterday'

        if (!groups[groupLabel]) groups[groupLabel] = []
        groups[groupLabel].push(incident)
      })

    return groups
  }, [incidents])

  return (
    <div className='relative border-l pl-6 border-muted space-y-6'>
      {Object.entries(grouped).map(([dateLabel, incidents]) => (
        <div key={dateLabel} className='space-y-4'>
          <div className='text-xs text-muted-foreground font-medium'>{dateLabel}</div>
          {incidents.map((incident) => (
            <IncidentTimelineNode key={incident.id} incident={incident} onIncidentResolved={onIncidentResolved} />
          ))}
        </div>
      ))}
    </div>
  )
}
