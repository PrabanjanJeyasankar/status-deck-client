import { create } from 'zustand'
import type { Service } from '@/types/serviceTypes'

interface ServiceState {
  services: Service[]
  setServices: (services: Service[]) => void
}

export const useServicesStore = create<ServiceState>((set) => ({
  services: [],
  setServices: (services) => set({ services }),
}))
