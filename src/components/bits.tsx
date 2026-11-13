import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProgress } from '@/lib/progress'

export function Lab({
  id,
  title,
  lead,
  take,
  fine,
  children,
}: {
  id: string
  title: string
  lead?: ReactNode
  take?: ReactNode
  fine?: ReactNode
  children: ReactNode
}) {
  const { done } = useProgress()
  const d = !!done[id]
  return (
    <Card id={id} className={cn('mb-5 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_8px_24px_rgba(10,40,36,0.08)]', d && 'border-ok/50')}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {d && <Badge variant="ok">Hotovo</Badge>}
      </CardHeader>
      <CardContent>
        {lead && <p className="mb-4 max-w-[68ch] text-muted-foreground">{lead}</p>}
        {children}
        {take && (
          <p className="mt-4 max-w-[68ch] border-t pt-3">
            <b>Co si odnést.</b> {take}
          </p>
        )}
        {fine && <p className="mt-2 text-[12.5px] text-muted-foreground">{fine}</p>}
      </CardContent>
    </Card>
  )
}

const tones = {
  default: 'bg-secondary',
  ok: 'bg-ok-soft',
  bad: 'bg-bad-soft',
  warn: 'bg-warn-soft',
}
export function Note({ tone = 'default', className, children }: { tone?: keyof typeof tones; className?: string; children: ReactNode }) {
  return <div className={cn('rounded-md px-3 py-2.5 text-sm', tones[tone], className)}>{children}</div>
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-md border bg-background p-3.5', className)}>{children}</div>
}

export function Field({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mb-3', className)}>{children}</div>
}

export function Row({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
}

export function Grid2({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('grid grid-cols-2 gap-5 max-md:grid-cols-1 [&>*]:min-w-0', className)}>{children}</div>
}

export function Pre({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <pre className={cn('m-0 overflow-x-auto rounded-md border bg-background p-3 font-mono text-[13px] leading-normal', className)}>{children}</pre>
  )
}

export function Fine({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[12.5px] text-muted-foreground', className)}>{children}</p>
}

export function BigNumber({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('text-[56px] leading-none font-bold tabular-nums max-sm:text-[44px]', className)}>{children}</div>
}
