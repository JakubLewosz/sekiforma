import kitchen from '../assets/kitchen.webp';
import kitchenDetail from '../assets/kitchen-detail.webp';
import wardrobe from '../assets/wardrobe.webp';
import wardrobeDetail from '../assets/wardrobe-detail.webp';
import living from '../assets/living.webp';
import livingDetail from '../assets/living-detail.webp';
export const projects = [
  {
    slug: 'jasna-kuchnia',
    number: '01',
    title: 'Jasna kuchnia',
    subtitle: 'Ciepło drewna. Lekkość codzienności.',
    category: 'KUCHNIA',
    type: 'kuchnia',
    image: kitchen,
    detail: kitchenDetail,
    alt: 'Wizualizacja jasnej kuchni: dębowa wyspa z kamiennym blatem i zabudowa przy dużym oknie.',
    detailAlt:
      'Wycinek wizualizacji kuchni: zaokrąglony narożnik dębowej wyspy i jasny blat.',
    intro:
      'Miejsce na poranną kawę, wspólne gotowanie i rozmowy, które zostają przy stole. Kuchnia pomyślana jako naturalna część domu.',
    need: 'W tym hipotetycznym mieszkaniu kuchnia łączy się ze strefą dzienną. Założeniem jest spokojne tło dla codziennych czynności i wygodny dostęp do najczęściej używanych rzeczy.',
    decision:
      'Wysokie szafy skupiają przechowywanie przy jednej ścianie. Wyspa daje dodatkowy blat roboczy, a zaokrąglony narożnik łagodzi przejście do jadalni. Jasne powierzchnie odbijają światło z okna.',
    materials: ['Naturalny fornir dębowy', 'Jasny kamień', 'Szczotkowana stal'],
    note: 'Materiał, układ i wyposażenie stanowią propozycję wizualną, wymagającą sprawdzenia w rzeczywistym projekcie.',
  },
  {
    slug: 'garderoba-we-wnece',
    number: '02',
    title: 'Garderoba we wnęce',
    subtitle: 'Każda rzecz ma swoje miejsce.',
    category: 'PRZECHOWYWANIE',
    type: 'garderoba',
    image: wardrobe,
    detail: wardrobeDetail,
    alt: 'Wizualizacja dębowej garderoby we wnęce z szufladami, półkami i podświetlanymi drążkami.',
    detailAlt:
      'Wycinek wizualizacji garderoby: podział półek, drążków i dębowych szuflad.',
    intro:
      'Spokojny początek dnia zaczyna się od prostych rozwiązań. Przemyślany podział przechowywania wykorzystuje wnękę od podłogi po sufit.',
    need: 'Scenariusz zakłada ograniczoną przestrzeń, w której mają zmieścić się ubrania na co dzień i rzeczy sezonowe. Ważna jest czytelność podziału i możliwość szybkiego odłożenia rzeczy.',
    decision:
      'Otwarte moduły pozwalają zobaczyć codzienną garderobę. Dolne szuflady mieszczą drobiazgi, a zamknięte boczne szafy chowają to, czego nie trzeba mieć pod ręką. Światło pod półkami wydobywa głębię wnęki.',
    materials: [
      'Dąb w ciepłym odcieniu',
      'Matowe fronty',
      'Zintegrowane oświetlenie',
    ],
    note: 'Podział jest ilustracją idei. Wymiary, wentylacja i osprzęt wymagają osobnego opracowania.',
  },
  {
    slug: 'zabudowa-salonu',
    number: '03',
    title: 'Zabudowa salonu',
    subtitle: 'Miejsce na to, co lubisz.',
    category: 'STREFA DZIENNA',
    type: 'salon',
    image: living,
    detail: livingDetail,
    alt: 'Wizualizacja salonu: dębowy regał na całą ścianę, dolne szafki i zielony fotel.',
    detailAlt:
      'Wycinek wizualizacji salonu: dębowe półki z ceramiką i książkami.',
    intro:
      'Książki, ulubiona ceramika i przedmioty z historią. Zabudowa, która porządkuje przestrzeń i zostawia miejsce na osobisty rytm.',
    need: 'W modelowym salonie jedna ściana ma połączyć bibliotekę, ekspozycję i przechowywanie. Mebel powinien wprowadzać porządek, bez optycznego przytłaczania pokoju.',
    decision:
      'Zamknięta dolna część uspokaja kompozycję, a otwarte półki pozwalają swobodnie ustawiać książki. Większa centralna wnęka daje ścianie oddech i miejsce na zmieniające się akcenty.',
    materials: [
      'Naturalny fornir dębowy',
      'Tynk w odcieniu piasku',
      'Len i wełna',
    ],
    note: 'Wizualizacja przedstawia pomysł aranżacyjny, a nie wykonane zlecenie.',
  },
] as const;
export const processSteps = [
  {
    title: 'Najpierw rozmowa',
    text: 'Zaczynamy od tego, jak żyjesz, czego potrzebujesz i co lubisz w swojej przestrzeni.',
  },
  {
    title: 'Potem dobry plan',
    text: 'Układ, materiały i detale składają się w projekt dopasowany do codziennych przyzwyczajeń.',
  },
  {
    title: 'Czas na wykonanie',
    text: 'W modelowym procesie zatwierdzony projekt trafia do pracowni, gdzie liczy się precyzja.',
  },
  {
    title: 'Wszystko na miejscu',
    text: 'Montaż domyka całość. Mebel staje się częścią wnętrza, gotową na własne historie.',
  },
];
export const faqs = [
  [
    'Czy potrzebuję gotowego projektu?',
    'Nie musisz zaczynać od rysunku technicznego. Kilka inspiracji i opis tego, jak korzystasz z pomieszczenia, to dobry punkt wyjścia do przygotowania briefu.',
  ],
  [
    'Co warto przygotować przed rozmową?',
    'Przybliżone wymiary, zdjęcia przestrzeni i listę najważniejszych potrzeb. Jeśli jeszcze ich nie masz, w formularzu możesz wybrać etap zbierania inspiracji.',
  ],
  [
    'Czy mogę wskazać materiały, które lubię?',
    'Tak. Opisz ulubione odcienie i faktury w polu potrzeb. Materiały w koncepcjach pokazują kierunek estetyczny, a nie katalog dostępnych produktów.',
  ],
  [
    'Czy formularz wysyła zapytanie?',
    'To demonstrator ścieżki przygotowania briefu. Niczego nie wysyła i nie zapisuje danych na serwerze. Na końcu zobaczysz własne podsumowanie. Kontakt do autora strony znajdziesz osobno poniżej formularza.',
  ],
];
