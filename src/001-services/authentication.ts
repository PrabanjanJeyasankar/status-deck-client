import type { User } from '@/types'
import axiosInstance from '../utils/axiosInstance'

export async function login(payload: { email: string; password: string }): Promise<User> {
  const response = await axiosInstance.post('/login', payload)
  return response.data
}

export async function signup(payload: { email: string; password: string; name: string }): Promise<User> {
  const response = await axiosInstance.post('/signup', payload)
  return response.data
}
