# Materiały i źródła

Przygotowano 19 października 2026. Żadne zdjęcia referencyjnych pracowni nie zostały wykorzystane.

## Wnętrza

Wbudowany ImageGen wygenerował sześć obrazów bazowych 1536 × 1024 px: trzy pierwotne wnętrza i trzy dodatkowe ujęcia. Drugą serię przygotowano na podstawie pierwszych obrazów jako referencji, zachowując charakter zabudowy, paletę i kierunek światła. Użyto wbudowanego narzędzia, bez API ani CLI. Pełne prompty: [pierwsza seria](assets/PROMPTS.json) i [drugie ujęcia](assets/SECOND-VIEWS-PROMPTS.json).

| Pliki bazowe w `docs/assets`  | Warianty używane przez stronę                                 | Zastosowanie                           |
| ----------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `kitchen-original.png`        | `src/assets/kitchen.webp`, `src/assets/kitchen-detail.webp`   | Hero, kuchnia, dąb i detal             |
| `wardrobe-original.png`       | `src/assets/wardrobe.webp`, `src/assets/wardrobe-detail.webp` | Garderoba, detal, kontakt              |
| `living-original.png`         | `src/assets/living.webp`, `src/assets/living-detail.webp`     | Salon, pracownia, detal                |
| `kitchen-angle-original.png`  | `src/assets/kitchen-angle.webp`                               | Drugie ujęcie kuchni i jasny kamień    |
| `wardrobe-angle-original.png` | `src/assets/wardrobe-angle.webp`                              | Drugie ujęcie garderoby                |
| `living-angle-original.png`   | `src/assets/living-angle.webp`                                | Drugie ujęcie salonu i zgaszona zieleń |

Wszystkie sześć źródeł skopiowano do repozytorium. WebP i trzy wycinki tworzy `node scripts/prepare-assets.mjs` przy użyciu Sharp. Każda galeria pokazuje całość koncepcji, nowe ujęcie oraz jawnie opisany wycinek pierwszej wizualizacji. Drugie ujęcia są odrębnymi generacjami AI; nie stanowią dowodu dokładnej zgodności geometrii między widokami. Astro dodatkowo tworzy responsywne rozmiary podczas buildu. `public/og-image.jpg` jest kadrem kuchni z autorskim podpisem marki.

Obrazy przeznaczono do demonstracji fikcyjnych koncepcji w tym projekcie i jego portfolio. Nie są dokumentacją realizacji, projektem wykonawczym ani dowodem pracy z rzeczywistymi klientami. Nie deklarujemy ich wyłączności ani autentyczności fotograficznej. Na stronie widnieją oznaczenia AI i demonstracji.

## Fonty

Lokalne pakiety Fontsource: Manrope 5.3.0 (400/500/600), DM Serif Display 5.3.0 (400 i kursywa). Zestawy latin i latin-ext zawierają polskie znaki. Licencje SIL Open Font License 1.1 zachowano w `docs/licenses/Manrope.txt` i `docs/licenses/DM-Serif-Display.txt`. Kopie licencji są też w `public/licenses`, skąd trafiają do buildu. Nie ma pobierania fontów z Google Fonts podczas korzystania ze strony.

Źródła pakietów: [Manrope](https://fontsource.org/fonts/manrope), [DM Serif Display](https://fontsource.org/fonts/dm-serif-display). Wiążące treści licencji są zapisane lokalnie.

## Grafika wektorowa i teksty

Znak słojów drewna, strzałki i favicon są autorskimi prostymi SVG zapisanymi w kodzie. Teksty opracowano na podstawie briefu z pomocą Codexa. Nie pobierano cudzych zdjęć, logotypów ani opinii.

## Kontakt do autora

Profil [Jakuba Lewosza](https://github.com/JakubLewosz/JakubLewosz/blob/main/README.md) potwierdza adres `jakublewosz6@gmail.com` i profil GitHub. Dane sprawdzono 19 października 2026. Kontakt jest oddzielony od fikcyjnej marki.

## Dokumentacja techniczna sprawdzona podczas realizacji

- [Astro React](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Tailwind w Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Obrazy w Astro](https://docs.astro.build/en/guides/images/)
- [Wymagania Astro](https://docs.astro.build/en/install-and-setup/)

Wersje pakietów dobrano z bieżących stabilnych wydań npm, z TypeScriptem 6.0.3 zgodnym z kontrolą typów Astro; dokładny zestaw utrwalono w lockfile.
