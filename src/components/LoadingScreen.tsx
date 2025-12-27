import { Logo } from '@/components/Logo'
import clsx from 'clsx'
import { Loader } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
  className?: string
}

export function LoadingScreen({
  message = 'Loading...',
  className = '',
}: LoadingScreenProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center min-h-screen text-muted-foreground',
        className
      )}>
      <Loader className='w-5 h-5 animate-spin mb-4' />
      <span>{message}</span>

      <div className='flex flex-col items-center gap-1 mt-12'>
        <div className='flex items-center'>
          <div className='flex size-6 items-center justify-center rounded-none'>
            <Logo size={10} />
          </div>
          <div className='text-lg font-semibold mr-2'>Status Deck. </div>
        </div>
        <div className='text-sm mt-0.5 text-muted-foreground'>
          {' '}
          API health monitoring app
        </div>
      </div>
    </div>
  )
}
