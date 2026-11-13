import { useEffect, useState } from 'react'
import { Lab, Row, Grid2, Fine, BigNumber } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

export function Reliab() {
  const [n, setN] = useState(10)
  const [p, setP] = useState(95)
  const [touched, setTouched] = useState(false)
  const { mark } = useProgress()
  useEffect(() => {
    if (touched) mark('reliab')
  }, [touched, mark])
  const set = (nn: number, pp: number) => {
    setN(nn)
    setP(pp)
    setTouched(true)
  }
  const r = Math.pow(p / 100, n) * 100
  return (
    <Lab
      id="reliab"
      title="Spolehlivost řetězce"
      lead="Každý krok agenta může selhat. Chyby se násobí. Nastav počet kroků a úspěšnost jednoho kroku."
      take="Podle osnovy spotřebují agentní běhy řádově čtyřikrát víc tokenů než běžná konverzace a multiagentní architektury kolem patnáctkrát víc. K tomu desítky sekund čekání. Agent dává smysl, když je další krok závislý na předchozím, cest je moc, existuje zpětná vazba na kvalitu, cena chyby je únosná a úloha unese cenu agenta. Všech pět najednou."
    >
      <Grid2>
        <div>
          <Label htmlFor="rl-n">
            Počet kroků: <span className="font-mono">{n}</span>
          </Label>
          <Slider id="rl-n" min={1} max={20} step={1} value={[n]} aria-label="Počet kroků" onValueChange={(v) => set(v[0], p)} />
          <Label htmlFor="rl-p" className="mt-3">
            Úspěšnost jednoho kroku: <span className="font-mono">{p}</span> %
          </Label>
          <Slider id="rl-p" min={70} max={100} step={1} value={[p]} aria-label="Úspěšnost jednoho kroku" onValueChange={(v) => set(n, v[0])} />
          <Row className="mt-3">
            <Button variant="outline" onClick={() => set(10, 95)}>10 × 95 %</Button>
            <Button variant="outline" onClick={() => set(10, 90)}>10 × 90 %</Button>
            <Button variant="outline" onClick={() => set(3, 95)}>3 × 95 %</Button>
          </Row>
        </div>
        <div>
          <Fine className="m-0">Celý řetězec projde bez chyby v</Fine>
          <BigNumber>{r >= 10 ? Math.round(r) : r.toFixed(1).replace('.', ',')} %</BigNumber>
          <Fine className="mt-1.5">Sloupce ukazují, jak úspěšnost klesá s každým dalším krokem.</Fine>
        </div>
      </Grid2>
      <div role="img" aria-label="Pokles úspěšnosti řetězce podle počtu kroků" className="mt-3 flex h-[130px] items-end gap-[3px] border-b">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((k) => (
          <i
            key={k}
            className={cn('min-w-0 flex-1 bg-secondary transition-[height] duration-300 ease-out', k === n && 'bg-primary')}
            style={{ height: `${Math.pow(p / 100, k) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>1 krok</span>
        <span>20 kroků</span>
      </div>
    </Lab>
  )
}
