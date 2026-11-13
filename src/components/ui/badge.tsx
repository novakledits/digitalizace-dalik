import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.07em] whitespace-nowrap uppercase',
  {
    variants: {
      variant: {
        default: 'bg-accent text-foreground',
        ok: 'bg-ok-soft text-ok',
        bad: 'bg-bad-soft text-bad',
        warn: 'bg-warn-soft text-warn',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
