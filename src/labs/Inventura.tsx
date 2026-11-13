import { useEffect, useState } from 'react'
import { Lab, Grid2, Field } from '@/components/bits'
import { Badge } from '@/components/ui/badge'
import { Input, NativeSelect, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProgress } from '@/lib/progress'

type R = { t: string; k: string; m: number }
const INIT: R[] = [
  { t: 'Přepisuju poznámky z různých míst do jednoho (příklad)', k: 'Událostní', m: 90 },
  { t: 'Každé pondělí třídím poštu a zapisuju úkoly (příklad)', k: 'Časový', m: 60 },
  { t: 'Pořád hledám starý odkaz nebo článek (příklad)', k: 'Nadávám', m: 45 },
  { t: '', k: 'Časový', m: 0 },
  { t: '', k: 'Časový', m: 0 },
]

export function Inventura() {
  const [rows, setRows] = useState<R[]>(INIT)
  const [changed, setChanged] = useState<number[]>([])
  const [hmw, setHmw] = useState<Record<number, string>>({})
  const { mark } = useProgress()
  useEffect(() => {
    if (changed.length >= 3) mark('inventura')
  }, [changed, mark])

  const upd = (i: number, patch: Partial<R>) => {
    setRows(rows.map((r, k) => (k === i ? { ...r, ...patch } : r)))
    if (patch.t !== undefined) setChanged((c) => (c.includes(i) ? c : [...c, i]))
  }
  const ranked = rows.map((r, i) => ({ ...r, i })).filter((r) => r.t.trim()).sort((a, b) => b.m - a.m)
  const tot = ranked.reduce((a, r) => a + r.m, 0)

  return (
    <Lab
      id="inventura"
      title="Inventura týdne"
      lead="Neměj nápad, dělej inventuru. Zapiš věci, které se opakují a které tě nebaví. Označ, co je spouští, a odhadni minuty za týden. Kandidát na výzvu je to, co žere nejvíc času. První tři řádky jsou příklady, přepiš je."
      take="Spouštěče jsou časové (co děláš každé pondělí), událostní (po tomhle e-mailu vždy tohle) a body, kde nadáváš. Nemusíš být originální, musíš být konkrétní."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b px-2.5 py-2 text-left font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">Co se opakuje</th>
              <th className="w-[170px] border-b px-2.5 py-2 text-left font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">Spouštěč</th>
              <th className="w-[110px] border-b px-2.5 py-2 text-left font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">Min. za týden</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="border-b px-2.5 py-2">
                  <Input aria-label={`Co se opakuje ${i + 1}`} value={r.t} placeholder="Co se ti opakuje a nebaví tě?" onChange={(e) => upd(i, { t: e.target.value })} />
                </td>
                <td className="border-b px-2.5 py-2">
                  <NativeSelect aria-label={`Spouštěč ${i + 1}`} value={r.k} onChange={(e) => upd(i, { k: e.target.value })}>
                    <option>Časový</option>
                    <option>Událostní</option>
                    <option>Nadávám</option>
                  </NativeSelect>
                </td>
                <td className="border-b px-2.5 py-2">
                  <Input aria-label={`Minuty za týden ${i + 1}`} type="number" min={0} value={r.m} onChange={(e) => upd(i, { m: parseInt(e.target.value, 10) || 0 })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Grid2 className="mt-3">
        <div>
          <b className="text-sm">Pořadí podle času</b>
          <div className="my-3 flex flex-col gap-2">
            {ranked.length ? (
              ranked.map((r, n) => (
                <div key={r.i} className="grid grid-cols-[36px_1fr_80px] gap-3 rounded-md border bg-background px-3 py-2.5 text-sm">
                  <div className="font-mono">{n + 1}.</div>
                  <div className="min-w-0">
                    {r.t} <Badge>{r.k}</Badge>
                  </div>
                  <div className="text-right font-mono">{r.m} min</div>
                </div>
              ))
            ) : (
              <p className="text-[12.5px] text-muted-foreground">Zatím nic nezapsáno.</p>
            )}
          </div>
          {ranked.length > 0 && (
            <p className="text-[12.5px] text-muted-foreground">
              Dohromady {(tot / 60).toFixed(1).replace('.', ',')} hodiny týdně, to je asi {Math.round((tot / 60) * 40)} hodin za čtyřicet týdnů.
            </p>
          )}
        </div>
        <div>
          <b className="text-sm">Otázky „Jak bychom mohli“ pro první tři</b>
          <div className="mt-2">
            {ranked.slice(0, 3).map((r) => (
              <Field key={r.i}>
                <Label htmlFor={`iv-h-${r.i}`}>{r.t.replace(' (příklad)', '')}</Label>
                <Textarea id={`iv-h-${r.i}`} rows={2} placeholder="Jak bych mohl využít AI, aby …?" value={hmw[r.i] || ''} onChange={(e) => setHmw({ ...hmw, [r.i]: e.target.value })} />
              </Field>
            ))}
          </div>
        </div>
      </Grid2>
    </Lab>
  )
}
