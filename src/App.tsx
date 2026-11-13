import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MODULES, TOTAL } from '@/content'
import { ProgressProvider, useProgress } from '@/lib/progress'
import { reducedMotion } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Glossary } from '@/Glossary'
import { Token } from '@/labs/Token'
import { Predict } from '@/labs/Predict'
import { Context } from '@/labs/Context'
import { Brief } from '@/labs/Brief'
import { Rag } from '@/labs/Rag'
import { Agent } from '@/labs/Agent'
import { Api } from '@/labs/Api'
import { Decide } from '@/labs/Decide'
import { Reliab } from '@/labs/Reliab'
import { FourC } from '@/labs/FourC'
import { Digi } from '@/labs/Digi'
import { Stake } from '@/labs/Stake'
import { Inventura } from '@/labs/Inventura'
import { Define } from '@/labs/Define'
import { TestLog } from '@/labs/TestLog'
import { Pitch } from '@/labs/Pitch'
import { Quiz } from '@/labs/Quiz'

const LABS: Record<string, ReactNode> = {
  token: <Token />, predict: <Predict />, context: <Context />, brief: <Brief />, rag: <Rag />,
  agent: <Agent />, api: <Api />, decide: <Decide />, reliab: <Reliab />, fourc: <FourC />,
  digi: <Digi />, stake: <Stake />,
  inventura: <Inventura />, define: <Define />, testlog: <TestLog />, pitch: <Pitch />,
  quiz: <Quiz />,
}

const gutter = 'mx-auto max-w-[1000px] pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]'

function useTween(target: number) {
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (reducedMotion()) {
      setShown(target)
      from.current = target
      return
    }
    const start = from.current
    let raf = 0
    let t0: number | null = null
    const step = (ts: number) => {
      if (t0 === null) t0 = ts
      const k = Math.min(1, (ts - t0) / 600)
      const e = 1 - Math.pow(1 - k, 3)
      const v = start + (target - start) * e
      setShown(v)
      from.current = v
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return Math.round(shown)
}

const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })

function Shell() {
  const { done, reset } = useProgress()
  const count = Object.keys(done).length
  const pct = Math.round((count / TOTAL) * 100)
  const shown = useTween(pct)
  const modDone = (labs: string[]) => labs.filter((l) => done[l]).length

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-30 bg-brand" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 bg-brand text-white">
        <div className={`${gutter} flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5`}>
          <div className="text-sm font-bold tracking-[0.08em] whitespace-nowrap uppercase">AI od nuly do sta</div>
          <nav aria-label="Moduly" className="flex min-w-0 flex-1 gap-1 overflow-x-auto max-md:order-3 max-md:basis-full">
            {MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => goto(m.id)}
                className="cursor-pointer rounded-sm px-2.5 py-1.5 text-xs font-semibold tracking-[0.04em] whitespace-nowrap text-white/80 uppercase transition-colors duration-200 hover:bg-white/15 hover:text-white"
              >
                {m.title} <span className="ml-1.5 font-mono text-[11px] text-white/65">{modDone(m.labs)}/{m.labs.length}</span>
              </button>
            ))}
          </nav>
          <div className="min-w-[4ch] text-right font-mono text-[15px] font-medium tabular-nums">{shown} %</div>
        </div>
        <Progress value={pct} className="h-1 rounded-none bg-white/20" indicatorClassName="bg-white" aria-label="Celkový postup" />
      </header>

      <main>
        <div className="bg-brand text-white">
          <div className={`${gutter} pt-11 pb-[88px]`}>
            <p className="rise mb-3.5 text-xs font-semibold tracking-[0.14em] text-white/75 uppercase">Studijní pomůcka k předmětu Digitalizace firmy</p>
            <h1 className="rise text-[clamp(40px,8vw,80px)] font-extrabold tracking-tight [animation-delay:.05s]">AI od nuly do sta</h1>
            <p className="rise mt-4 max-w-[62ch] text-lg text-white/90 [animation-delay:.12s]">
              Interaktivní průvodce umělou inteligencí a automatizací. Začneš u toho, z čeho se skládá text pro model, a skončíš u pitche, který něco prodá. U každého tématu si nejdřív něco zkusíš a pak se k tomu čte výklad.
            </p>
          </div>
        </div>

        <section className={`${gutter} relative -mt-[52px]`}>
          <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-[0_10px_30px_rgba(10,40,36,0.14)]">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="text-[56px] leading-none font-bold tabular-nums max-sm:text-[44px]">{shown} %</div>
              <div className="text-sm text-muted-foreground">Splněno {count} z {TOTAL} cvičení</div>
            </div>
            <Progress value={pct} className="mt-4 h-3.5" aria-label="Celkový postup" />
            <div className="mt-1.5 flex justify-between font-mono text-[11px] text-muted-foreground" aria-hidden>
              <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2 max-md:grid-cols-2">
              {MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => goto(m.id)}
                  className="flex min-w-0 cursor-pointer flex-col gap-0.5 rounded-md border bg-background p-2.5 text-left text-[13px] font-medium transition-all duration-200 hover:-translate-y-px hover:border-primary"
                >
                  {m.title}
                  <small className="font-mono text-[11px] font-normal text-muted-foreground">{modDone(m.labs)} z {m.labs.length} cvičení</small>
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            Obsah vychází z osnovy předmětu Digitalizace firmy (PEMBPDIF, akademický rok 2026/27, Ing. Dalibor Šimek, Ph.D.). Čísla a příklady označené jako ilustrativní jsou vymyšlené pro názornost.
          </p>
        </section>

        {MODULES.map((m, i) => (
          <section key={m.id} id={m.id} className={`${gutter} pt-12 pb-2`}>
            <div className="mb-6 grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-1 max-md:grid-cols-1">
              <div className="row-span-2 pt-2.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-primary uppercase max-md:row-auto max-md:p-0">Modul {i + 1}</div>
              <h2 className="text-[clamp(28px,5vw,40px)] font-bold">{m.title}</h2>
              <p className="max-w-[62ch] text-muted-foreground">{m.intro}</p>
            </div>
            {m.labs.map((l) => (
              <div key={l}>{LABS[l]}</div>
            ))}
          </section>
        ))}

        <Glossary />
      </main>

      <footer className={`${gutter} mt-10 border-t pt-10 pb-16 text-[13px] text-muted-foreground`}>
        <p>Studentský projekt, není oficiálním webem fakulty. Barevnost se inspiruje webem OPF SU.</p>
        <p className="mt-2">
          Postup uložen jen v tomto prohlížeči.{' '}
          <Button variant="link" size="sm" className="h-auto p-0 text-[13px]" onClick={reset}>Začít od nuly</Button>
        </p>
        <p className="mt-2">Web měří anonymní návštěvnost přes Vercel Web Analytics. Bez cookies a bez osobních údajů.</p>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  )
}
