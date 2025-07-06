import { type ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return <div className='min-h-screen flex items-center justify-center bg-gray-100'>{children}</div>
}
