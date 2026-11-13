import * as React from 'react'
import { cn } from '@/lib/utils'

const field =
  'w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-[15px] text-foreground transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:opacity-50'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <input type={type} data-slot="input" className={cn(field, 'h-9', className)} {...props} />
}
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(field, 'min-h-16 resize-y', className)} {...props} />
}
function NativeSelect({ className, ...props }: React.ComponentProps<'select'>) {
  return <select data-slot="select" className={cn(field, 'h-9', className)} {...props} />
}

export { Input, Textarea, NativeSelect }
