import { useEffect, useState } from 'react'
import { Lab, Row, Note } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

const S: [string, 'D' | 'T', string][] = [
  ['Faktury skenujeme a ukládáme do systému místo papírových složek.', 'D', 'Existující proces dostal digitální podobu. Nic víc se nezměnilo.'],
  ['Firma přestane prodávat jednotlivé stroje a začne prodávat jejich provoz jako službu.', 'T', 'Mění se, co firma nabízí a jak vydělává.'],
  ['Schvalování dovolených přesuneme z e-mailů do aplikace.', 'D', 'Stejný proces, jiný nástroj.'],
  ['Firma přepíše role, procesy a metriky tak, aby se kolem AI organizovala práce celého týmu.', 'T', 'Mění se způsob, jakým se ve firmě pracuje, ne jen nástroj.'],
  ['Excelovou tabulku skladu nahradíme skladovým systémem.', 'D', 'Nástroj se mění, proces zůstává.'],
  ['Týdenní reporty se po novu generují a rozesílají automaticky.', 'D', 'Automatizace existujícího procesu. Užitečná, ale transformace to není.'],
]

export function Digi() {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState<'D' | 'T' | null>(null)
  const { mark } = useProgress()
  const over = i >= S.length
  useEffect(() => {
    if (over) mark('digi')
  }, [over, mark])
  const s = S[i]
  const ok = chosen !== null && chosen === s?.[1]

  const btn = (k: 'D' | 'T', label: string) => (
    <button
      disabled={chosen !== null}
      onClick={() => {
        setChosen(k)
        if (k === s[1]) setScore((v) => v + 1)
      }}
      className={cn(
        'rounded-md border bg-background px-4 py-2 text-sm font-medium transition-all duration-200',
        chosen === null && 'cursor-pointer hover:-translate-y-px hover:border-primary',
        chosen !== null && k === s[1] && 'border-ok bg-ok-soft',
        chosen === k && k !== s[1] && 'border-bad bg-bad-soft',
      )}
    >
      {label}
    </button>
  )
  return (
    <Lab
      id="digi"
      title="Digitalizace, nebo transformace"
      lead="Pracovní rozlišení: digitalizace převádí existující proces do digitální podoby nebo ho zrychlí. Transformace mění to, co firma dělá, jak vydělává nebo jak se v ní pracuje. Zařaď šest situací."
      take="Obojí je legitimní. Problém nastane, když firma říká „transformace“ a udělá digitalizaci, nebo naopak čeká od nového nástroje změnu, kterou nástroj sám nepřinese."
    >
      <div className="rounded-md border bg-background p-3.5 text-[17px]">
        {over ? (
          <>Hotovo. Skóre: <b>{score} z {S.length}</b>.</>
        ) : (
          <>Situace {i + 1} z {S.length}: {s[0]}</>
        )}
      </div>
      {over ? (
        <div className="my-3">
          <Button onClick={() => { setI(0); setScore(0); setChosen(null) }}>Znovu</Button>
        </div>
      ) : (
        <>
          <div className="my-3 flex flex-wrap gap-2">
            {btn('D', 'Digitalizace')}
            {btn('T', 'Transformace')}
          </div>
          {chosen && (
            <Note tone={ok ? 'ok' : 'bad'}>
              <b>{ok ? 'Správně. ' : 'Spíš opačně. '}</b>
              {s[2]}
              <Row className="mt-2">
                <Button onClick={() => { setI(i + 1); setChosen(null) }}>{i + 1 >= S.length ? 'Výsledek' : 'Další'}</Button>
              </Row>
            </Note>
          )}
        </>
      )}
    </Lab>
  )
}
