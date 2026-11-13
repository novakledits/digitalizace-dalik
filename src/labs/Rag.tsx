import { useEffect, useRef, useState } from 'react'
import { Lab, Row, Grid2, Panel } from '@/components/bits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/lib/progress'
import { cn, reducedMotion } from '@/lib/utils'

const DOCS: [string, string][] = [
  ['Metodika reklamací', 'Reklamaci vyřídíme do 20 dnů od přijetí. Zákazník ji hlásí formulářem na webu.'],
  ['Dovolená', 'Dovolenou žádá zaměstnanec u nadřízeného nejpozději 14 dnů předem.'],
  ['Cestovní náhrady', 'Služební cesty schvaluje vedoucí oddělení. Limit na ubytování je 2 000 Kč za noc.'],
  ['Expedice', 'Objednávky přijaté do 14:00 expedujeme týž den.'],
]
const Q = [
  { q: 'Do kdy musíme vyřídit reklamaci?', doc: 0, plain: 'Obvykle to bývá 14 až 30 dní, ale přesně nevím, jak to máte nastavené ve firmě.', rag: 'Do 20 dnů od přijetí. (Zdroj: Metodika reklamací)' },
  { q: 'Kolik můžu utratit za hotel na služební cestě?', doc: 2, plain: 'To záleží na firmě. Často se limit pohybuje kolem 2 až 3 tisíc korun za noc.', rag: 'Limit na ubytování je 2 000 Kč za noc, cestu schvaluje vedoucí oddělení. (Zdroj: Cestovní náhrady)' },
  { q: 'Do kolika hodin musí přijít objednávka, aby šla ven dnes?', doc: 3, plain: 'Většina e-shopů expeduje týž den, když objednávka přijde dopoledne. Přesný čas nevím.', rag: 'Objednávky přijaté do 14:00 expedujeme týž den. (Zdroj: Expedice)' },
  { q: 'Kdo je ředitelem firmy?', doc: -1, plain: 'Ředitelem může být například pan Novák.', rag: 'V dokumentech, ke kterým mám přístup, to není. Nechci hádat. Zeptej se na personálním oddělení.' },
]

export function Rag() {
  const [qi, setQi] = useState(0)
  const [on, setOn] = useState(false)
  const [step, setStep] = useState(-1)
  const [answered, setAnswered] = useState(false)
  const [runs, setRuns] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  const { mark } = useProgress()
  const q = Q[qi]
  const steps = on
    ? [['1 Otázka', 'Přijde dotaz.'], ['2 Hledání', 'Najdou se relevantní úryvky.'], ['3 Kontext', 'Úryvky se vloží do zadání.'], ['4 Odpověď', 'Model odpoví a uvede zdroj.']]
    : [['1 Otázka', 'Přijde dotaz.'], ['2 Odpověď', 'Model odpoví jen z toho, co se naučil.']]

  useEffect(() => () => window.clearTimeout(timer.current), [])
  useEffect(() => {
    if (runs >= 2) mark('rag')
  }, [runs, mark])

  const reset = () => {
    window.clearTimeout(timer.current)
    setStep(-1)
    setAnswered(false)
  }
  const run = () => {
    reset()
    const len = steps.length
    let k = 0
    setStep(0)
    const tick = () => {
      k++
      setStep(k)
      if (k >= len - 1) {
        timer.current = window.setTimeout(() => {
          setAnswered(true)
          setRuns((r) => r + 1)
        }, reducedMotion() ? 0 : 450)
        return
      }
      timer.current = window.setTimeout(tick, reducedMotion() ? 0 : 600)
    }
    timer.current = window.setTimeout(tick, reducedMotion() ? 0 : 500)
  }

  return (
    <Lab
      id="rag"
      title="RAG: odpověď z tvých dokumentů"
      lead="Model sám o tvé firmě nic neví. RAG před odpovědí najde v dokumentech relevantní úryvky, vloží je do kontextu a model odpovídá z nich. Vyber otázku, zapni a vypni dokumenty a porovnej."
      take="RAG nenatrénuje model znovu, jen mu před odpovědí podstrčí správné podklady. Dobrá odpověď má zdroj a umí přiznat, že v dokumentech nic není. To si ověř vždycky, zkus otázku, na kterou dokumenty odpověď nemají."
    >
      <Row className="mb-3">
        {Q.map((x, i) => (
          <Button
            key={x.q}
            variant={i === qi ? 'on' : 'outline'}
            className="h-auto max-w-full py-2 text-left"
            onClick={() => {
              setQi(i)
              reset()
            }}
          >
            {x.q}
          </Button>
        ))}
      </Row>
      <Row className="mb-3">
        <Button variant={!on ? 'on' : 'outline'} onClick={() => { setOn(false); reset() }}>Bez dokumentů</Button>
        <Button variant={on ? 'on' : 'outline'} onClick={() => { setOn(true); reset() }}>S dokumenty (RAG)</Button>
        <Button onClick={run}>Spustit</Button>
      </Row>
      <div className="my-3 flex flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s[0]}
            className={cn(
              'flex-[1_1_120px] rounded-md border bg-background px-2.5 py-2 text-[13px] text-muted-foreground transition-colors duration-300',
              i <= step && 'border-primary bg-accent text-foreground',
            )}
          >
            <b className="block font-mono text-[11px] tracking-wider uppercase">{s[0]}</b>
            {s[1]}
          </div>
        ))}
      </div>
      <Grid2>
        <div>
          <b className="text-sm">Dokumenty firmy (vymyšlený příklad)</b>
          <div className="my-3 flex flex-col gap-2">
            {DOCS.map((d, i) => (
              <div
                key={d[0]}
                className={cn(
                  'rounded-md border bg-background px-2.5 py-2 text-[13px] transition-all duration-300',
                  !on && 'opacity-45',
                  on && step >= 1 && q.doc === i && 'border-ok bg-ok-soft',
                )}
              >
                <b className="block font-mono text-xs">{d[0]}</b>
                {d[1]}
              </div>
            ))}
          </div>
        </div>
        <div>
          <b className="text-sm">Odpověď</b>
          <Panel className="mt-2 min-h-[110px]">
            {!answered && <span className="text-muted-foreground">{step < 0 ? 'Klikni na Spustit.' : '…'}</span>}
            {answered && on && (
              <>
                <Badge variant={q.doc >= 0 ? 'ok' : 'warn'}>{q.doc >= 0 ? 'ze zdroje' : 'přiznává, že neví'}</Badge>
                <p className="mt-2">{q.rag}</p>
              </>
            )}
            {answered && !on && (
              <>
                <Badge variant="bad">hádá</Badge>
                <p className="mt-2">{q.plain}</p>
              </>
            )}
          </Panel>
        </div>
      </Grid2>
    </Lab>
  )
}
