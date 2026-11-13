import { useEffect, useState } from 'react'
import { Lab, Row, Grid2, Field, Pre, Panel, Fine } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/lib/progress'
import { copyText } from '@/lib/utils'

const FIELDS: [string, string, string, string?][] = [
  ['role', 'Role', 'kým má AI být'],
  ['who', 'Kdo', 'kdo má problém'],
  ['what', 'Co', 'co je problém'],
  ['where', 'Kde', 'kde se projevuje'],
  ['why', 'Proč', 'proč je to problém'],
  ['mat', 'Materiál', 'co AI nahraješ', 'Např. rozvrh, seznam termínů, poznámky'],
  ['no', 'Co nechci', '', 'Např. obecné rady, žádné aplikace za peníze'],
  ['fmt', 'Formát odpovědi', ''],
]
const INIT: Record<string, string> = {
  role: 'Kouč time managementu',
  who: 'Student',
  what: 'Nezvládám time management',
  where: 'Při kombinaci školy a brigády',
  why: 'Často se dostávám do stresu z nedodržení termínů',
  mat: '',
  no: '',
  fmt: 'Pět návrhů v tabulce',
}

export function Brief() {
  const [v, setV] = useState(INIT)
  const [edits, setEdits] = useState(0)
  const [copied, setCopied] = useState(false)
  const { mark } = useProgress()
  const val = (k: string) => v[k].trim()
  const filled = FIELDS.filter((f) => val(f[0])).length

  useEffect(() => {
    if (edits >= 4 && filled >= 6) mark('brief')
  }, [edits, filled, mark])

  const build = () => {
    const L: string[] = []
    if (val('role')) L.push(`Představ si, že jsi ${val('role').toLowerCase()}.`)
    const ctx: string[] = []
    if (val('who')) ctx.push(`Kdo: ${val('who')}`)
    if (val('what')) ctx.push(`Co je problém: ${val('what')}`)
    if (val('where')) ctx.push(`Kde se projevuje: ${val('where')}`)
    if (val('why')) ctx.push(`Proč je to problém: ${val('why')}`)
    if (ctx.length) L.push(ctx.join('\n'))
    if (val('mat')) L.push(`Materiál, který ti dávám: ${val('mat')}.`)
    if (val('no')) L.push(`Nechci: ${val('no')}.`)
    if (val('fmt')) L.push(`Odpověz takto: ${val('fmt')}.`)
    return L.join('\n\n') || 'Vyplň aspoň jedno pole.'
  }
  const grade = filled <= 2 ? (['otázka', 'bad'] as const) : filled <= 5 ? (['slušné zadání', 'warn'] as const) : (['brief', 'ok'] as const)

  return (
    <Lab
      id="brief"
      title="Brief místo otázky"
      lead="Rozdíl mezi průměrným a dobrým výstupem dělá hlavně množství kontextu, který dodáš. Vyplň pole a sleduj, jak z krátké otázky vzniká brief. Předvyplněný příklad pochází z osnovy, přepiš ho svým."
      take="Zadávej roli, kontext, materiál, omezení a formát. Řekni i to, co nechceš, protože omezení zužují prostor rychleji než požadavky. Když výstup nesedí, uprav zadání a pošli ho znovu."
    >
      <Grid2>
        <div>
          {FIELDS.map(([k, label, hint, ph]) => (
            <Field key={k}>
              <Label htmlFor={`b-${k}`}>
                {label} {hint && <small className="font-normal text-muted-foreground">{hint}</small>}
              </Label>
              <Input
                id={`b-${k}`}
                value={v[k]}
                placeholder={ph}
                onChange={(e) => {
                  setV({ ...v, [k]: e.target.value })
                  setEdits((n) => n + 1)
                }}
              />
            </Field>
          ))}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <b>Výsledný prompt</b>
            <Badge variant={grade[1]}>{grade[0]}</Badge>
          </div>
          <Pre className="whitespace-pre-wrap">{build()}</Pre>
          <Progress value={(filled / FIELDS.length) * 100} className="mt-3" />
          <Fine className="mt-1.5 mb-2.5">
            Vyplněno {filled} z {FIELDS.length} polí
          </Fine>
          <Row>
            <Button
              onClick={async () => {
                await copyText(build())
                setCopied(true)
                mark('brief')
                setTimeout(() => setCopied(false), 1600)
              }}
            >
              {copied ? 'Zkopírováno' : 'Zkopírovat prompt'}
            </Button>
            <Button variant="outline" onClick={() => setV(Object.fromEntries(FIELDS.map((f) => [f[0], ''])))}>
              Vymazat pole
            </Button>
          </Row>
          <Panel className="mt-3 text-sm">
            <b>Pro srovnání, krátká otázka:</b>
            <br />
            „Pomoz mi s time managementem.“
            <br />
            <span className="text-muted-foreground">Dostaneš obecný seznam rad, které platí pro kohokoli.</span>
          </Panel>
        </div>
      </Grid2>
    </Lab>
  )
}
