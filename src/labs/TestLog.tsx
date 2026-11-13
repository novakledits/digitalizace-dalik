import { useEffect, useState } from 'react'
import { Lab, Grid2, Field, Note, Panel, Fine, BigNumber } from '@/components/bits'
import { Badge } from '@/components/ui/badge'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProgress } from '@/lib/progress'

export function TestLog() {
  const [n, setN] = useState(20)
  const [e, setE] = useState(3)
  const [chg, setChg] = useState('')
  const { mark } = useProgress()
  const errs = Math.min(e, n)
  const chgOk = chg.trim().length >= 8
  useEffect(() => {
    if (n > 0 && chgOk) mark('testlog')
  }, [n, chgOk, mark])

  const fb: ['ok' | 'warn' | 'bad', string][] = []
  if (n === 0) fb.push(['bad', 'Bez vstupů nemáš co tvrdit. Pusť to aspoň na dvacet reálných.'])
  else if (n < 20) fb.push(['warn', `Méně než 20 vstupů. Číslo je slabé, jedna chyba hýbe procenty o ${Math.round(100 / n)} bodů.`])
  else fb.push(['ok', 'Aspoň 20 vstupů, číslo se dá obhájit.'])
  if (n > 0 && errs === 0) fb.push(['warn', 'Nula chyb vypadá dobře, ale prověř, jestli jsi zkusil i divný vstup: prázdné pole, cizí jazyk, nesmysl.'])
  fb.push(chgOk ? ['ok', 'Změna po testu je zapsaná.'] : ['bad', 'Zatím žádná zapsaná změna. Test bez změny není test.'])

  return (
    <Lab
      id="testlog"
      title="Test, který něco dokazuje"
      lead="Prototyp, který nikdo kromě tebe nespustil, je nedokončený. Testuj na třech úrovních a zapisuj čísla. Předvyplněná čísla jsou příklad, přepiš je."
      take="U AI řešení měř navíc tři věci: jak často se plete na dvaceti reálných vstupech, co dělá, když neví, a co dělá s divným vstupem (prázdné pole, cizí jazyk, nesmysl). Selhání je materiál, ne ostuda."
    >
      <div className="mb-4 grid grid-cols-3 gap-2 max-md:grid-cols-1">
        {[
          ['Self-test', 'Použij to sám týden na svoje skutečné věci, ne na vymyšlený příklad.'],
          ['Peer-test', 'Dej to někomu jinému a mlč. Každé tvoje vysvětlení je funkce, která v produktu chybí.'],
          ['Provozní test', 'Skutečná data nebo uživatelé v malém měřítku. Třeba týden, tři lidé, dvacet záznamů.'],
        ].map(([t, d]) => (
          <Panel key={t}>
            <Badge>{t}</Badge>
            <p className="mt-1.5 text-sm">{d}</p>
          </Panel>
        ))}
      </div>
      <Grid2>
        <div>
          <Field>
            <Label htmlFor="tl-n">Kolik reálných vstupů jsi pustil</Label>
            <Input id="tl-n" type="number" min={0} value={n} onChange={(ev) => setN(parseInt(ev.target.value, 10) || 0)} />
          </Field>
          <Field>
            <Label htmlFor="tl-e">Kolik z nich dopadlo špatně</Label>
            <Input id="tl-e" type="number" min={0} value={e} onChange={(ev) => setE(parseInt(ev.target.value, 10) || 0)} />
          </Field>
          <Field>
            <Label htmlFor="tl-chg">Co jsi po testu změnil</Label>
            <Textarea id="tl-chg" rows={2} placeholder="Bez zapsané změny to není test." value={chg} onChange={(ev) => setChg(ev.target.value)} />
          </Field>
        </div>
        <div>
          <Fine className="m-0">Chybovost</Fine>
          <BigNumber>{n ? `${Math.round((errs / n) * 100)} %` : '–'}</BigNumber>
          <div className="mt-3 flex flex-col gap-2">
            {fb.map(([t, m]) => (
              <Note key={m} tone={t}>{m}</Note>
            ))}
          </div>
        </div>
      </Grid2>
    </Lab>
  )
}
