import { useEffect, useState } from 'react'
import { Lab, Note, Fine } from '@/components/bits'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

const M: [string, string, number][] = [
  ['uživatel', 'Pracuju v malé firmě, vyrábíme dřevěné hračky.', 14],
  ['AI', 'Díky. S čím ti můžu pomoct?', 9],
  ['uživatel', 'Chci automatizovat odpovědi na e-maily zákazníků.', 13],
  ['AI', 'Dobrý nápad. Začni tím, že si projdeš, na co se zákazníci ptají nejčastěji, a rozdělíš dotazy do skupin. Pro každou skupinu pak připravíš šablonu odpovědi.', 48],
  ['uživatel', 'Většinou se ptají na doručení.', 9],
  ['AI', 'Pak stačí jedna dobrá šablona o termínech a sledování zásilky.', 22],
  ['uživatel', 'Napiš první větu odpovědi a připomeň mi, co vlastně vyrábíme.', 16],
]
const TOTAL = M.reduce((a, m) => a + m[2], 0)

export function Context() {
  const [cap, setCap] = useState(90)
  const [touched, setTouched] = useState(false)
  const { mark } = useProgress()
  useEffect(() => {
    if (touched) mark('context')
  }, [touched, mark])

  let used = 0
  const inside = new Array(M.length).fill(false)
  for (let i = M.length - 1; i >= 0; i--) {
    if (used + M[i][2] <= cap) {
      used += M[i][2]
      inside[i] = true
    } else break
  }

  return (
    <Lab
      id="context"
      title="Kontext je paměť s limitem"
      lead="Model vidí jen to, co se vejde do kontextového okna. Posuň okno a sleduj, co se stane s první zprávou."
      take="Co se nevejde do kontextu, model nevidí. Důležité věci patří na začátek zadání nebo se musí připomenout. Dlouhá konverzace nezlepšuje výsledek automaticky."
      fine="Počty tokenů jsou ilustrativní."
    >
      <Label htmlFor="cx-cap">
        Velikost okna: <span className="font-mono">{cap}</span> tokenů
      </Label>
      <Slider
        id="cx-cap"
        min={20}
        max={160}
        step={1}
        value={[cap]}
        aria-label="Velikost okna"
        onValueChange={(v) => {
          setCap(v[0])
          setTouched(true)
        }}
      />
      <Progress value={Math.min(100, (used / cap) * 100)} className="my-1.5" />
      <Fine className="mb-2.5">
        V okně: {used} z {cap} tokenů. Celá konverzace má {TOTAL}.
      </Fine>
      <div className="flex flex-col gap-1.5">
        {M.map((m, i) => (
          <div
            key={i}
            className={cn(
              'grid grid-cols-[62px_1fr_46px] items-start gap-2.5 rounded-md border bg-background px-2.5 py-2 text-sm transition-opacity duration-200',
              !inside[i] && 'line-through decoration-bad opacity-40',
            )}
          >
            <span className="pt-0.5 font-mono text-[11px] font-medium text-muted-foreground uppercase">{m[0]}</span>
            <span>{m[1]}</span>
            <span className="text-right font-mono text-xs text-muted-foreground">{m[2]} tok.</span>
          </div>
        ))}
      </div>
      <div className="mt-3">
        {!inside[M.length - 1] ? (
          <Note tone="bad">Ani poslední zpráva se nevešla. Model nemá co zpracovat.</Note>
        ) : inside[0] ? (
          <Note tone="ok">
            <b>AI:</b> „Dobrý den, děkujeme za dotaz. Naše dřevěné hračky odesíláme do dvou pracovních dnů.“ Vyrábíte dřevěné hračky.
          </Note>
        ) : (
          <Note tone="bad">
            <b>AI:</b> „Dobrý den, děkujeme za dotaz.“ Co vyrábíte, nevím. První zpráva se do okna nevešla, takže ji model nevidí. Můžu hádat, nebo se zeptat.
          </Note>
        )}
      </div>
    </Lab>
  )
}
