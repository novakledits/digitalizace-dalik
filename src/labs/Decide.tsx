import { useEffect, useState } from 'react'
import { Lab, Row, Note } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

const OPT: [string, string][] = [
  ['input', 'Změnit vstup'],
  ['platform', 'Hotová platforma (Make, n8n, Zapier)'],
  ['script', 'Skript'],
  ['workflow', 'Workflow s AI'],
  ['agent', 'AI agent'],
  ['author', 'AI jako autor skriptu'],
]
const S = [
  { t: 'Dodavatel ti posílá objednávky jako PDF v e-mailu a ty je ručně přepisuješ do tabulky. Dodavatel umí posílat i CSV.', a: 'input', why: 'Změna vstupu je skoro vždy levnější než jeho chytré zpracování. Požádej dodavatele o CSV.' },
  { t: 'Odpovědi z formuláře se mají zapsat do tabulky a zákazník má dostat potvrzení. Pole mají vždy stejný tvar.', a: 'platform', why: 'Tohle zvládne hotová integrační platforma bez jediného řádku kódu.' },
  { t: 'Zákazníci píšou e-maily pokaždé jinak. Z každého potřebuješ vytáhnout číslo objednávky a téma a zapsat je do tabulky.', a: 'workflow', why: 'Vstup je pokaždé jinak napsaný, ale chceš s ním pořád totéž. AI rozhoduje jen v jednom kroku, zbytek řídí pevný postup.' },
  { t: 'Dostaneš otevřenou otázku, proč klesly tržby v jednom regionu. Nevíš, jaká data budeš potřebovat, a ukáže se to až cestou.', a: 'agent', why: 'Postup nejde určit dopředu a cest je moc. Agent dává smysl, ale jen když výsledek někdo kontroluje a cena chyby je únosná.' },
  { t: 'Každý měsíc dostaneš výpis ve stejném exportním formátu. Občas se změní pořadí sloupců, ale zpracování je pokaždé stejné.', a: 'author', why: 'Úloha se opakuje a mění se jen podoba vstupu. AI pomůže jednou napsat parser a běh pak jede deterministicky a levně.' },
  { t: 'Každé pondělí v 8:00 se má z přesně formátovaného exportu spočítat týdenní součet a odeslat e-mailem. Formát se nikdy nemění a máš programátora.', a: 'script', why: 'Vstup chodí pokaždé stejně. Skript je rychlý, levný a předvídatelný.' },
]

const ARCH = [
  ['Skript', 'Programátor, celé předem', 'Robotická ruka na lince', 'Vstup chodí pokaždé stejně.'],
  ['Workflow s AI', 'Programátor, AI rozhoduje jen uvnitř jednoho kroku', 'Linka s člověkem na jedné stanici', 'Vstup je pokaždé jinak napsaný, ale chceš s ním pořád totéž.'],
  ['AI agent', 'Model, za běhu', 'Mistr s cílem a klíči', 'Teprve cestou se ukáže, co je potřeba udělat.'],
]

export function Decide() {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const { mark } = useProgress()
  const over = i >= S.length
  useEffect(() => {
    if (over) mark('decide')
  }, [over, mark])

  const s = S[i]
  const answered = chosen !== null
  const ok = answered && chosen === s?.a
  const next = () => {
    setI(i + 1)
    setChosen(null)
  }
  return (
    <Lab
      id="decide"
      title="Skript, workflow, nebo agent"
      lead="Nejdřív dvě otázky, které agenta často odpískají úplně. Musí vstup přijít v téhle podobě, nebo se dá e-mail nahradit formulářem či CSV? A zvládne to hotová platforma (Make, n8n, Zapier) bez kódu? Pokud ne, vybíráš ze tří architektur. Liší se tím, kdo rozhoduje o dalším kroku."
      take="Heuristika s papírem: nakresli postup jako vývojový diagram. Vejde se na jednu A4 a není v něm uzel, kde je potřeba úsudek nad otevřeným vstupem? Pak agenta nepotřebuješ. Rozhodnutí agenta nestavět je plnohodnotný výsledek."
    >
      <div className="my-3 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              {['Architektura', 'Kdo řídí postup', 'Přirovnání', 'Kdy ji zvolit'].map((h) => (
                <th key={h} className="border-b px-2.5 py-2 text-left font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ARCH.map((r) => (
              <tr key={r[0]}>
                {r.map((c, k) => (
                  <td key={k} className="border-b px-2.5 py-2 align-top">{k === 0 ? <b>{c}</b> : c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-4 max-w-[68ch]">
        Čtvrtá možnost je AI jako autor. Pomůže jednou na začátku, rozebere formát vstupů a napíše parser, a systém pak jede bez ní. Platíš za vytvoření nástroje, ne za každou odpověď.
      </p>
      <b>Zkouška: co bys zvolil?</b>
      <div className="mt-2 rounded-md border bg-background p-3.5 text-[17px]">
        {over ? (
          <>
            Hotovo. Skóre: <b>{score} z {S.length}</b>.
          </>
        ) : (
          <>Situace {i + 1} z {S.length}: {s.t}</>
        )}
      </div>
      {over ? (
        <div className="my-3">
          <Button onClick={() => { setI(0); setScore(0); setChosen(null) }}>Zkusit znovu</Button>
        </div>
      ) : (
        <>
          <div className="my-3 flex flex-wrap gap-2">
            {OPT.map(([k, label]) => (
              <button
                key={k}
                disabled={answered}
                onClick={() => {
                  setChosen(k)
                  if (k === s.a) setScore((v) => v + 1)
                }}
                className={cn(
                  'rounded-md border bg-background px-3 py-2 text-left text-sm font-medium transition-all duration-200',
                  !answered && 'cursor-pointer hover:-translate-y-px hover:border-primary',
                  answered && k === s.a && 'border-ok bg-ok-soft',
                  answered && chosen === k && k !== s.a && 'border-bad bg-bad-soft',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {answered && (
            <Note tone={ok ? 'ok' : 'bad'}>
              <b>{ok ? 'Správně. ' : `Správně je „${OPT.find((o) => o[0] === s.a)![1]}“. `}</b>
              {s.why}
              <Row className="mt-2">
                <Button onClick={next}>{i + 1 >= S.length ? 'Výsledek' : 'Další situace'}</Button>
              </Row>
            </Note>
          )}
        </>
      )}
    </Lab>
  )
}
