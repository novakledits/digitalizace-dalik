import { useEffect, useState } from 'react'
import { Lab, Panel, Field } from '@/components/bits'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/input'
import { useProgress } from '@/lib/progress'

const Q: [string, string[]][] = [
  ['Proč nepoužijete hotový nástroj, který tohle už umí?', ['Víš, kolik hotový nástroj stojí (třeba pár dolarů měsíčně)', 'Umíš říct, v čem se tvoje řešení liší', 'Víš, proč by hotový nástroj nestačil']],
  ['Co když se to splete? Kdo za to nese odpovědnost?', ['Uvádíš chybovost z testu, například 3 chyby z 20', 'Říkáš, kdo výstup kontroluje', 'Říkáš, které akce jsou nevratné a jdou přes člověka']],
  ['Kolik to stojí měsíčně a kdo to bude udržovat?', ['Uvádíš konkrétní částku', 'Jmenuješ roli, která řešení udržuje', 'Počítáš s tím, že nástroje a ceny se mění']],
  ['Čí data do toho tečou a kdo je uvidí?', ['Říkáš, jaká data to jsou', 'Říkáš, kam tečou a kdo má přístup', 'Ověřils u firmy, co smí ven']],
  ['Co kdyby to nefungovalo, jak to poznáme včas?', ['Odkazuješ na měřítko úspěchu napsané předem', 'Máš kontrolní číslo, které se sleduje', 'Víš, kdy a jak se řešení vypne nebo vrátí zpět']],
]

export function Stake() {
  const [txt, setTxt] = useState<string[]>(Q.map(() => ''))
  const { mark } = useProgress()
  const answered = txt.filter((t) => t.trim().length >= 20).length
  useEffect(() => {
    if (answered >= 3) mark('stake')
  }, [answered, mark])
  return (
    <Lab
      id="stake"
      title="Skeptický decision maker"
      lead="Publikum při pitchi nehodnotí techniku. Rozhoduje, platí a bude s řešením žít. Těchto pět otázek přijde skoro vždycky. Odpověz aspoň na tři vlastními slovy a odškrtni, co odpověď obsahuje."
      take="Pilot a MVP slouží k tomu, abys na tyhle otázky měl čísla. Nejmenší verze, která ověří hypotézu, je lepší než největší, která nic neověřila. Když chceš zjistit, jestli lidem pomůže týdenní přehled, pošli jim ho první týden ručně."
    >
      {Q.map((q, i) => (
        <Panel key={i} className="mb-3">
          <Field>
            <Label htmlFor={`sk-${i}`}>{q[0]}</Label>
            <Textarea
              id={`sk-${i}`}
              rows={2}
              placeholder="Tvoje odpověď vlastními slovy"
              value={txt[i]}
              onChange={(e) => setTxt(txt.map((t, k) => (k === i ? e.target.value : t)))}
            />
          </Field>
          {txt[i].trim().length >= 20 &&
            q[1].map((c, j) => (
              <div key={j} className="my-1 flex items-start gap-2 text-sm">
                <Checkbox id={`sk-${i}-${j}`} className="mt-1" />
                <label htmlFor={`sk-${i}-${j}`}>{c}</label>
              </div>
            ))}
        </Panel>
      ))}
    </Lab>
  )
}
