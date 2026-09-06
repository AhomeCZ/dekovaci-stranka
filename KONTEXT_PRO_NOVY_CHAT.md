# Kontext: Děkovací stránka (A/B varianty) — thankyou-repo

Repo: https://github.com/kikahome/thankyou, lokální klon:
`C:\Users\babil\OneDrive\Plocha\School\My projects\thankyou-repo`

Vzniká z toho postupně vícero HTML variant pro A/B testování a design review
"děkovací" (thank you) stránky po objednávce v e-shopu (Shoptet). Statické
prototypy — reálná implementace (větvení podle platby kartou/dobírkou) proběhne
až na Shoptetu.

## Architektura souborů

- **`dekovac.html`** — originál (badge "-63 %" v rohu fotky, růžový gradient)
- **`styles.css`** — sdílený layout/komponenty/animace pro VŠECHNY verze. Je to
  starý, historicky rozrostlý soubor (~3750 řádků) s mnoha duplicitními bloky
  stejných selektorů na různých místech (pozůstatek starších iterací před naší
  spoluprací) — **⚠️ NEPOKOUŠET SE TO ZNOVU "SJEDNOTIT"/DEDUPLIKOVAT
  jedním skriptem** (viz sekce Nebezpečí níže, proč to selhalo).
- **`theme-violet.css`** / **`theme-green.css`** — barevné tokeny (aktuálně se
  používá jen violet)
- Malé CSS soubory pro jednotlivé varianty (viz tabulka), vždy jen pár řádků
  navíc nad `styles.css`
- **`assets/`** — obrázky vytažené z původního base64 (byly nacpané přímo v
  HTML, což způsobovalo pomalé načítání a "flash" špatně vykresleného obsahu)

## Existující HTML verze

| Soubor | Vychází z | CSS navíc | Popis |
|---|---|---|---|
| `dekovac.html` | — | — | originál, badge v rohu fotky |
| `dekovac-badge-dole.html` | dekovac.html | `badge-bottom.css` | badge přesunutý do cenového bloku (nad cenu) |
| `dekovac-bez-slevy.html` | dekovac.html | `no-badge.css` | bez badge, jen přeškrtnutá cena |
| `dekovac-badge-barva.html` | dekovac-badge-dole.html | `badge-bottom.css` + `badge-color.css` | badge v cenovém bloku, oranžová |
| `dekovac-badge-oranzova.html` | dekovac.html | `badge-gradient.css` | badge v rohu fotky, gradient červeno-oranžová |
| `dekovacka_uznic.html` | dekovac-bez-slevy.html | `no-badge.css` + `uznic.css` | + tlačítko "Nechci"/"Chci" v kartě Mňau tip, po kliknutí schová nabídku a ukáže kartu s kočkou v krabici + "Zpět do obchodu" |
| `kosik-jina-barva.html` | dekovacka_uznic.html | `no-badge.css` + `uznic.css` + `kosik-barva.css` | + tlačítko košíku má světlé pozadí a barevnou ikonku `#A716BE` místo tučného gradientu |

## Poslední rozpracovaný úkol (NEDOKONČENO)

V `kosik-jina-barva.html` / `kosik-barva.css` jsme právě dolaďovaly kontrast
tlačítka košíku (byl neviditelný text na světlém pozadí — opraveno) a **právě
teď měla proběhnout kontrola, jestli je vše čitelné** — čekám na její vizuální
feedback, jestli je tlačítko OK, nebo je potřeba doladit ještě něco dalšího.

## ⚠️ Nebezpečí — co se NEPOVEDLO a proč

Uživatelka požádala "sjednoť ty styly v CSS" (chtěla mít každý selektor jen
jednou, ne rozházený po 400 řádcích). Napsal jsem Python skript, který
mechanicky slučoval všechny výskyty stejného selektoru do jednoho bloku na
místě PRVNÍHO výskytu. Ověřil jsem to skriptem přes tinycss2, který porovnával
"poslední vyhrává" hodnotu na plochém seznamu — vyšlo to jako 100% identické,
tak jsem to nasadila do produkce.

