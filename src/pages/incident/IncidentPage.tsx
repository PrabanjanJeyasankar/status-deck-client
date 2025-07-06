import { useState, useEffect, useMemo } from 'react'
import { CheckCircle, Siren } from 'lucide-react'
import { useAuthStore } from '@/store/authenticationStore'
import { useServices } from '@/002-hooks/useServices'
import { ServiceFilterPopover } from './ServiceFilterPopover'
import { IncidentTimeline } from './TimeLine'
import { getIncidents } from '@/001-services/incidents'
import type { IncidentRead } from '@/types/incidentTypes'
import { useIncidentSocket } from '@/002-hooks/useIncidentSockets'

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentRead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])

  const organizationId = useAuthStore((s) => s.user?.organization_id)!
  const { data: services = [] } = useServices(organizationId)

  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true)
      try {
        const data = await getIncidents(organizationId)
        setIncidents(data)
      } catch (error) {
        console.error('[IncidentsPage] Failed to fetch incidents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncidents()
  }, [organizationId])

  useIncidentSocket({
    organizationId,
    incidents,
    onIncidentUpdate: (updatedIncident) => {
      setIncidents((prev) => {
        const index = prev.findIndex((i) => i.id === updatedIncident.id)
        if (index !== -1) {
          const newData = structuredClone(prev)
          newData[index] = updatedIncident
          return newData
        } else {
          return [updatedIncident, ...prev]
        }
      })
    },
  })

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const serviceMatch =
        selectedServiceIds.length === 0 || incident.affectedServiceIds.some((id) => selectedServiceIds.includes(id))
      return serviceMatch
    })
  }, [incidents, selectedServiceIds])

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-2'>
            <Siren className='h-8 w-8 text-muted-foreground' /> Incidents
          </h1>
          <p className='text-muted-foreground mt-1'>View and manage incidents in your organization.</p>
        </div>
        <ServiceFilterPopover
          services={services}
          selectedServiceIds={selectedServiceIds}
          onChange={setSelectedServiceIds}
        />
      </div>

      {isLoading ? (
        <div className='text-muted-foreground text-center py-16'>Loading incidents...</div>
      ) : filteredIncidents.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center text-muted-foreground'>
          <CheckCircle className='w-10 h-10 text-green-500 mb-2' strokeWidth={2} />
          <h2 className='text-lg font-semibold text-foreground'>All clear! No incidents.</h2>
          <p className='text-sm mt-1'>Your systems are healthy and there are no active incidents.</p>
        </div>
      ) : (
        <IncidentTimeline
          incidents={filteredIncidents}
          onIncidentResolved={(updatedIncident) => {
            setIncidents((prev) => {
              const index = prev.findIndex((i) => i.id === updatedIncident.id)
              if (index !== -1) {
                const newData = structuredClone(prev)
                newData[index] = updatedIncident
                return newData
              }
              return prev
            })
          }}
        />
      )}
    </div>
  )
}
