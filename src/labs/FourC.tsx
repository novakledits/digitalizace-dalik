import { useEffect, useMemo, useState } from 'react'
import { Lab, Note } from '@/components/bits'
import { useProgress } from '@/lib/progress'
import { cn, shuffle } from '@/lib/utils'

const C = [
  ['Context', 'Co agent ví: instrukce, dokumenty, příklady.'],
  ['Connections', 'Kam vidí a kam smí psát: kalendář, tabulka, mail.'],
  ['Capabilities', 'Co umí udělat. Co je nevratné, jde přes potvrzení.'],
  ['Cadence', 'Kdy se spustí: ručně, na událost, podle času.'],
]

export function FourC() {
  const order = useMemo(() => shuffle([0, 1, 2, 3]), [])
  const [next, setNext] = useState(0)
  const [ord, setOrd] = useState<Record<number, number>>({})
  const [wrong, setWrong] = useState<number | null>(null)
  const { mark } = useProgress()
  useEffect(() => {
    if (next === 4) mark('fourc')
  }, [next, mark])

  const click = (k: number) => {
    if (ord[k]) return
    if (k === next) {
      setOrd({ ...ord, [k]: next + 1 })
      setNext(next + 1)
      setWrong(null)
    } else {
      setWrong(k)
      window.setTimeout(() => setWrong(null), 300)
    }
  }
  return (
    <Lab
      id="fourc"
      title="Čtyři C v pořadí"
      lead="Pokud ti z rozhodovací brány agent vyšel, stavíš ho v pevném pořadí. Klikej na karty tak, jak je postavíš. Správné pořadí zjistíš zkusmo."
      take="Nejčastější chyba je nasadit connections před contextem. Vznikne agent, který má přístup ke všemu a neví, co je důležité. Co je nevratné, řeš s potvrzením."
    >
      <div className="my-3 grid grid-cols-4 gap-2 max-md:grid-cols-2">
        {order.map((k) => (
          <button
            key={k}
            onClick={() => click(k)}
            className={cn(
              'min-w-0 cursor-pointer rounded-md border bg-background p-3 text-left transition-all duration-200 hover:-translate-y-px hover:border-primary',
              ord[k] && 'opacity-55',
              wrong === k && 'shake',
            )}
          >
            {ord[k] && <span className="mb-1.5 inline-block rounded-[3px] bg-primary px-1.5 font-mono text-xs text-primary-foreground">{ord[k]}</span>}
            <b className="block text-[17px]">{C[k][0]}</b>
            <span className="text-[13px] text-muted-foreground">{C[k][1]}</span>
          </button>
        ))}
      </div>
      {wrong !== null && <Note tone="bad">Tohle ještě není na řadě. Zeptej se, co musí agent vědět dřív, než mu dáš přístup k čemukoli.</Note>}
      {next === 4 && (
        <Note tone="ok">
          <b>Správně.</b> Context, Connections, Capabilities, Cadence. Nejdřív agent ví, co je důležité, pak teprve kam smí.
        </Note>
      )}
    </Lab>
  )
}
