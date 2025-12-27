import { Logo } from '@/components/Logo'
import { type Variants, motion } from 'framer-motion'

interface PageHeaderProps {
  variants: Variants
}

export function PageHeader({ variants }: PageHeaderProps) {
  return (
    <motion.div
      variants={variants}
      className='flex items-center justify-between'>
      <div className='flex items-center justify-baseline gap-2 text-white'>
        <a href='/' className='flex items-center font-medium'>
          <div className='flex size-8 items-center justify-center rounded-none '>
            <Logo size={10} color='#ffffff' />
          </div>
          <span className='text-base font-semibold tracking-tight'>
            Status Deck
          </span>
        </a>
        <span className='text-xs text-white/50'>
          | API health monitoring app
        </span>
      </div>
    </motion.div>
  )
}
