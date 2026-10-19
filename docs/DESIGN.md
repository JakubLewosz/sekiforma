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

Trzy koncepcje mają po dwa wygenerowane ujęcia AI i po jednym opisanym wycinku pierwszej wizualizacji. Nowe ujęcia powstały z referencji pierwotnych obrazów; zachowują paletę i charakter wnętrz. Obrazy są konwertowane do WebP i generowane przez Astro w rozmiarach responsywnych. Główny obraz ładowany od razu.

Na stronie głównej duża kuchnia otwiera kompozycję, a dwie mniejsze koncepcje tworzą drugi rytm. W katalogu pierwsza koncepcja łączy zdjęcie z opisem obok; dwie kolejne mają przesunięcie pionowe. Galeria szczegółów zestawia jeden duży obraz z dwoma mniejszymi. Na telefonie wszystkie układy przechodzą do jednej kolumny.

Paleta materiałów ma trzy zakładki: dąb, jasny kamień i zgaszona zieleń. Wybór zmienia obraz, opis oraz odnośnik do koncepcji. Strzałki, Home i End przenoszą fokus; Enter i Spacja aktywują wybór, Tab przechodzi do panelu. Kontrolki pojawiają się po uruchomieniu skryptu; bez JavaScript wszystkie trzy opisy i obrazy pozostają dostępne. Obrazy pozostałych paneli są wczytywane, gdy paleta zbliża się do ekranu.

Menu mobilne ujawnia nawigację, Escape je zamyka. Galeria używa natywnego `dialog`, zatrzymuje fokus i przywraca go po zamknięciu. FAQ to natywne `details`. Formularz zachowuje dane podczas cofania; metody i stan nie inicjują transmisji.

## System ruchu

Pierwszy ekran: trzy linie nagłówka odsłaniają się w rytmie 650 ms z opóźnieniami 0/75/150 ms. Opis i działania dołączają łagodnie, a główne zdjęcie jest widoczne od razu. Fokus klawiatury natychmiast odsłania działania.

Przewijanie: zdjęcia i ich kontenery zachowują pełną widoczność oraz stałe położenie w układzie; bez wygaszania, przesuwania i powiększania po najechaniu kursorem. Interakcję na kartach sygnalizuje strzałka. Tekst ma jednorazowy ruch 8 px / 320 ms na komputerze i 6 px / 240 ms na telefonie, bez zmiany przezroczystości i opóźnień między elementami. IntersectionObserver startuje 120 px przed dolną krawędzią ekranu. Przy szybkim przewinięciu lub przywróceniu pozycji pomija animowanie już widocznej treści. Po zakończeniu usuwa efekt; fokus i ograniczony ruch anulują go natychmiast. Skrypt nie steruje przewijaniem.

Koncepcje: natywne przejście między dokumentami łączy tylko wybrane zdjęcie z okładką projektu, także przy powrocie. Czas 620 ms na komputerze i 420 ms na telefonie. Nazwy przejścia są tymczasowe, obsługiwane w `pageswap` i `pagereveal`, z czyszczeniem dla historii przeglądarki. Pozostaje klasyczna nawigacja wielostronicowa; brak dodatkowego routera i bibliotek.

Mikrointerakcje: zmiana materiału 260 ms, menu 180–220 ms z nieaktywnymi ukrytymi odnośnikami, galeria 160–280 ms z ochroną przed spóźnionym wczytaniem zdjęcia, krok formularza 280 ms i pasek postępu 360 ms. Przyciski, strzałki i karty mają ten sam spokojny rytm.

`prefers-reduced-motion` wyłącza wejścia, przejścia dokumentów i płynne przewijanie. Zmiana preferencji w trakcie anuluje aktywne animacje skryptowe. Brak obsługi natywnych przejść oznacza zwykłą nawigację. Pełna treść pozostaje dostępna bez JavaScript.

## Granice

To projekt portfolio, bez realnego procesu produkcji i bez panelu klienta. Materiały są wizualną propozycją, nie specyfikacją wykonawczą. Przed wdrożeniem pod domeną należy ustawić pełny adres obrazu Open Graph i świadomie zdecydować o indeksowaniu.

Źródła implementacji: [przejścia dokumentów](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [ograniczanie ruchu](https://web.dev/learn/accessibility/motion).
