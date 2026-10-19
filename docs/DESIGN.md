# Decyzje projektowe

## Kierunek

Katalog współczesnych wnętrz: kremowe płaszczyzny, spokojne linie i duża fotografia. Zieleń prowadzi do przygotowania briefu; drewno jest głównym akcentem w obrazach. Kompozycja powstała na podstawie planu, bez kopiowania cudzych serwisów.

## System

- Tło `#F6F3EE`, tekst `#242820`, przyciski `#3E5143`, powierzchnia `#E7DFD3`.
- Manrope 400/500/600 dla tekstu, DM Serif Display 400 (prosta i kursywa) dla nagłówków. Lokalne WOFF2, zestawy latin i latin-ext z polskimi znakami.
- Szerokość treści do 1280 px. Rytm odstępów oparty na 4/8 px; obszary od 24 do 104 px, większe sekcje dla oddechu.
- Zdjęcia i przyciski z narożnikami 3–4 px. Oszczędne linie i brak ciężkich cieni.
- Układ jednokolumnowy na telefonie, bez poziomego karuzelowania treści.

## Obrazy i interakcje

Trzy spójne wizualizacje AI. Detale są rzeczywistymi wycinkami, opisanymi jako wycinki, aby nie sugerować kolejnych ujęć nieistniejącego wnętrza. Obrazy konwertowane do WebP i generowane przez Astro w rozmiarach responsywnych. Główny obraz ładowany od razu.

Menu mobilne ujawnia nawigację, Escape je zamyka. Galeria używa natywnego `dialog`, zatrzymuje fokus i przywraca go po zamknięciu. FAQ to natywne `details`. Formularz zachowuje dane podczas cofania; metody i stan nie inicjują transmisji.

## System ruchu

Pierwszy ekran: trzy linie nagłówka odsłaniają się w rytmie 650 ms z opóźnieniami 0/75/150 ms. Opis i działania dołączają łagodnie, a główne zdjęcie jest widoczne od razu. Fokus klawiatury natychmiast odsłania działania.

Sekcje: jednorazowe wejście 20 px / 620 ms na komputerze oraz 12 px / 460 ms na telefonie. Karty i etapy procesu mają niewielkie przesunięcia czasowe. IntersectionObserver uruchamia Web Animations API; po zakończeniu usuwa efekt i jego warstwę. Domyślne style nie ukrywają treści. Skrypt nie opóźnia dostępu do informacji ani nie steruje przewijaniem. Fokus odsłania animowany element natychmiast.

Koncepcje: natywne przejście między dokumentami łączy tylko wybrane zdjęcie z okładką projektu, także przy powrocie. Czas 620 ms na komputerze i 420 ms na telefonie. Nazwy przejścia są tymczasowe, obsługiwane w `pageswap` i `pagereveal`, z czyszczeniem dla historii przeglądarki. Pozostaje klasyczna nawigacja wielostronicowa; brak dodatkowego routera i bibliotek.

Mikrointerakcje: menu 180–220 ms z nieaktywnymi ukrytymi odnośnikami, galeria 160–280 ms z ochroną przed spóźnionym wczytaniem zdjęcia, krok formularza 280 ms i pasek postępu 360 ms. Przyciski, strzałki i karty mają ten sam spokojny rytm.

`prefers-reduced-motion` wyłącza wejścia, przejścia dokumentów i płynne przewijanie. Zmiana preferencji w trakcie anuluje aktywne animacje skryptowe. Brak obsługi natywnych przejść oznacza zwykłą nawigację. Pełna treść pozostaje dostępna bez JavaScript.

## Granice

To projekt portfolio, bez realnego procesu produkcji i bez panelu klienta. Materiały są wizualną propozycją, nie specyfikacją wykonawczą. Przed wdrożeniem pod domeną należy ustawić pełny adres obrazu Open Graph i świadomie zdecydować o indeksowaniu.

Źródła implementacji: [przejścia dokumentów](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [ograniczanie ruchu](https://web.dev/learn/accessibility/motion).
