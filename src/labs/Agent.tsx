import { useEffect, useState } from 'react'
import { Lab, Row, Note } from '@/components/bits'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/lib/progress'

const EV: [string, string, string][] = [
  ['Cíl', 'Zpracuj dnešní poštu, vytáhni úkoly a připrav koncepty odpovědí.', ''],
  ['Akce', 'Načíst schránku (smí jen číst).', 'Pozorování: 12 zpráv, 3 od zákazníků, 1 s přílohou.'],
  ['Úvaha', 'U přílohy nevím, co v ní je. Otevřu ji.', 'Pozorování: PDF s objednávkou na 40 kusů.'],
  ['Akce', 'Ověřit cenu v ceníku.', 'Pozorování: cena 120 Kč. Soubor je z loňska, ale agent datum nezkontroluje.'],
  ['Akce', 'Napsat koncept odpovědi s cenou 120 Kč.', 'Pozorování: koncept vypadá profesionálně.'],
]

export function Agent() {
  const [ask, setAsk] = useState(true)
  const [i, setI] = useState(0)
  const [verdict, setVerdict] = useState<'ok' | 'sent' | null>(null)
  const { mark } = useProgress()
  const finished = i > EV.length

  useEffect(() => {
    if (finished && (!ask || verdict)) mark('agent')
  }, [finished, ask, verdict, mark])

  const reset = () => {
    setI(0)
    setVerdict(null)
  }

  return (
    <Lab
      id="agent"
      title="Chat, nebo agent"
      lead="Chat dá jednu odpověď. Agent má cíl, přístup k nástrojům a provede několik kroků po sobě: přečte, rozhodne, zapíše, ověří. Projdi jeden běh agenta, který zpracovává poštu. Vyber, jestli před odesláním potvrzuješ ty."
      take="Agent nespadne. Krok tři vrátí zastaralá data, krok pět je správně naformátuje a výsledek vypadá naprosto věrohodně. Chyba, která hlásí výjimku, je dárek. Chyba, která vrátí hezky napsaný nesmysl, je průšvih. Nevratné akce proto vždy potvrzuje člověk."
      fine="Scénář je vymyšlený."
    >
      <Row className="mb-3">
        <Button variant={ask ? 'on' : 'outline'} onClick={() => { setAsk(true); reset() }}>Potvrzuji před odesláním</Button>
        <Button variant={!ask ? 'on' : 'outline'} onClick={() => { setAsk(false); reset() }}>Agent odesílá sám</Button>
        <Button onClick={() => setI((n) => Math.min(n + 1, EV.length + 1))} disabled={finished}>Další krok</Button>
        <Button variant="outline" onClick={reset}>Znovu</Button>
      </Row>
      <div className="my-3 flex flex-col gap-2">
        {EV.slice(0, Math.min(i, EV.length)).map((e, k) => (
          <div key={k} className="grid grid-cols-[96px_1fr] gap-3 rounded-md border bg-background px-3 py-2.5 text-sm max-sm:grid-cols-1 max-sm:gap-1">
            <div>
              <Badge>{e[0]}</Badge>
            </div>
            <div className="min-w-0">
              {e[1]}
              {e[2] && (
                <>
                  <br />
                  <span className="text-muted-foreground">{e[2]}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {finished && ask && !verdict && (
        <Note tone="warn">
          <b>Agent se zastavil a čeká na tebe.</b> Chce odeslat odpověď zákazníkovi s cenou 120 Kč.
          <Row className="mt-2">
            <Button onClick={() => setVerdict('sent')}>Schválit odeslání</Button>
            <Button variant="outline" onClick={() => setVerdict('ok')}>Zamítnout a zkontrolovat</Button>
          </Row>
        </Note>
      )}
      {finished && ask && verdict === 'sent' && (
        <Note tone="bad">Odesláno. Cena je zastaralá a zákazník ji dostal černé na bílém. Potvrzení pomůže jen tehdy, když se skutečně díváš, na co odpovídáš.</Note>
      )}
      {finished && ask && verdict === 'ok' && (
        <Note tone="ok">Chyba zachycena. Ceník byl z loňska a odpověď neodešla. Pojistka zafungovala, protože agent smí odesílat jen se souhlasem.</Note>
      )}
      {finished && !ask && (
        <Note tone="bad">
          <b>Odesláno automaticky.</b> Zákazník dostal cenu z loňského ceníku. Nic nespadlo, nikdo nic neviděl a výsledek vypadal naprosto věrohodně.
        </Note>
      )}
    </Lab>
  )
}
