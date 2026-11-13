import { useEffect, useState } from 'react'
import { Lab, Row, Note, Fine } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/lib/progress'
import { cn, shuffle } from '@/lib/utils'

type Q = [string, string, string[], string]
const QS: Q[] = [
  ['Co je v jazykovém modelu token?', 'Kousek textu, se kterým model počítá', ['Heslo k API', 'Jedno celé slovo', 'Jedna odpověď modelu'], 'Token je kousek textu, třeba část slova. Podle tokenů se platí a zaplňují kontext.'],
  ['Konverzace se nevejde do kontextového okna. Co je s nejstaršími zprávami?', 'Model je při odpovědi nevidí', ['Model je vidí dál, jen pomaleji', 'Model je sám shrne a zapamatuje si je', 'Nic, kontext je neomezený'], 'Co se nevejde do kontextu, model k odpovědi nemá. Důležité věci je potřeba připomenout.'],
  ['Co je halucinace?', 'Věrohodně znějící odpověď, která není pravdivá', ['Výpadek serveru', 'Odmítnutí odpovědět', 'Příliš dlouhá odpověď'], 'Model musí vybrat nějaké pokračování, i když látku nezná. Z tónu odpovědi se to nepozná, jen z ověření.'],
  ['Čím se brief liší od krátkého promptu?', 'Obsahuje roli, kontext, materiál, omezení a formát', ['Je delší, aby vypadal důkladně', 'Píše se vždy anglicky', 'Posílá se jiným modelům'], 'Rozdíl mezi průměrným a dobrým výstupem dělá hlavně množství dodaného kontextu.'],
  ['Co dělá RAG?', 'Najde v dokumentech relevantní úryvky a vloží je modelu do kontextu', ['Natrénuje model znovu na tvých dokumentech', 'Zrychlí model', 'Přeloží dokumenty'], 'Model odpovídá z podstrčených podkladů a může uvést zdroj. Model se přitom nemění.'],
  ['Čím je agent jiný než chat?', 'Má cíl, nástroje a udělá víc kroků za sebou', ['Je vždy chytřejší model', 'Pracuje bez internetu', 'Odpovídá jen jednou'], 'Agent čte, rozhoduje, zapisuje a ověřuje. Proto je dražší a méně předvídatelný.'],
  ['Vstup chodí vždy ve stejné podobě a postup se nemění. Co zvolíš?', 'Skript', ['AI agenta', 'Multiagentní systém', 'Chatbota'], 'Skript je rychlý, levný a předvídatelný. Agent by zde byl chyba v návrhu.'],
  ['Řetězec 10 kroků, každý uspěje v 95 % případů. Jaká je úspěšnost celku?', 'Asi 59 %', ['95 %', '90 %', 'Asi 35 %'], '0,95 na desátou je zhruba 0,59. Při 90 % na krok je to asi 35 %.'],
  ['V jakém pořadí stavíš agenta podle čtyř C?', 'Context, Connections, Capabilities, Cadence', ['Connections, Capabilities, Context, Cadence', 'Cadence, Context, Capabilities, Connections', 'Capabilities, Cadence, Connections, Context'], 'Nejdřív musí agent vědět, co je důležité. Až potom dostane přístupy.'],
  ['Která věta popisuje digitální transformaci?', 'Firma mění, co nabízí nebo jak vydělává, a přestaví kolem toho procesy a role', ['Faktury skenujeme místo papírových složek', 'Koupili jsme nové notebooky', 'Používáme e-mail místo faxu'], 'Ostatní příklady jsou digitalizace nebo nákup techniky. Transformace mění samotné fungování firmy.'],
  ['Čím má skončit pitch?', 'Konkrétní žádostí na publikum', ['Poděkováním', 'Shrnutím všech slidů', 'Otázkou, jestli je vše jasné'], 'Pusťte nás do pilotu, dejte nám na to člověka, schvalte rozpočet. Pitch, který končí poděkováním, nic neprodal.'],
  ['Kdy zapíšeš měřítko úspěchu?', 'Před stavbou', ['Po testování', 'Až se na něj někdo zeptá', 'Při pitchi'], 'Je to pojistka proti tomu, abys na konci sám sobě odkýval, že to vyšlo.'],
]

function fresh() {
  return shuffle(QS).map((q) => ({ q, opts: shuffle([q[1], ...q[2]]) }))
}

export function Quiz() {
  const [round, setRound] = useState(fresh)
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const { mark } = useProgress()
  const over = i >= round.length
  useEffect(() => {
    if (over) mark('quiz')
  }, [over, mark])

  const restart = () => {
    setRound(fresh())
    setI(0)
    setScore(0)
    setChosen(null)
  }

  if (over) {
    const msg = score >= 11 ? 'Hotovo, jedeš na sto.' : score >= 9 ? 'Skoro. Prohlédni si chyby a zkus znovu.' : 'Vrať se k modulům a zkus to znovu.'
    return (
      <Lab id="quiz" title="Cvičný kvíz">
        <div className="text-[44px] leading-tight font-bold">{score} z {round.length}</div>
        <p className="my-2 mb-4">{msg}</p>
        <Button onClick={restart}>Zkusit znovu</Button>
        <Fine className="mt-3">Cvičný kvíz nenahrazuje kvízy v předmětu.</Fine>
      </Lab>
    )
  }
  const { q, opts } = round[i]
  const answered = chosen !== null
  const ok = chosen === q[1]
  return (
    <Lab id="quiz" title="Cvičný kvíz">
      <div className="mb-1 font-mono text-xs text-muted-foreground">Otázka {i + 1} z {round.length}</div>
      <Progress value={(i / round.length) * 100} className="mb-4 h-1.5" />
      <div className="mb-3 text-xl font-bold">{q[0]}</div>
      <div className="flex flex-col gap-2">
        {opts.map((o) => (
          <button
            key={o}
            disabled={answered}
            onClick={() => {
              setChosen(o)
              if (o === q[1]) setScore((s) => s + 1)
            }}
            className={cn(
              'w-full rounded-md border bg-background px-3 py-2.5 text-left text-sm font-medium transition-all duration-200',
              !answered && 'cursor-pointer hover:-translate-y-px hover:border-primary',
              answered && o === q[1] && 'border-ok bg-ok-soft',
              chosen === o && o !== q[1] && 'border-bad bg-bad-soft',
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {answered && (
        <Note tone={ok ? 'ok' : 'bad'} className="mt-3">
          <b>{ok ? 'Správně. ' : 'Špatně. '}</b>
          {q[3]}
          <Row className="mt-2">
            <Button onClick={() => { setI(i + 1); setChosen(null) }}>{i + 1 >= round.length ? 'Výsledek' : 'Další otázka'}</Button>
          </Row>
        </Note>
      )}
    </Lab>
  )
}
