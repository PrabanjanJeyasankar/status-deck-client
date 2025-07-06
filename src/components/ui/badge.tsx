/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        success: 'border-none bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        warning: 'border-none bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',

        // ✅ New variants
        info: 'border-none bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        violet: 'border-none bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200',
        pink: 'border-none bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200',
        cyan: 'border-none bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
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
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'
  return <Comp data-slot='badge' className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
export type { BadgeVariant }
