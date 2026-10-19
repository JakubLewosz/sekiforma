# Kontrola jakości — 19 października 2026

Sprawdzono lokalny build produkcyjny. To opis wykonanych kontroli, nie certyfikat dostępności i nie pomiar rzeczywistego ruchu.

## Środowisko

macOS arm64, Node 24.11.0, npm 11.6.1, Astro 7.4.0, lokalny Google Chrome 154 w trybie headless. Testy Playwright 1.64.1; kontrola reguł dostępności axe-core przez `@axe-core/playwright` 4.14.0. Zależności mają dokładne wersje w lockfile. `npm ci` zakończyło się poprawnie; audyt npm podczas instalacji zgłosił 0 podatności.

## Build i typy

- `npm run build`: poprawny statyczny build, 8 adresów treściowych oraz 404, razem 9 stron.
- `npm run check`: bez błędów i ostrzeżeń.
- `npm test`: **23 testy przeszły**. Pełny zapis: [qa-tests.json](qa-tests.json).

## Testy przeglądarkowe

1. Formularz: brak wyboru rodzaju i etapu wywołuje przypisany błąd. Wybór „Jeszcze nie wiem” działa. Cofanie zachowuje etap, opis, termin, imię i e-mail. Błędny adres wymaga poprawki, `anna@example.com` jest akceptowany. Fokus trafia do błędnego pola. Podsumowanie odpowiada wszystkim wpisanym danym. Odświeżenie usuwa stan.
2. Kontrola sieci w ścieżce formularza: po załadowaniu zasobów nie powstają żadne nowe żądania podczas wypełniania, walidacji i podsumowania; brak wysyłania treści formularza. localStorage i sessionStorage pozostają puste. Kod formularza nie używa fetch, XHR ani sendBeacon; metoda `dialog` dodatkowo blokuje zwykłą transmisję formularza.
3. Wszystkie trzy koncepcje poprawnie ustawiają rodzaj briefu.
4. Galeria: po trzy widoki każdej koncepcji, otwarcie Enterem, fokus na zamknięciu, zmiana zdjęć strzałkami, pętla Tab, Escape i powrót fokusu do pierwotnego zdjęcia. Szybkie zmiany nie podmieniają aktywnego obrazu spóźnioną odpowiedzią. Dialog jest wyśrodkowany i mieści się w dostępnym obszarze ekranu.
5. Mobilne menu i FAQ działają klawiaturą. Escape zamyka menu i przywraca fokus.
6. Każdy z ośmiu adresów sprawdzono przy **320, 390, 768 i 1440 px**: brak poziomego przewijania, pojedynczy H1, metadane, wczytanie obrazów, działające lokalne linki i brak wyjątków JavaScript.
7. Pełną ścieżkę formularza przeprowadzono także przy **320 px samą klawiaturą**, łącznie z podsumowaniem i resetem.
8. Automatyczna kontrola reguł WCAG 2 A/AA, 2.1 AA i 2.2 AA: **0 zgłoszonych naruszeń** na ośmiu stronach, we wszystkich krokach formularza i po podsumowaniu. Skan wykonano po zakończeniu trwających animacji, aby ocenić docelowy kontrast. To zakres reguł obsługiwanych przez axe, bez deklaracji pełnej zgodności WCAG.
9. Główna treść i linki dostępne bez JavaScript; demonstracyjny przycisk formularza pozostaje wyłączony. Własna strona 404 zwraca HTTP 404. Powiększenie tekstu do 200% w symulacji 390 px nie powoduje poziomego przewijania. `prefers-reduced-motion` wyłącza płynne przewijanie.

10. Tekst porusza się jednorazowo przed wejściem na ekran, zawsze przy pełnej widoczności. Powrót do sekcji nie odtwarza efektu. Zmiana preferencji na ograniczony ruch anuluje aktywny efekt. Szybkie przejście bezpośrednio do widocznej treści pomija animację.
11. Natychmiastowe wyłączenie wejścia nagłówka i tekstu przy `prefers-reduced-motion: reduce`, z zachowaniem nawigacji.
12. Natywne przejście wybranego zdjęcia z karty do okładki koncepcji i po powrocie sprawdzono przy 390 i 1440 px. Przeglądarka faktycznie utworzyła wspólną grupę obrazu z czasem 420 lub 620 ms.
13. Po wyłączeniu natywnych przejść w CSS nawigacja, otwarcie galerii i jej zamknięcie nadal działają. To symulacja braku efektu w Chrome, bez deklaracji sprawdzenia innych silników.

14. Paleta materiałów: wskaźnik i klawiatura (strzałki, Home, End, Enter, Spacja, Tab), właściwy obraz, opis i odnośnik, jeden aktywny panel. Wszystkie trzy wybory sprawdzono przy 320 i 1440 px, także przy ograniczonym ruchu i powiększonym tekście. W zwykłym widoku zmiana materiału nie przesuwa kolejnej treści; brak poziomego przewijania.
15. Każdy panel palety przeszedł skan axe WCAG A/AA. Bez JavaScript wszystkie trzy opisy pozostają widoczne, a nieaktywne kontrolki są ukryte.

16. Regresja migania zdjęć: przed poprawką test przy 390 i 1440 px odtworzył spadek efektywnej przezroczystości zdjęć do 0 podczas scrollowania. Po poprawce, na stronie głównej, katalogu, ofercie, szczegółach kuchni i w pracowni, próbki kolejnych klatek przy przewijaniu w dół i w górę zachowują przezroczystość 1 i brak transformacji zdjęć oraz ich przodków. Kursor pozostaje nieruchomy nad treścią, aby objąć przypadkowe wyzwalanie hover przy scrollowaniu. Przewijanie obejrzano również w otwartym podglądzie aplikacji. To kontrola widoczności i położenia, bez deklaracji stałej liczby FPS na każdym urządzeniu.

