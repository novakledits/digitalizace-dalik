import { useEffect, useState } from 'react'
import { Lab, Grid2, Field, Note, Row } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProgress } from '@/lib/progress'
import { copyText } from '@/lib/utils'

const BRIEF: [string, string, string?, string?][] = [
  ['ctx', 'Kontext', 'kde se problém objevuje'],
  ['goal', 'Cíl', 'co chceme zlepšit'],
  ['user', 'Uživatel nebo stakeholder', ''],
  ['lim', 'Omezení', 'čas, nástroje, znalosti, rozpočet'],
  ['kpi', 'Měřítko úspěchu', '', 'Např. týdenní třídění pošty z 90 na 30 minut'],
]
const NAMES = ['Kontext', 'Cíl', 'Uživatel / stakeholder', 'Omezení', 'Měřítko úspěchu']

export function Define() {
  const [tree, setTree] = useState(['', '', '', ''])
  const [b, setB] = useState<Record<string, string>>({ ctx: '', goal: '', user: '', lim: '', kpi: '' })
  const [copied, setCopied] = useState(false)
  const { mark } = useProgress()
  const n = BRIEF.filter((f) => b[f[0]].trim().length >= 3).length
  const kpiOk = /\d/.test(b.kpi)
  useEffect(() => {
    if (n === 5 && kpiOk) mark('define')
  }, [n, kpiOk, mark])

  const build = () => 'DESIGN BRIEF\n' + BRIEF.map((f, i) => `${NAMES[i]}: ${b[f[0]].trim() || '[DOPLŇ]'}`).join('\n')
  const treeLabels = ['Problém', 'Proč? (1)', 'Proč? (2)', 'Proč? (3), kořenová příčina']

  return (
    <Lab
      id="define"
      title="Problémový strom a design brief"
      lead="Nejdřív ověř, že řešíš příčinu a ne symptom: ptej se třikrát „proč“. Pak napiš brief. Měřítko úspěchu napiš dřív, než začneš stavět. Je to jediná pojistka proti tomu, abys na konci sám sobě odkýval, že to vyšlo."
      take="Měřítko bez čísla je přání. Číslo si napiš předem a u pitche s ním pracuješ."
    >
      <Grid2>
        <div>
          <b>Problémový strom</b>
          <div className="mt-2">
            {treeLabels.map((l, i) => (
              <Field key={l}>
                <Label htmlFor={`pt-${i}`}>{l}</Label>
                <Input id={`pt-${i}`} value={tree[i]} placeholder={i === 0 ? 'Např. mám chaos v úkolech' : ''} onChange={(e) => setTree(tree.map((t, k) => (k === i ? e.target.value : t)))} />
              </Field>
            ))}
          </div>
        </div>
        <div>
          <b>Design brief</b>
          <div className="mt-2">
            {BRIEF.map(([k, label, hint, ph]) => (
              <Field key={k}>
                <Label htmlFor={`db-${k}`}>
                  {label} {hint && <small className="font-normal text-muted-foreground">{hint}</small>}
                </Label>
                <Input id={`db-${k}`} value={b[k]} placeholder={ph} onChange={(e) => setB({ ...b, [k]: e.target.value })} />
              </Field>
            ))}
          </div>
        </div>
      </Grid2>
      {n < 5 ? (
        <Note>Vyplněno {n} z 5 polí briefu.</Note>
      ) : !kpiOk ? (
        <Note tone="warn">Měřítko úspěchu je bez čísla. Napiš, o kolik a do kdy se má něco zlepšit.</Note>
      ) : (
        <Note tone="ok">Brief je úplný a měřítko obsahuje číslo.</Note>
      )}
      <Row className="mt-3">
        <Button
          onClick={async () => {
            await copyText(build())
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          }}
        >
          {copied ? 'Zkopírováno' : 'Zkopírovat brief'}
        </Button>
      </Row>
    </Lab>
  )
}
