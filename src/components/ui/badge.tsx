/* eslint-disable react-refresh/only-export-components */
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-none border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-white/10 bg-white/5 text-white/70 [a&]:hover:bg-white/10',
        secondary:
          'border-white/10 bg-white/5 text-white/70 [a&]:hover:bg-white/10',
        destructive:
          'border-rose-500/30 bg-rose-500/15 text-rose-200 [a&]:hover:bg-rose-500/25 focus-visible:ring-rose-500/30',
        outline: 'border-white/20 text-white/70 [a&]:hover:bg-white/10',
        success:
          'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 [a&]:hover:bg-emerald-500/25',
        warning:
          'border-amber-400/30 bg-amber-400/15 text-amber-100 [a&]:hover:bg-amber-400/25',
        info: 'border-blue-400/30 bg-blue-400/15 text-blue-100 [a&]:hover:bg-blue-400/25',
        violet:
          'border-violet-400/30 bg-violet-400/15 text-violet-100 [a&]:hover:bg-violet-400/25',
        pink: 'border-pink-400/30 bg-pink-400/15 text-pink-100 [a&]:hover:bg-pink-400/25',
        cyan: 'border-cyan-400/30 bg-cyan-400/15 text-cyan-100 [a&]:hover:bg-cyan-400/25',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
export type { BadgeVariant }
