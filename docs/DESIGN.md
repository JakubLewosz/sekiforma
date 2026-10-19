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

Ruch ograniczono do krótkich przejść przycisków i delikatnego powiększenia zdjęć. `prefers-reduced-motion` wyłącza przejścia i płynne przewijanie. Treść od początku jest widoczna.

## Granice

To projekt portfolio, bez realnego procesu produkcji i bez panelu klienta. Materiały są wizualną propozycją, nie specyfikacją wykonawczą. Przed wdrożeniem pod domeną należy ustawić pełny adres obrazu Open Graph i świadomie zdecydować o indeksowaniu.
