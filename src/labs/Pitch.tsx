import { useEffect, useRef, useState } from 'react'
import { Lab, Grid2, Field, Note, Row, Fine } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

const SEG: [string, number][] = [
  ['Problém, na kterém záleží', 150],
  ['Řešení a ukázka', 240],
  ['Důkaz, že to funguje', 120],
  ['Co dál a co chceš po publiku', 90],
]
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function Pitch() {
  const [v, setV] = useState({ and: '', but: '', thr: '', ask: '' })
  const [left, setLeft] = useState(600)
  const [running, setRunning] = useState(false)
  const iv = useRef<number | undefined>(undefined)
  const { mark } = useProgress()
  const full = !!(v.and.trim() && v.but.trim() && v.thr.trim() && v.ask.trim())
  const num = /\d/.test(v.thr)
  useEffect(() => {
    if (full && num) mark('pitch')
  }, [full, num, mark])

  useEffect(() => {
    if (!running) return
    iv.current = window.setInterval(() => setLeft((l) => l - 1), 1000)
    return () => window.clearInterval(iv.current)
  }, [running])
  useEffect(() => {
    if (left <= 0) setRunning(false)
  }, [left])

  const elapsed = 600 - left
  let acc = 0
  return (
    <Lab
      id="pitch"
      title="Pitch: příběh a časomíra"
      lead="Pitch není obhajoba, je to prodej. Základ je struktura AND, BUT, THEREFORE a konkrétní žádost na konci. V THEREFORE musí být číslo. Bez něj je to nápad, s ním je to nabídka."
      take="Ukaž prototyp naživo, místo abys ho popisoval. Přiznaná slabina působí důvěryhodněji než dokonalý obrázek a stejně se na ni někdo zeptá. Pitch, který končí poděkováním, nic neprodal."
    >
      <Grid2>
        <div>
          <Field>
            <Label htmlFor="pi-and">AND <small className="font-normal text-muted-foreground">kontext a současný stav</small></Label>
            <Textarea id="pi-and" rows={2} placeholder="Ve firmě máme spoustu interních metodik a každý s nimi denně pracuje." value={v.and} onChange={(e) => setV({ ...v, and: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="pi-but">BUT <small className="font-normal text-muted-foreground">kde je problém a co stojí</small></Label>
            <Textarea id="pi-but" rows={2} placeholder="Lidé v nich netráví čas hledáním, ptají se kolegů, což stojí dvě hodiny týdně na každého seniora." value={v.but} onChange={(e) => setV({ ...v, but: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="pi-thr">THEREFORE <small className="font-normal text-muted-foreground">co jsi postavil, s číslem</small></Label>
            <Textarea id="pi-thr" rows={2} placeholder="Postavili jsme agenta, který v pilotu odbavil 40 z 50 dotazů bez zásahu člověka." value={v.thr} onChange={(e) => setV({ ...v, thr: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="pi-ask">Žádost na publikum</Label>
            <Input id="pi-ask" placeholder="Např. pusťte nás do pilotu na jednom oddělení" value={v.ask} onChange={(e) => setV({ ...v, ask: e.target.value })} />
          </Field>
          {!full ? (
            <Note>Vyplň všechny čtyři části.</Note>
          ) : !num ? (
            <Note tone="warn">V THEREFORE chybí číslo. Doplň výsledek z vlastního testování.</Note>
          ) : (
            <Note tone="ok">Příběh je celý, má číslo a končí žádostí.</Note>
          )}
        </div>
        <div>
          <b>Časomíra na 10 minut</b>
          <Fine className="mt-1 mb-2">Rozdělení je návrh. Po pitchi následuje 5 minut otázek.</Fine>
          <div className="font-mono text-5xl font-medium tabular-nums">{fmt(Math.max(0, left))}</div>
          <div className="my-3 flex flex-col gap-2">
            {SEG.map(([name, len]) => {
              const start = acc
              acc += len
              const on = running && left > 0 && elapsed >= start && elapsed < acc
              return (
                <div
                  key={name}
                  className={cn('grid grid-cols-[1fr_56px] gap-3 rounded-md border bg-background px-3 py-2.5 text-sm transition-colors duration-300', on && 'border-primary bg-accent')}
                >
                  <div>{name}</div>
                  <div className="text-right font-mono">{fmt(len)}</div>
                </div>
              )
            })}
          </div>
          <Row>
            <Button
              onClick={() => {
                if (!running && left <= 0) setLeft(600)
                setRunning((r) => !r)
              }}
            >
              {running ? 'Pauza' : 'Start'}
            </Button>
            <Button variant="outline" onClick={() => { setRunning(false); setLeft(600) }}>Znovu</Button>
          </Row>
        </div>
      </Grid2>
    </Lab>
  )
}
