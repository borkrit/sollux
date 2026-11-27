# SOLLUX — landing page

Responsywna strona promocyjna Sollux przygotowana jako zadanie rekrutacyjne na podstawie [projektu w Figmie](https://www.figma.com/design/0IEndSXVS1EK98fLXYNnYN/IdoMods-rekrutacja-frontend-AI?node-id=0-1).

## Uruchomienie

Projekt nie wymaga Node.js, npm ani procesu budowania. Wymaga Pythona 3 oraz połączenia z internetem, ponieważ Tailwind CSS i font Red Hat Display są ładowane z CDN.

Otwórz PowerShell w katalogu głównym projektu:

```powershell
py -m http.server 8000
```

Następnie otwórz <http://localhost:8000>. Serwer lokalny jest potrzebny m.in. do wczytywania plików SVG przez JavaScript. Zatrzymasz go skrótem `Ctrl+C`.

Na macOS/Linux, z katalogu głównego projektu, uruchom:

```sh
python3 -m http.server 8000
```

## Technologie

- HTML5 i Tailwind CSS ładowany z CDN
- własne style w `style.css`
- JavaScript bez frameworków w `main.js`
- WebGL do animacji światła

## Funkcje

- automatyczny slider hero z przyciskami poprzedniego/następnego slajdu
- interaktywne lampy z efektem światła i ruchem reagującym na kursor
- sekcja korzyści i responsywna siatka kart promocyjnych
- animowane tło WebGL w sekcji promocyjnej
- rozwijane kolumny stopki na małych ekranach
- obsługa ograniczenia animacji dla preferencji `prefers-reduced-motion`

## Struktura

- `index.html` — główna strona i punkt wejścia
- `style.css` — style niestandardowe i animacje
- `main.js` — logika slidera, lamp, stopki i shaderu
- `assets/` — obrazy, ikony, fonty i pliki SVG
- `lampa.html`, `lampa2.html`, `lampa3.html` — osobne strony demonstracyjne efektów lamp
- `history-chat/` — archiwalne pliki JSON z rozmowami

## Przed przekazaniem zadania

- Dołącz komplet rozmów z AI. Eksporty w `history-chat/` nie zawierają jawnej listy użytych skillów, pluginów ani serwerów MCP — uzupełnij te informacje w kopii archiwum przed wysłaniem.
- Usuń z przekazywanej kopii sekrety i niezwiązane dane osobowe. Dwa ciągi wyglądające na klucze API w `history-chat/chat.json` oraz lokalne nazwy profilu Windows w archiwach zostały zastąpione przez `[REDACTED]`; przed wysłaniem sprawdź ponownie wszystkie archiwa.
- `.vscode/mcp.json` zawiera lokalną konfigurację środowiska i nie jest potrzebny do uruchomienia strony. Nie dołączaj go do publicznego archiwum bez uprzedniego sprawdzenia.
- Część odnośników nawigacji, społecznościowych i stopki ma tymczasowe cele `#...`; nie prowadzą do osobnych podstron.
