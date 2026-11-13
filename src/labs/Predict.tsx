import { useEffect, useState } from 'react'
import { Lab, Row, Grid2, Note, Fine } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useProgress } from '@/lib/progress'

const P = [
  { name: 'Hlavní město Francie je', q: 'Hlavní město Francie je', fake: false, o: [['Paříž', 9], ['Lyon', 4.4], ['Marseille', 3.6], ['Londýn', 3.2], ['krásné', 2.8]] as [string, number][] },
  { name: 'Kniha, která neexistuje', q: 'Autorem knihy „Zapomenuté pravdy o rybníkářství“ je', fake: true, o: [['Jan Novotný', 3.2], ['Josef Černý', 3.0], ['Petr Svoboda', 2.9], ['Karel Dvořák', 2.7], ['neznámý', 1.8]] as [string, number][] },
  { name: 'Snídaně', q: 'Dnes jsem si k snídani dal', fake: false, o: [['chleba', 3.1], ['kávu', 2.9], ['vejce', 2.6], ['müsli', 2.2], ['sushi', 0.6]] as [string, number][] },
]

export function Predict() {
  const [cur, setCur] = useState(0)
  const [T, setT] = useState(1)
  const [n, setN] = useState(0)
  const [pick, setPick] = useState<{ w: string; k: number } | null>(null)
  const { mark } = useProgress()
  useEffect(() => {
    if (n >= 3) mark('predict')
  }, [n, mark])

  const p = P[cur]
  const ex = p.o.map((x) => Math.exp(x[1] / T))
  const s = ex.reduce((a, b) => a + b, 0)
  const probs = ex.map((e) => e / s)

  const go = () => {
    const r = Math.random()
    let acc = 0
    let k = 0
    for (; k < probs.length - 1; k++) {
      acc += probs[k]
      if (r < acc) break
    }
    setPick({ w: p.o[k][0], k })
    setN((v) => v + 1)
  }

  return (
    <Lab
      id="predict"
      title="Model hádá další slovo"
      lead="Model ke každému možnému pokračování přiřadí pravděpodobnost a jedno vybere. Teplota určuje, jak moc smí sáhnout vedle nejpravděpodobnějšího. Vyber větu, nastav teplotu a vygeneruj aspoň tři slova."
      take="Když model látku zná, je rozdělení špičaté. Když ji nezná, je ploché, ale slovo vybrat musí. Tomu se říká halucinace: věrohodně znějící odpověď, která není pravdivá. Rozdíl nepoznáš z tónu odpovědi, jen z ověření."
      fine="Ilustrativní čísla. Nevznikla z reálného modelu."
    >
      <Row className="mb-3">
        {P.map((x, i) => (
          <Button
            key={x.name}
            variant={i === cur ? 'on' : 'outline'}
            onClick={() => {
              setCur(i)
              setPick(null)
            }}
          >
            {x.name}
          </Button>
        ))}
      </Row>
      <Grid2>
        <div>
          <div className="rounded-md border bg-background px-3.5 py-3 text-lg">
            {p.q} <b className="rounded-[3px] bg-accent px-1.5">{pick ? pick.w : '…'}</b>
          </div>
          <div className="my-3 flex flex-col gap-1.5">
            {p.o.map((x, i) => (
              <div key={x[0]} className="grid grid-cols-[130px_1fr_52px] items-center gap-2.5 text-sm max-sm:grid-cols-[90px_1fr_48px]">
                <span>{x[0]}</span>
                <span className="h-[18px] overflow-hidden rounded-[2px] bg-secondary">
                  <i className="block h-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${probs[i] * 100}%` }} />
                </span>
                <span className="text-right font-mono text-[13px] tabular-nums">{(probs[i] * 100).toFixed(0)} %</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="pr-t">
            Teplota: <span className="font-mono">{T.toFixed(1)}</span>
          </Label>
          <Slider id="pr-t" min={0.2} max={3} step={0.1} value={[T]} onValueChange={(v) => setT(v[0])} aria-label="Teplota" />
          <Row className="my-3">
            <Button onClick={go}>Vygeneruj slovo</Button>
            {n > 0 && <Fine className="m-0">Vygenerováno slov: {n}</Fine>}
          </Row>
          {!pick && <Note>Zatím jsi nic nevygeneroval.</Note>}
          {pick && p.fake && (
            <Note tone="bad">
              Kniha neexistuje, ale model musí vybrat nějaké jméno. Vybral „{pick.w}“ a zní to věrohodně. To je halucinace.
            </Note>
          )}
          {pick && !p.fake && pick.k === 0 && <Note tone="ok">Nejpravděpodobnější volba. Při nízké teplotě to padá skoro vždy.</Note>}
          {pick && !p.fake && pick.k !== 0 && <Note tone="warn">Model sáhl vedle nejpravděpodobnější volby. S vyšší teplotou se to děje častěji.</Note>}
        </div>
      </Grid2>
    </Lab>
  )
}
