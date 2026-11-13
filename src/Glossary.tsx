import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const G: [string, string][] = [
  ['Model', 'Program naučený na velkém množství textu, který dopočítává, jaký text bude následovat.'],
  ['Token', 'Kousek textu, se kterým model počítá. Podle tokenů se platí a plní se jimi kontext.'],
  ['Kontext', 'Všechno, co model při odpovědi vidí: zadání, historie konverzace a vložené dokumenty. Má pevný limit.'],
  ['Halucinace', 'Věrohodně znějící výstup, který není pravdivý. Model si například vymyslí odkaz na zdroj, který neexistuje. Když ho nejde otevřít, nenapsal ho nikdo.'],
  ['Prompt a brief', 'Prompt je zadání modelu. Brief je zadání s kontextem: role, materiál, omezení, formát.'],
  ['RAG', 'Model před odpovědí dostane relevantní úryvky z tvých dokumentů a odpovídá z nich.'],
  ['Agent', 'Řešení s cílem, nástroji a přístupem k datům, které samo provede několik kroků po sobě.'],
  ['Skript, workflow, agent', 'Liší se tím, kdo řídí postup. Ve skriptu programátor celý předem, ve workflow programátor s AI uvnitř jednoho kroku, u agenta model za běhu.'],
  ['Spouštěč', 'Událost, která rozběhne automatizaci. Časový (každé pondělí) nebo událostní (přišel e-mail).'],
  ['API', 'Dohodnuté rozhraní, přes které jeden program žádá druhý o data nebo akci.'],
  ['Čtyři C', 'Context, Connections, Capabilities, Cadence. Co agent ví, kam vidí a smí psát, co umí udělat a kdy se spustí.'],
  ['Digitalizace a digitální transformace', 'Digitalizace převádí a zrychluje existující procesy. Transformace mění, co firma dělá, jak vydělává nebo jak se v ní pracuje.'],
  ['Stakeholder', 'Každý, koho řešení ovlivní nebo kdo o něm rozhoduje: uživatelé, vedení, ten, kdo platí, ten, kdo to bude udržovat.'],
  ['Pilot a MVP', 'MVP je nejmenší funkční verze, která ověří hypotézu. Pilot je její nasazení v malém měřítku na reálných lidech a datech.'],
  ['Design thinking', 'Postup od definice problému přes empatii a ideaci k prototypu a testu. Vždy začíná rozhovorem se skutečným člověkem.'],
  ['HMW', '„How might we“, česky „Jak bychom mohli“. Formát otázky, který míří na řešení, ne na překážky.'],
  ['ABT', 'And, But, Therefore. Tři věty příběhu: kontext, problém, řešení s číslem.'],
]

export function Glossary() {
  return (
    <section className="mx-auto max-w-[1000px] px-[max(16px,env(safe-area-inset-left,0px))] pt-6">
      <h2 className="mb-3 text-[28px] font-bold">Slovníček</h2>
      <Accordion type="multiple" className="rounded-lg border bg-card px-5">
        {G.map(([t, d]) => (
          <AccordionItem key={t} value={t}>
            <AccordionTrigger>{t}</AccordionTrigger>
            <AccordionContent>{d}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
