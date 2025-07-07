import { useEffect } from 'react'
import { toast } from 'sonner'
import type { IncidentSeverity, IncidentRead } from '@/types/incidentTypes'

const severityOrder: Record<IncidentSeverity, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
}

interface UseIncidentSocketOptions {
  organizationId: string
  incidents: IncidentRead[]
  onIncidentUpdate: (incident: IncidentRead) => void
}

export function useIncidentSocket({ organizationId, incidents, onIncidentUpdate }: UseIncidentSocketOptions) {
  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_INCIDENT_WS_URL}/${organizationId}`)

    // ws.onopen = () => console.log(`[Incident WS] Connected for org ${organizationId}`)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // console.log('[Incident WS] Received payload:', message.payload)

      if (
        message.type === 'incident_created' ||
        message.type === 'incident_updated' ||
        message.type === 'incident_resolved'
      ) {
        const incident = message.payload as IncidentRead
        // console.log('inident ', incident)

        const prevIncident = incidents.find((i) => i.id === incident.id)

        if (prevIncident) {
          const prevSeverityLevel = severityOrder[prevIncident.severity]
          const newSeverityLevel = severityOrder[incident.severity]

          if (newSeverityLevel > prevSeverityLevel) {
            toast.warning(` Severity escalated to ${incident.severity} on "${incident.title}"`)
          } else {
            toast.info(`Incident "${incident.title}" updated.`)
          }
        } else if (message.type === 'incident_created') {
          toast.info(`New incident created: "${incident.title}"`)
        }

        onIncidentUpdate(incident)
      }
    }

    // ws.onclose = () => console.log('[Incident WS] ❌ Connection closed')
    // ws.onerror = (err) => console.error('[Incident WS] ⚠️ Error', err)

    return () => {
      ws.close()
      // console.log('[Incident WS] 🔌 Disconnected cleanly')
    }
  }, [organizationId, incidents, onIncidentUpdate])
}
