# Publikacja demo Sęk i Forma

Wybrano dostępny w tej sesji hosting **Sites** dla statycznego eksportu Astro. Nie zakupiono domeny ani dodatkowej usługi. GitHub Pages, inny hosting, domena i workflow publikacji nie były wcześniej skonfigurowane dla tego projektu.

Projekt Sites: `appgprj_6ad71ae3e6048191b88761f375a3ba20`. Powiązanie jest zapisane w `.openai/hosting.json`; pliki publikowane pochodzą z `dist/`. Odbiorcy: publiczni, bez logowania. Zachowaj ten identyfikator przy aktualizacjach zamiast tworzyć nowy projekt.

Adres docelowy: `https://sek-i-forma-portfolio.frostyclove2.chatgpt.site`. Faktyczny wynik wdrożenia i weryfikacji jest zapisany w [aktualnym QA](QA-2026-10-20.md).

## Przygotowanie i aktualizacja

1. Uruchom `npm ci`, jeśli brakuje zależności lub zmienił się lockfile.
2. Ustaw `SITE_URL=https://sek-i-forma-portfolio.frostyclove2.chatgpt.site`. Przykład znajduje się w `.env.example`; `astro.config.mjs` ma ten sam adres domyślny. Przenosząc projekt, nadpisz zmienną, np. `SITE_URL=https://nowa-domena.example npm run build`.
3. Wykonaj `npm run check`, `npm run build` i `npm test`.
4. W Codex z podłączonym pluginem Sites zleć aktualizację **tego istniejącego projektu** z bieżącego repozytorium. Workflow Sites synchronizuje źródła, zapisuje commit, pakuje statyczny build z manifestem, zapisuje wersję i wdraża ją do publicznego projektu. Pełna historia z mediami portfolio przekracza limit przesyłania źródeł Sites. Dlatego wdrożenie ma osobny, lekki katalog źródeł utworzony przez `node scripts/prepare-sites-source.mjs /absolutny/katalog/poza/repo`. Skrypt uruchamiaj z pełnego repozytorium GitHub po zapisaniu zmian w commicie. Przy aktualizacji otwórz istniejący katalog helperem Sites przed synchronizacją, zachowaj jego `.git` przy kolejnych aktualizacjach, a następnie skopiuj bieżący zapisany commit tym samym skryptem. Zainstaluj zależności, zbuduj i opublikuj przez workflow Sites. `SOURCE.json` wskazuje odpowiadający commit GitHub. Kod aplikacji, lockfile, testy i konfiguracja są kopiowane bez zmian; ciężkie media i raporty zostają w pełnym repozytorium GitHub. Usunięcie lub zmiana nazw plików źródłowych wymaga też usunięcia ich starych kopii z katalogu wdrożenia przed buildem. Poświadczenie pochodzi z konektora i przechodzi wyłącznie przez pamięć oraz stdin; nie trafia do repozytorium.
5. Potwierdź zakończenie wdrożenia, potem uruchom `node scripts/verify-demo.mjs`. Skrypt sprawdza publiczny adres, głębokie ścieżki, odświeżanie, zasoby, formularz, galerię, paletę, kontakt i HTTP 404. Inny host: `DEMO_URL=https://nowy-adres.example QA_OUTPUT=/tmp/demo-qa.json node scripts/verify-demo.mjs`.

GitHub `origin` pozostaje repozytorium `JakubLewosz/sekiforma`. Sam `git push` na GitHub nie wdraża strony w Sites; publikacja jest osobnym krokiem. W projekcie nie ma GitHub Actions do automatycznego wdrażania. Nie zapisuj tokenów konektora ani pliku archiwum wdrożenia w Git.

## Ustawienia demo

Cały serwis jest statyczny: bez backendu, bazy i integracji formularza. Celowe `noindex, nofollow` i `robots.txt` blokują indeksowanie demonstracji fikcyjnej pracowni. Canonical i Open Graph wskazują pełne adresy publicznego hosta. Fonty, obrazy i ikona są lokalne.

Przy ewentualnej migracji wystarczy hosting statyczny obsługujący katalogi `*/index.html` oraz własny `404.html` z kodem HTTP 404. Pliki buduje `npm run build`, katalog wyjściowy to `dist/`, serwis działa w głównym katalogu domeny. Ścieżka `/sekiforma/` wymagałaby dodatkowej konfiguracji `base` i odnośników; nie jest używana w tym wdrożeniu.