W czasie kontroli poprawiono kontrast numerów usług i etapów, łamanie tekstu przy powiększeniu oraz zawijanie fokusu w galerii oraz dostępność pól dopiero po uruchomieniu interakcji, aby wybór przed hydratacją nie został utracony. Końcowa regresja wykryła wyścig opóźnionego fokusu błędu z szybkim wypełnianiem pól; fokus przenosi się teraz po aktualizacji DOM w efekcie układu, bez opóźnionego requestAnimationFrame.

## Ocena wizualna

Obejrzano zrzuty strony głównej na komputerze i telefonie, szczegóły kuchni, formularz na telefonie i podsumowanie na komputerze. Sprawdzono hierarchię, kadry, widoczność oznaczeń demo, rytm sekcji i stopkę. Dopracowano rozmiary opisów oraz układ stopki mobilnej. Obejrzano też pełną stronę główną z wczytanym detalem materiału, nowy katalog na komputerze i telefonie, trzy warianty palety oraz dodatkowe ujęcie w powiększeniu. Poprawiono szerokość zakładek przy powiększeniu tekstu, stałą wysokość opisów na małym ekranie oraz położenie dialogu galerii.

[Zrzuty ekranu](screenshots/) są rzeczywistymi obrazami strony. Pełne zrzuty pokazują ustalony układ przy ograniczonym ruchu, aby uniknąć uchwycenia połowy wejścia sekcji; osobne kadry przejść i nagrania zachowują animacje. [Nagranie](video/przejscie-przez-strone.webm) pokazuje przejście od strony głównej przez kuchnię do podsumowania briefu. Dodatkowe nagrania prezentują animacje na [komputerze](video/animacje-desktop.webm) i [telefonie](video/animacje-mobile.webm). Obejrzano również kadry w trakcie natywnego przejścia przy obu szerokościach. Paletę i dodatkowe ujęcia dokumentują nagrania na [komputerze](video/materialy-i-ujecia-desktop.webm) i [telefonie](video/materialy-i-ujecia-mobile.webm). Przejrzano próbne kadry z obu nagrań. Poprawione przewijanie pokazują osobne nagrania [desktop](video/scroll-desktop.webm) i [mobile](video/scroll-mobile.webm), odtwarzane przez `node scripts/capture-scroll.mjs`. Scenariusze można odtworzyć przez `npm run qa:capture`, `node scripts/capture-motion.mjs` i `node scripts/capture-materials.mjs` przy działającym preview na porcie 4322.

## Kontrast

Obliczone współczynniki dla głównych par sRGB:

| Tekst / tło           | Kontrast |
| --------------------- | -------: |
| `#242820` / `#F6F3EE` |  13,56:1 |
| `#3E5143` / `#F6F3EE` |   7,70:1 |
| `#FFFFFF` / `#3E5143` |   8,53:1 |
| `#65675E` / `#F6F3EE` |   5,19:1 |

## Lighthouse mobile

Ostatni zapisany pomiar po dodaniu palety i dodatkowych obrazów, przed korektą animacji przewijania: 19 października 2026 około 10:40 czasu Europe/Warsaw, Lighthouse **13.5.0**, Chrome **154**, lokalny build na `127.0.0.1:4322`. Domyślny mobilny profil symulacji: RTT 150 ms, przepustowość 1638,4 Kbps, spowolnienie CPU ×4, `throttlingMethod: simulate`. Brak ostrzeżeń w obu raportach. Tabela przedstawia ostatni zapisany pomiar każdej strony.

| Strona                         | Performance | Accessibility | Best Practices | SEO |   LCP |  TBT |   CLS |
| ------------------------------ | ----------: | ------------: | -------------: | --: | ----: | ---: | ----: |
| `/`                            |     **100** |           100 |            100 |  66 | 1,1 s | 0 ms |     0 |
| `/projekty/garderoba-we-wnece` |     **100** |           100 |            100 |  66 | 1,4 s | 0 ms | 0,001 |

Najcięższą podstronę wybrano ponownie po dodaniu ujęć, porównując zakodowany dokument i zasoby wszystkich koncepcji przy 412 × 823 px, DPR 1,75, z wczytaniem wszystkich zdjęć osadzonych w stronie i osobnym kontekstem bez cache. Garderoba: 420 169 B; salon: 415 592 B; kuchnia: 392 167 B. Pełne obrazy powiększenia są wczytywane dopiero po otwarciu galerii i nie wchodzą do tej sumy. Szczegóły: [page-weights.json](audits/page-weights.json), odtworzenie: `node scripts/measure-page-weights.mjs`.

- [Strona główna — raport HTML](audits/home.html), [JSON](audits/home.json).
- [Garderoba — raport HTML](audits/wardrobe.html), [JSON](audits/wardrobe.json).
- [Zestawienie parametrów i metryk](audits/summary.json).

Niższy wynik SEO wynika z celowego `noindex` i blokady indeksowania w robots.txt. Nowe demo nie ma danych terenowych Core Web Vitals ani pomiaru INP z realnego ruchu. TBT nie zastępuje INP; powyższe wyniki nie dowodzą spełnienia Core Web Vitals przez rzeczywistych odwiedzających.

## Granice sprawdzenia

Nie było dostępnego fizycznego telefonu. Widoki mobilne i obsługę klawiaturą sprawdzono w Chrome, bez testu Safari, Firefox i czytnika ekranu. Nie wykonano publicznego wdrożenia, testu poczty ani zewnętrznego podglądu udostępnianego linku. Na produkcji pełny adres Open Graph i canonical są generowane po ustawieniu `SITE_URL`.
