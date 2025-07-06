import { useAuthStore } from '@/store/authenticationStore'
import { Navigate, useLocation } from 'react-router-dom'

export function Protected({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((store) => store.user)
  const location = useLocation()

  if (!user) {
    localStorage.setItem('redirectTo', location.pathname + location.search)
    return <Navigate to='/login' replace />
  }

  return <>{children}</>
}
