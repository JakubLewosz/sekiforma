import oak from '../assets/kitchen-detail.webp';
import stone from '../assets/kitchen-angle.webp';
import green from '../assets/living-angle.webp';
export const materials = [
  {
    id: 'oak',
    label: 'Naturalny dąb',
    tone: 'Ciepło i rytm',
    title: 'Drewno, które nadaje ton.',
    image: oak,
    alt: 'Dębowy front i zaokrąglony narożnik wyspy — wycinek wizualizacji kuchni.',
    description:
      'Wyraźny rysunek słojów porządkuje duże płaszczyzny. W tej koncepcji dąb łączy wysokie szafy z wyspą, tworząc spokojną, naturalną całość.',
    pairing:
      'Jasny blat i proste podziały frontów zostawiają miejsce na sam materiał.',
    href: '/projekty/jasna-kuchnia',
    link: 'Zobacz dąb w kuchni',
    caption: 'Detal dębowej wyspy · Wycinek wizualizacji AI',
  },
  {
    id: 'stone',
    label: 'Jasny kamień',
    tone: 'Światło i lekkość',
    title: 'Światło zatrzymane w detalu.',
    image: stone,
    alt: 'Jasny kamienny blat z ceramiczną misą nad dębową wyspą — drugie ujęcie koncepcji kuchni.',
    description:
      'Ciepła, mineralna powierzchnia rozjaśnia kompozycję. Miękka linia narożnika łączy blat z drewnianym frontem i łagodzi geometrię kuchni.',
    pairing:
      'Drobne różnice tonu najlepiej odkrywa się z bliska, w naturalnym świetle.',
    href: '/projekty/jasna-kuchnia',
    link: 'Obejrzyj koncepcję kuchni',
    caption: 'Blat z bliższej perspektywy · Wizualizacja AI',
  },
  {
    id: 'green',
    label: 'Zgaszona zieleń',
    tone: 'Kolor i głębia',
    title: 'Odrobina koloru. Więcej głębi.',
    image: green,
    alt: 'Oliwkowy fotel z widoczną fakturą tapicerki na tle dębowego regału — drugie ujęcie koncepcji salonu.',
    description:
      'Oliwkowy akcent wprowadza do salonu wyraźny, spokojny punkt. Miękka tapicerka kontrastuje z rytmem dębowego regału i jasnym tłem.',
    pairing:
      'Zieleń, drewno i kremowe tkaniny tworzą paletę pokazaną w koncepcji salonu.',
    href: '/projekty/zabudowa-salonu',
    link: 'Odkryj paletę salonu',
    caption: 'Kolor i faktura fotela · Wizualizacja AI',
  },
] as const;
