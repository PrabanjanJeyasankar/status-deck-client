import type { IncidentRead } from '@/types/incidentTypes'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface IncidentsStore {
  incidents: IncidentRead[]
  fetchIncidents: (organizationId: string) => Promise<void>
  addIncident: (incident: IncidentRead) => void
  updateIncident: (incident: IncidentRead) => void
}

export const useIncidentsStore = create<IncidentsStore>()(
  devtools((set) => ({
    incidents: [],
    fetchIncidents: async (organizationId) => {
      try {
        const response = await fetch(`/api/incidents?organizationId=${organizationId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch incidents')
        }
        const data: IncidentRead[] = await response.json()
        set({ incidents: data })
      } catch (error) {
        console.error('[useIncidentsStore] fetchIncidents error:', error)
      }
    },
    addIncident: (incident) => {
      set((state) => ({
        incidents: [incident, ...state.incidents],
      }))
    },
    updateIncident: (incident) => {
      set((state) => ({
        incidents: state.incidents.map((i) => (i.id === incident.id ? incident : i)),
      }))
    },
  }))
)
