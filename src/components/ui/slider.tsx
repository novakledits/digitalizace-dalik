import * as React from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

function Slider({ className, value, defaultValue, min = 0, max = 100, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = React.useMemo(() => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]), [value, defaultValue, min])
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn('relative flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50', className)}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className="relative h-2 w-full grow overflow-hidden rounded-sm bg-secondary">
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {values.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className="block size-5 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm transition-[box-shadow,transform] hover:scale-110 hover:ring-4 hover:ring-ring/20 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
