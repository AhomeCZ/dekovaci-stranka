# Děkovací stránka — kontext pro agenta

Statické HTML prototypy **děkovací stránky po objednávce** v e-shopu na
Shoptetu. Slouží k A/B testům a design review — reálná implementace proběhne
až na Shoptetu. Žádný build, žádné závislosti: otevřeš `.html` a jede to.

Repo: <https://github.com/kikahome/dekovaci-stranka>, větev `main`.
Commit zprávy a komentáře v kódu jsou česky.

## Tři stavy objednávky

Podle způsobu platby se liší, co se na stránce ukáže:

| Soubor | Stav | Co se děje |
|---|---|---|
| `dekovacka_obj_prevodem.html` | Objednávka přijata | **Platba převodem** — rovnou v děkovací kartě QR kód a platební údaje |
| `dekovacka_obj_kartou.html` | Objednávka zaplacena | **Platba kartou** — už zaplaceno přes platební bránu |
| `dekovacka_obj_dobirka.html` | Objednávka přijata | **Dobírka** — o platbě se nepíše nic, platí se až na místě |

Ve všech třech je nabídka doplňkových produktů a tlačítka **Nechci / Chci**.
U karty vede „Doplatit" na QR okno (doplácí se jen přibalené doplňky),
u převodu a dobírky vede „Uzavřít objednávku" rovnou na děkovací kartu.

Starší varianty (`dekovac*.html`, `kosik-jina-barva.html`) jsou dřívější
pokusy s pozicí a barvou slevového štítku.

## Soubory

- **`styles.css`** — všechen layout a komponenty (~3 760 řádků, historicky
  rozrostlé). ⚠️ Viz Pasti.
- **`theme-violet.css`** — barevné tokeny, výchozí paleta
- Malé CSS soubory variant: `no-badge`, `badge-*`, `kosik-barva`,
  `uznic` (Nechci/Chci + děkovací karta), `obj-prijata` (modré potvrzení),
  `prevodem` (karta s QR a platebními údaji)
- **`theme-zelena.css` + `.js`** — zelená varianta pro A/B test

## Zelená varianta

Otevři stránku s `?theme=zelena`, např.
`dekovacka_obj_prevodem.html?theme=zelena`. Bez parametru je růžová
(kontrolní varianta). Přepínač v `<head>` si theme soubory najde podle názvu.

- **Barvy** jsou v jednom bloku proměnných `--z-*` nahoře v `theme-zelena.css`,
  níž se hexy neopakují.
- **Obrázky a texty** jsou v bloku `ZADÁNÍ` nahoře v `theme-zelena.js` — CSS
  je změnit neumí.
- **Nová barva** = kopie obou souborů pod jménem `theme-<nazev>.*` a
  `?theme=<nazev>`. V HTML se nemění nic.

Na Shoptetu je tenhle pár souborů celý výstup — A/B nástroj vpustí variantě B
právě jen CSS a kousek JS navíc.

## JavaScript

V každém HTML je na konci `<body>` zkopírovaný stejný skript: produkty a
košík, 15minutový odpočet, úprava e-mailu, `showThanks()` pro děkovací kartu
a blok, který **dopočítá celou paletu ze tří barev a zapíše ji inline na
`<html>`**.

Dva důsledky, na které narazíš:

- Změna chování se musí udělat v každém souboru zvlášť.
- Theme CSS potřebuje `!important` — inline styl z toho skriptu přebije
  každý stylesheet.

V `theme-zelena.js` navíc: před nastavením `src` obrázku vynuluj `img.onerror`
(stránka má vlastní hledač maskotů, který by ho přepsal zpátky) a texty, které
přepisuje `showThanks()`, je potřeba ošetřit obalením té funkce.

## ⚠️ Pasti

1. **`styles.css` nikdy nekonsolidovat skriptem.** Už to jednou rozbilo
   stránku: sloučení stejných selektorů posunulo pozdější pravidla před
   `@media` bloky, které předtím přebíjely. Úklid dělat ručně po malých
   kouscích s kontrolou na 375 / 768 / 1200 px.
2. **Drobné opravy přidávej na konec souboru**, klidně s `!important`, místo
   hledání všech výskytů selektoru. Pozor na specificitu — `styles.css` má
   pravidla se selektory typu `html[data-palette] …`, která prostou třídu
   přebijí.
3. **Zkratka `background` maže `background-image`.** U tlačítek s gradientem
   používej `background-color`, jinak zmizí přechod (takhle zbělalo tlačítko
   „Zpět do obchodu").
4. **404 na maskoty v konzoli jsou normální** — hledač obrázků zkouší cesty,
   které v repu nejsou, a spadne na fallback z HTML. Neopravovat.
5. **Jména souborů se mění** — před editací si vypiš obsah složky. A když se
   změna neprojevila, bývá to cache: Ctrl+Shift+R.
