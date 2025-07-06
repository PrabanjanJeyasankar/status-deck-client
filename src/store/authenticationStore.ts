import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  user_id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  organization_id: string
  organization_name: string
}

type AuthState = {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
