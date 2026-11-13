export const MODULES = [
  {
    id: 'm1',
    title: 'Jak AI funguje',
    intro:
      'Jazykový model dopočítává, jaký kousek textu bude následovat. Z té jedné vlastnosti plyne, proč AI umí psát, proč si vymýšlí a proč jí občas chybí paměť.',
    labs: ['token', 'predict', 'context', 'brief', 'rag'],
  },
  {
    id: 'm2',
    title: 'Automatizace a architektury',
    intro:
      'Většina špatných řešení nevznikne tím, že je někdo špatně postavil. Vznikne tím, že se postavila špatná věc. Tady se učíš vybrat správnou, než napíšeš první prompt.',
    labs: ['agent', 'api', 'decide', 'reliab', 'fourc'],
  },
  {
    id: 'm3',
    title: 'Digitalizace ve firmě',
    intro:
      'Technologie je ta snazší část. Ve firmě se rozhoduje o tom, jestli se řešení vůbec nasadí, kdo ho zaplatí a kdo s ním bude žít.',
    labs: ['digi', 'stake'],
  },
  {
    id: 'm4',
    title: 'Tvoje výzva',
    intro:
      'Postup má pět fází: definice, research a empatie, ideace, prototypování a testování. Nástroje se mění po měsících, tenhle postup ne. Tady jsou nástroje na první, třetí a poslední fázi a na závěrečný pitch.',
    labs: ['inventura', 'define', 'testlog', 'pitch'],
  },
  {
    id: 'm5',
    title: 'Kvíz na 100 %',
    intro:
      'Dvanáct otázek z celého průvodce. U každé hned uvidíš, proč je odpověď správná nebo špatná. Pokusů máš, kolik chceš.',
    labs: ['quiz'],
  },
]

export const TOTAL = MODULES.reduce((a, m) => a + m.labs.length, 0)
