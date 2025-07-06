import { create } from 'zustand'

interface IncidentNotificationState {
  hasNewIncident: boolean
  setHasNewIncident: (value: boolean) => void
}

export const useIncidentNotificationStore = create<IncidentNotificationState>((set) => ({
  hasNewIncident: false,
  setHasNewIncident: (value) => set({ hasNewIncident: value }),
}))
