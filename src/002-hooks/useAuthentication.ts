import { login, signup } from '@/001-services/authentication'
import { useAuthStore } from '@/store/authenticationStore'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => setUser(user),
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail?: string }
      const message = data?.detail || error.message || 'Login failed, please try again.'
      toast.error(message)
    },
  })
}

export function useSignup() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: signup,
    onSuccess: (user) => setUser(user),
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail?: string }
      const message = data?.detail || error.message || 'Signup failed, please try again.'
      toast.error(message)
    },
  })
}
