import { useEffect, useState } from 'react'
import { Lab, Row, Grid2, Pre, Note } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/lib/progress'

const R = [
  { id: 'GET /sklad/1001', code: 200, body: '{\n  "id": 1001,\n  "polozka": "Dřevěný vláček",\n  "skladem": 24\n}' },
  { id: 'GET /sklad/1002', code: 200, body: '{\n  "id": 1002,\n  "polozka": "Dřevěné kostky",\n  "skladem": 0\n}' },
  { id: 'GET /sklad/9999', code: 404, body: '{\n  "chyba": "Položka nenalezena"\n}' },
]

export function Api() {
  const [sel, setSel] = useState<number | null>(null)
  const [used, setUsed] = useState<number[]>([])
  const { mark } = useProgress()
  useEffect(() => {
    if (used.length >= 3) mark('api')
  }, [used, mark])
  const r = sel === null ? null : R[sel]
  return (
    <Lab
      id="api"
      title="API: jak se programy žádají o práci"
      lead="API je dohodnuté rozhraní, přes které jeden program požádá druhý o data nebo akci. Skript, workflow i agent používají API stejně: pošlou žádost a dostanou strukturovanou odpověď. Zkus tři žádosti na vymyšlený sklad."
      take="Spouštěče jsou časové (každé pondělí) nebo událostní (přišel tenhle e-mail). Co se spustí, většinou volá API. Čím předvídatelnější odpověď, tím méně potřebuješ AI."
    >
      <Row className="mb-3">
        {R.map((x, i) => (
          <Button
            key={x.id}
            variant={sel === i ? 'on' : 'outline'}
            onClick={() => {
              setSel(i)
              setUsed((u) => (u.includes(i) ? u : [...u, i]))
            }}
          >
            {x.id}
          </Button>
        ))}
      </Row>
      <Grid2>
        <div>
          <b className="text-sm">Žádost</b>
          <Pre className="mt-1.5">{r ? `${r.id} HTTP/1.1\nHost: sklad.priklad.cz\nAuthorization: Bearer <klíč z úložiště hesel>` : 'Vyber žádost.'}</Pre>
        </div>
        <div>
          <b className="text-sm">Odpověď</b>
          <Pre className="mt-1.5">{r ? `Stav ${r.code}${r.code === 200 ? ' OK' : ' Nenalezeno'}\n${r.body}` : ' '}</Pre>
        </div>
      </Grid2>
      <Note tone="warn" className="mt-3">
        Přístupové klíče a hesla k API nikdy nepiš přímo do kódu, který posíláš modelu nebo nahráváš na veřejný repozitář.
      </Note>
    </Lab>
  )
}
