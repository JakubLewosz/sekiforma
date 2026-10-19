# Kontrola jakości — 19 października 2026

Sprawdzono lokalny build produkcyjny. To opis wykonanych kontroli, nie certyfikat dostępności i nie pomiar rzeczywistego ruchu.

## Środowisko

macOS arm64, Node 24.11.0, npm 11.6.1, Astro 7.4.0, lokalny Google Chrome 154 w trybie headless. Testy Playwright 1.64.1; kontrola reguł dostępności axe-core przez `@axe-core/playwright` 4.14.0. Zależności mają dokładne wersje w lockfile. `npm ci` zakończyło się poprawnie; audyt npm podczas instalacji zgłosił 0 podatności.

## Build i typy

- `npm run build`: poprawny statyczny build, 8 adresów treściowych oraz 404, razem 9 stron.
- `npm run check`: bez błędów i ostrzeżeń.
- `npm test`: **11 testów przeszło**. Pełny zapis: [qa-tests.json](qa-tests.json).

## Testy przeglądarkowe

1. Formularz: brak wyboru rodzaju i etapu wywołuje przypisany błąd. Wybór „Jeszcze nie wiem” działa. Cofanie zachowuje etap, opis, termin, imię i e-mail. Błędny adres wymaga poprawki, `anna@example.com` jest akceptowany. Fokus trafia do błędnego pola. Podsumowanie odpowiada wszystkim wpisanym danym. Odświeżenie usuwa stan.
2. Kontrola sieci w ścieżce formularza: po załadowaniu zasobów nie powstają żadne nowe żądania podczas wypełniania, walidacji i podsumowania; brak wysyłania treści formularza. localStorage i sessionStorage pozostają puste. Kod formularza nie używa fetch, XHR ani sendBeacon; metoda `dialog` dodatkowo blokuje zwykłą transmisję formularza.
3. Wszystkie trzy koncepcje poprawnie ustawiają rodzaj briefu.
4. Galeria: otwarcie Enterem, fokus na zamknięciu, zmiana zdjęć strzałkami, pętla Tab, Escape i powrót fokusu do pierwotnego zdjęcia.
5. Mobilne menu i FAQ działają klawiaturą. Escape zamyka menu i przywraca fokus.
6. Każdy z ośmiu adresów sprawdzono przy **320, 390, 768 i 1440 px**: brak poziomego przewijania, pojedynczy H1, metadane, wczytanie obrazów, działające lokalne linki i brak wyjątków JavaScript.
7. Pełną ścieżkę formularza przeprowadzono także przy **320 px samą klawiaturą**, łącznie z podsumowaniem i resetem.
8. Automatyczna kontrola reguł WCAG 2 A/AA, 2.1 AA i 2.2 AA: **0 zgłoszonych naruszeń** na ośmiu stronach, we wszystkich krokach formularza i po podsumowaniu. To zakres reguł obsługiwanych przez axe, bez deklaracji pełnej zgodności WCAG.
9. Główna treść i linki dostępne bez JavaScript; demonstracyjny przycisk formularza pozostaje wyłączony. Własna strona 404 zwraca HTTP 404. Powiększenie tekstu do 200% w symulacji 390 px nie powoduje poziomego przewijania. `prefers-reduced-motion` wyłącza płynne przewijanie.

W czasie kontroli poprawiono kontrast numerów usług i etapów, łamanie tekstu przy powiększeniu oraz zawijanie fokusu w galerii oraz dostępność pól dopiero po uruchomieniu interakcji, aby wybór przed hydratacją nie został utracony.

## Ocena wizualna

Obejrzano zrzuty strony głównej na komputerze i telefonie, szczegóły kuchni, formularz na telefonie i podsumowanie na komputerze. Sprawdzono hierarchię, kadry, widoczność oznaczeń demo, rytm sekcji i stopkę. Dopracowano rozmiary opisów oraz układ stopki mobilnej. Obejrzano też pełną stronę główną z wczytanym detalem materiału.

[Zrzuty ekranu](screenshots/) są rzeczywistymi obrazami strony. [Nagranie](video/przejscie-przez-strone.webm) pokazuje przejście od strony głównej przez kuchnię do podsumowania briefu. Scenariusz można odtworzyć przez `npm run qa:capture` przy działającym preview na porcie 4322.

## Kontrast

Obliczone współczynniki dla głównych par sRGB:

| Tekst / tło           | Kontrast |
| --------------------- | -------: |
| `#242820` / `#F6F3EE` |  13,56:1 |
| `#3E5143` / `#F6F3EE` |   7,70:1 |
| `#FFFFFF` / `#3E5143` |   8,53:1 |
| `#65675E` / `#F6F3EE` |   5,19:1 |

## Lighthouse mobile

Pomiar 19 października 2026 około 09:05 czasu Europe/Warsaw, Lighthouse **13.5.0**, Chrome **154**, lokalny build na `127.0.0.1:4322`. Domyślny mobilny profil symulacji: RTT 150 ms, przepustowość 1638,4 Kbps, spowolnienie CPU ×4, `throttlingMethod: simulate`. Brak ostrzeżeń w obu raportach. Jeden zapisany pomiar na stronę.

| Strona                         | Performance | Accessibility | Best Practices | SEO |   LCP |  TBT |   CLS |
| ------------------------------ | ----------: | ------------: | -------------: | --: | ----: | ---: | ----: |
| `/`                            |     **100** |           100 |            100 |  66 | 1,7 s | 0 ms | 0,002 |
| `/projekty/garderoba-we-wnece` |      **95** |           100 |            100 |  66 | 2,6 s | 0 ms |     0 |

Najcięższą podstronę wybrano po porównaniu zakodowanych zasobów wszystkich koncepcji przy 412 × 823 px, DPR 1,75, z wczytaniem wszystkich zdjęć i osobnym kontekstem bez cache. Garderoba: 348 710 B; salon: 338 932 B; kuchnia: 327 460 B. Szczegóły: [page-weights.json](audits/page-weights.json).

- [Strona główna — raport HTML](audits/home.html), [JSON](audits/home.json).
- [Garderoba — raport HTML](audits/wardrobe.html), [JSON](audits/wardrobe.json).
- [Zestawienie parametrów i metryk](audits/summary.json).

Niższy wynik SEO wynika z celowego `noindex` i blokady indeksowania w robots.txt. Nowe demo nie ma danych terenowych Core Web Vitals ani pomiaru INP z realnego ruchu. TBT nie zastępuje INP; powyższe wyniki nie dowodzą spełnienia Core Web Vitals przez rzeczywistych odwiedzających.

## Granice sprawdzenia

Nie było dostępnego fizycznego telefonu. Widoki mobilne i obsługę klawiaturą sprawdzono w Chrome, bez testu Safari, Firefox i czytnika ekranu. Nie wykonano publicznego wdrożenia, testu poczty ani zewnętrznego podglądu udostępnianego linku. Na produkcji pełny adres Open Graph i canonical są generowane po ustawieniu `SITE_URL`.