**Bug:** ověřovací skript nezohledňoval, že @media bloky a "obyčejná" pravidla
mají RŮZNOU pozici v souboru a vzájemně se přebíjí podle POŘADÍ v dokumentu,
ne jen podle obsahu. Když skript sloučil pozdější "finální" pravidlo (které
jsem přidávala na konec souboru přes celou konverzaci) zpátky k prvnímu
výskytu stejného selektoru (často brzy v souboru), fyzicky se to posunulo PŘED
media query bloky, které předtím správně přebíjelo — takže na desktopu najednou
vyhrávaly staré/jiné hodnoty (mj. `.summary-note strong`, `.confirm h1`,
`.section-head h2`, a dokonce `.story{display:none}` vs `grid`, `.confirm
{display:grid}` vs `flex` — **strukturální regrese, ne jen velikosti textu**).

Napsala jsem druhý ověřovací skript (`verify_viewport.py`), který správně
simuluje cascade PRO KONKRÉTNÍ ŠÍŘKU OBRAZOVKY (vyhodnocuje min/max-width
podmínky jako boolean a jde dokumentem popořadě) — tím se bug odhalil (59
rozdílů při 1200px). **Vrátila jsem se k záloze** (`styles.css.bak_pre_consolidate`,
`uznic.css.bak_pre_consolidate` — pořád leží v repu, klidně smazat, až bude
jistota, že vše sedí) a ručně znovu aplikovala jen ty úpravy, co proběhly MEZI
zálohou a objevením bugu (gradient pozadí stránky zrušen, gradient "Mňau tip"
karty, zmenšení odpočtu/nadpisu v souhrnné liště na desktopu).

**Pokud se příště bude řešit úklid `styles.css`:** dělat to jen ručně/postupně
po malých kouscích s vizuální kontrolou při KAŽDÉ šířce obrazovky (mobil +
desktop), nikdy ne hromadným skriptem bez cascade-aware ověření přes reálné
šířky.

## Zavedený bezpečný postup pro drobné CSS opravy

Když je potřeba přebít nějakou hodnotu, kterou má `.styles.css` rozházenou na
mnoha místech (typický vzor v tomhle souboru), **nehledat a needit VŠECHNY
výskyty** — místo toho přidat nové, jasně okomentované pravidlo na **úplný
konec souboru**, klidně s `!important`, pokud je to potřeba přebít i
`!important` pravidlo výš. Nekonfliktní vlastnost fyzicky poslední v souboru
vždy vyhraje nad stejně specifickým pravidlem dřív v souboru (funguje to i
napříč media queries, pokud je nové pravidlo bez media podmínky — pak platí
vždy, na všech šířkách). Tenhle vzor jsme použili desítkykrát a funguje
spolehlivě, pokud se **výsledek ověří na více šířkách** (375/768/1200px) přes
`verify_viewport.py` (leží v `C:\Users\babil\AppData\Local\Temp\claude\...\scratchpad\`
— pokud tam po ukončení session nebude, dá se snadno napsat znovu, princip je
v předchozí sekci).

## Styl komunikace s uživatelkou

- Píše velmi stručně, často jen pár slov, občas s překlepy — normální, nejde o
  nedbalost
- Rychlé iterace: "větší", "menší", "zkus jinou barvu" — očekává okamžitou
  malou úpravu, ne rozsáhlé vysvětlování
- Často posílá screenshoty s kolečky/šipkami nakreslenými přes obrázek — je
  potřeba si je pozorně prohlédnout, co přesně ukazují
- Když je nejasné, co přesně chce (dvojznačný požadavek), je v pohodě se
  doptat přes `AskUserQuestion` — sama to i výslovně řekla ("klidně se mě
  doptej")
- Testuje i sama přes Chrome DevTools (má nastavený Workspace propojený s touto
  složkou) — občas se v souboru objeví její vlastní drobné úpravy (viděli jsme
  invalidní `font-size: 0.85;` bez jednotky, které jsem opravila)
- Někdy píše pracovní výkaz/soupis pro Asanu nebo dává instrukce pro
  komunikaci se šéfem/kolegy — to jsou samostatné, nekódové úkoly v rámci
  stejné konverzace

## Co dělat hned na začátku nové session

1. Zkontrolovat `git status` v repu — spousta netracked souborů, nic zatím
   nebylo commitnuto přes celou tuhle práci
2. Zeptat se, jestli feedback na `kosik-jina-barva.html` dorazil / je potřeba
   ještě něco doladit
3. Pokud bude chtít pokračovat v úklidu `styles.css`, postupovat MALÝMI kroky
   s ověřením na více šířkách, ne hromadně
