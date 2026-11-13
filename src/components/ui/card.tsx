import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('flex min-w-0 flex-col gap-4 rounded-lg border bg-card py-6 text-card-foreground', className)}
      {...props}
    />
  )
}
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn('flex items-start justify-between gap-3 px-6 max-sm:px-4', className)} {...props} />
}
function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return <h3 data-slot="card-title" className={cn('text-[22px] leading-tight font-bold', className)} {...props} />
}
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6 max-sm:px-4', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }
