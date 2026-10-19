# Kolejność realizacji

1. Ustalić styl, przygotować spójne wizualizacje koncepcji, lokalne fonty i dane.
2. Zbudować stronę główną; obejrzeć ją na komputerze i telefonie, poprawić kadry i rytm.
3. Rozwinąć ofertę, indeks koncepcji, trzy szczegóły, pracownię, kontakt i 404.
4. Dopracować formularz demo, menu, galerię i FAQ.
5. Sprawdzić build, typy, responsywność, klawiaturę, ścieżkę formularza i wydajność.
6. Uzupełnić README, źródła, opis projektu i rzeczywiste wyniki QA. Oddać lokalną wersję.

Publikacja oraz rzeczywista wysyłka danych są poza tą realizacją. Marka i wnętrza są fikcyjne.

## Stan końcowy — 19 października 2026

Etapy 1–6 wykonane. Powstał lokalny serwis, komplet treści i wizualizacji, formularz, galeria, dokumentacja, zrzuty i nagranie. Build i typy przechodzą; 23 testy przeszły. Lighthouse mobile po pełnym rozszerzeniu: 100 dla strony głównej i 100 dla najcięższej koncepcji. Szczegóły w QA.md. Publikacja pozostaje osobnym krokiem.

## Etap animacji — wykonany

Dodano wejście trzech linii nagłówka, jednorazowy, subtelny ruch tekstu przed wejściem na ekran, natywne przejście zdjęcia między kartą a koncepcją w obie strony oraz mikrointerakcje menu, galerii, przycisków i formularza. Zachowano zwykłą nawigację, treść bez JavaScript i obsługę ograniczonego ruchu. Bez dodatkowych zależności. Przygotowano nowe nagrania desktop/mobile i ponowiono pomiary.

## Rozszerzenie katalogu — wykonane

Dodano interaktywną paletę dębu, jasnego kamienia i zieleni, z obsługą klawiatury, ograniczonego ruchu oraz pełną treścią bez JavaScript. Strona główna, katalog i galerie otrzymały zróżnicowane proporcje zdjęć. Wygenerowano trzy dodatkowe ujęcia z referencjami pierwotnych wizualizacji; każda koncepcja ma teraz dwa ujęcia i jeden opisany wycinek. Zaktualizowano testy, pomiary, zrzuty i nagrania. Wszystkie uzgodnione ulepszenia wizualne są wykonane. Kod jest zapisany w repozytorium GitHub; publiczny hosting pozostaje poza zakresem.

## Korekta płynności przewijania — wykonana

Usunięto wygaszanie i przesuwanie fotografii oraz powiększanie ich po najechaniu. Teksty zachowują pełną widoczność, krótszy ruch i brak opóźnień. Animowanie pomija już widoczne elementy, także przy szybkim przewijaniu i odświeżeniu w środku strony. Test regresji potwierdził miganie na poprzedniej wersji i jego brak po poprawce przy 390 i 1440 px, na pięciu typach stron.
