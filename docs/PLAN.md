# Historia realizacji

Poniższy plan i stan z 19 października opisują wcześniejszy zakres. Rozszerzenie portfolio i publikację z 20 października opisano na końcu.

1. Ustalić styl, przygotować spójne wizualizacje koncepcji, lokalne fonty i dane.
2. Zbudować stronę główną; obejrzeć ją na komputerze i telefonie, poprawić kadry i rytm.
3. Rozwinąć ofertę, indeks koncepcji, trzy szczegóły, pracownię, kontakt i 404.
4. Dopracować formularz demo, menu, galerię i FAQ.
5. Sprawdzić build, typy, responsywność, klawiaturę, ścieżkę formularza i wydajność.
6. Uzupełnić README, źródła, opis projektu i rzeczywiste wyniki QA. Oddać lokalną wersję.

Publikacja oraz rzeczywista wysyłka danych są poza tą realizacją. Marka i wnętrza są fikcyjne.

## Stan końcowy — 19 października 2026

Etapy 1–6 wykonane. Powstał lokalny serwis, komplet treści i wizualizacji, formularz, galeria, dokumentacja, zrzuty i nagranie. Build i typy przechodzą; 26 testów przeszło. Lighthouse mobile po pełnym rozszerzeniu: 100 dla strony głównej i 100 dla najcięższej koncepcji. Szczegóły w QA.md. Publikacja pozostaje osobnym krokiem.

## Etap animacji — wykonany

Dodano wejście trzech linii nagłówka, płynne wejścia zdjęć oraz rytmiczne wejścia tekstów, natywne przejście zdjęcia między kartą a koncepcją w obie strony oraz mikrointerakcje menu, galerii, przycisków i formularza. Zachowano zwykłą nawigację, treść bez JavaScript i obsługę ograniczonego ruchu. Bez dodatkowych zależności. Przygotowano nowe nagrania desktop/mobile i ponowiono pomiary.

## Rozszerzenie katalogu — wykonane

Dodano interaktywną paletę dębu, jasnego kamienia i zieleni, z obsługą klawiatury, ograniczonego ruchu oraz pełną treścią bez JavaScript. Strona główna, katalog i galerie otrzymały zróżnicowane proporcje zdjęć. Wygenerowano trzy dodatkowe ujęcia z referencjami pierwotnych wizualizacji; każda koncepcja ma teraz dwa ujęcia i jeden opisany wycinek. Zaktualizowano testy, pomiary, zrzuty i nagrania. Wszystkie uzgodnione ulepszenia wizualne są wykonane. Kod jest zapisany w repozytorium GitHub; publiczny hosting pozostaje poza zakresem.

## Płynne animowane wejścia — wykonane

Zdjęcia odsłaniają się z subtelnym oddaleniem kadru, a teksty i etapy wchodzą w delikatnym rytmie. Stan początkowy ustawiany jest poza ekranem; widoczny już element nie jest ukrywany po starcie skryptu. Obrazy są wcześniej wczytywane i dekodowane. Osobna warstwa odpowiada za zoom kart po najechaniu. Testy wymagają rzeczywistych animacji, sprawdzają ich jednokierunkowy przebieg i odporność na opóźniony skrypt oraz dekodowanie. Zachowano ograniczony ruch, klawiaturę i treść bez JavaScript.

## Portfolio i publiczne demo — 20 października 2026

Dodano progresywną mobilną nawigację, przejście z podsumowania briefu do oferty autora oraz poprawki galerii na niskim ekranie i klawiatury WebKit. Przygotowano publiczny hosting Sites bez zakupu domeny. Pełną historię i materiały zachowano na GitHubie; lekki katalog źródeł wdrożenia omija limit przesyłania repozytorium w Sites. Obsłużono odrzucenie natywnego przejścia podczas zwykłej nawigacji i ograniczono wykrywanie klas Tailwind do źródeł aplikacji. Aktualne wyniki i granice weryfikacji: [QA-2026-10-20.md](QA-2026-10-20.md). Formularz pozostaje demonstracyjny.
