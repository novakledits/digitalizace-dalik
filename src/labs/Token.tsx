import { useEffect, useMemo, useState } from 'react'
import { Lab, Row, Field } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

const PRE: Record<string, string> = {
  cs: 'Umělá inteligence neumí číst slova, čte tokeny.',
  en: 'Artificial intelligence cannot read words, it reads tokens.',
  long: 'Nejneobvyklejší dezinformace nepřekvapivě rozhodovala o elektrifikaci.',
}
const COLORS = ['bg-t0', 'bg-t1', 'bg-t2', 'bg-t3', 'bg-t4', 'bg-t5']

function tokenize(s: string): string[] {
  const re = /\s*\p{L}+|\s*\d+|\s*[^\s\p{L}\d]|\s+/gu
  let m: RegExpExecArray | null
  let res: string[] = []
  while ((m = re.exec(s))) {
    const t = m[0]
    const lead = t.match(/^\s*/)![0]
    const w = t.slice(lead.length)
    if (w && /^\p{L}+$/u.test(w) && w.length > 6) {
      const parts: string[] = []
      let i = 0
      let first = true
      while (i < w.length) {
        const sz = first ? 5 : 4
        parts.push(w.slice(i, i + sz))
        i += sz
        first = false
      }
      if (parts.length > 1 && parts[parts.length - 1].length < 2) {
        const l = parts.pop()!
        parts[parts.length - 1] += l
      }
      parts[0] = lead + parts[0]
      res = res.concat(parts)
    } else res.push(t)
  }
  return res
}

export function Token() {
  const [text, setText] = useState(PRE.cs)
  const [touch, setTouch] = useState(0)
  const { mark } = useProgress()
  const tk = useMemo(() => tokenize(text), [text])
  useEffect(() => {
    if (touch >= 3) mark('token')
  }, [touch, mark])
  const change = (v: string) => {
    setText(v)
    setTouch((t) => t + 1)
  }
  const ratio = tk.length ? (text.length / tk.length).toFixed(1).replace('.', ',') : '0'
  return (
    <Lab
      id="token"
      title="Z čeho se skládá text"
      lead="Model nečte písmena ani celá slova. Čte tokeny, což jsou kousky textu. Napiš cokoli a podívej se, jak se rozpadne."
      take="Tokeny se platí a tokeny zaplňují kontext. Česky jich obvykle vyjde víc než anglicky, takže stejná myšlenka stojí víc."
      fine="Zjednodušená ukázka. Skutečné tokenizery dělí text jinak a každý model má svůj."
    >
      <Row className="mb-3">
        <Button variant="outline" onClick={() => change(PRE.cs)}>Česky</Button>
        <Button variant="outline" onClick={() => change(PRE.en)}>Anglicky</Button>
        <Button variant="outline" onClick={() => change(PRE.long)}>Dlouhá slova</Button>
      </Row>
      <Field>
        <Textarea aria-label="Text k rozdělení na tokeny" rows={3} value={text} onChange={(e) => change(e.target.value)} />
      </Field>
      <div aria-live="polite" className="min-h-[70px] rounded-md border bg-background p-3.5 font-mono text-[15px] leading-[2] break-words">
        {tk.length ? (
          tk.map((t, i) => (
            <span key={i} className={cn('rounded-[2px] px-px py-0.5 whitespace-pre-wrap transition-colors', COLORS[i % 6])}>
              {t}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">Napiš něco.</span>
        )}
      </div>
      <dl className="mt-3 flex flex-wrap gap-7">
        {[
          [tk.length, 'tokenů'],
          [text.length, 'znaků'],
          [ratio, 'znaků na token'],
        ].map(([v, l]) => (
          <div key={l as string} className="flex flex-col">
            <dd className="m-0 text-[28px] leading-tight font-bold tabular-nums">{v}</dd>
            <dt className="font-mono text-xs tracking-wider text-muted-foreground uppercase">{l}</dt>
          </div>
        ))}
      </dl>
    </Lab>
  )
}
