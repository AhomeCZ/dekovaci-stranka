# Děkovací stránka s nabídkou

Statické prototypy **děkovací stránky po objednávce** pro e-shop na Shoptetu.
Na stránce se zákazníkovi nabídne, že si k objednávce přibalí ještě něco
navíc. Cílem je zvednout průměrnou objednávku, aniž by to působilo otravně.

Prototypy slouží k design review, k odsouhlasení chování a jako podklad pro
vývoj. Ostrá implementace proběhne až na Shoptetu.

**Žádný build, žádné závislosti.** Otevřeš `.html` a jede to.

📐 **Schéma pro vývoj:** [Figma — Děkovací stránka, flow tlačítek](https://www.figma.com/design/zPbLOoE7noVshtCugyts2e/D%C4%9Bkovac%C3%AD-str%C3%A1nka-%E2%80%93-flow-tla%C4%8D%C3%ADtek?node-id=2601-9)
Každý snímek je skutečný stav prototypu, šipky ukazují, které tlačítko kam
vede, a pod snímkem je seznam všech tlačítek.

---

## Tři stránky podle způsobu platby

Doplatek se v každém způsobu platby chová jinak, proto tři samostatné soubory.

| Soubor | Stav objednávky | Jak se platí doplatek |
|---|---|---|
| `dekovacka_obj_kartou.html` | zaplacená | zvlášť přes platební bránu |
| `dekovacka_obj_dobirka.html` | přijatá | nijak, připíše se k dobírce |
| `dekovacka_obj_prevodem.html` | čeká na zaplacení | přičte se do QR kódu |

### Hlavní tlačítko

| Stránka | Prázdný košík | Něco přidáno |
|---|---|---|
| kartou | **Vyberte něco navíc** | **Přibalit a zaplatit** |
| dobírka | Uzavřít objednávku | Uzavřít objednávku |
| převodem | Uzavřít objednávku | Uzavřít objednávku |

U karty je ve slovech „zaplatit", protože následuje přesměrování do brány.

S prázdným košíkem tlačítko nabídku neukončuje — jen odroluje k produktům.
Nabídku odmítá výhradně „Nechci", aby odmítnutí nebylo na hlavním tlačítku.
U zbylých dvou se online neplatí nic, tak tam nemá co dělat.

---

## Jak se stránka chová

### Rozhodnutí je nevratné

Jakmile zákazník klikne na **Nechci** nebo objednávku uzavře, nabídka
i pruh „Mňau tip" zmizí natrvalo a zpátky se k nim nedostane.

Rozhodnutí, do kterého se dá vracet, není rozhodnutí — vede k přemýšlení
dokola místo dokončení. U převodu to má i tvrdý důvod: kdyby se dalo vrátit,
musela by se přegenerovat částka v QR a hrozilo by, že zákazník zaplatí
sumu, která už neplatí.

### Odmítnout jde na dvou místech

**Nechci** je v pruhu „Mňau tip" nahoře i ve spodní liště. Obě dělají totéž
a obě **vysypou košík**, aby to, co je vidět na obrazovce, sedělo s částkou
k zaplacení.

Nahoře je proto, aby se kvůli odmítnutí nemuselo scrollovat pod výpis
produktů, který se donačítá.

### Košík

- Šipka v liště ho rozbalí, uvnitř jsou **− / +** u položek a **Odebrat vše**
- **Po přidání dalšího produktu se sám sbalí** — rozbalený zabíral půl
  obrazovky a překrýval zrovna ty produkty, ze kterých se přidává
- Řádek **K doplacení** ukazuje součet přibalených věcí, ne cenu objednávky

### Detail produktu

Otevře se klepnutím na fotku nebo název. Galerie pěti fotek, listuje se
prstem nebo šipkami vlevo/vpravo; šipka v krajní poloze zešedne. Přidat do
košíku jde jen z dlaždice, ne z detailu.

### Konec

Karta a dobírka mají **jednu koncovou obrazovku** — „Nechci" i uzavření
objednávky vedou na tu samou:

> **Díky! Balíme 🐾**
> Objednávku už chystáme, brzy vyrazí k vám.

U převodu je text jiný schválně, protože tam zákazník ještě nezaplatil:

> **Děkujeme 🐾**
> Objednávku máme u sebe, čeká na zaplacení.

---

## Platba u převodu

QR kód a platební údaje se **vygenerují až po rozhodnutí**, ne během
prohlížení. Kdyby tam byly od začátku, zákazník si může naskenovat částku,
která se pak změní, a platba nebude sedět s objednávkou.

| Cesta | Částka v QR |
|---|---|
| Uzavřít objednávku s přibalenými věcmi | 997 Kč + doplatek = **1 094 Kč** |
| Nechci | původní **997 Kč** |

Údaje pod QR (částka, číslo účtu, IBAN, variabilní symbol) mají u sebe ikonu
kopírování. **IBAN se kopíruje bez mezer**, s mezerami ho formuláře bank
neberou.

**Uložit QR do telefonu** převede kód na PNG a nabídne ho systémovému
sdílení („Uložit obrázek"); na počítači se rovnou stáhne. QR je na stránce
inline SVG, které si telefon do galerie neuloží, proto ten převod.

---

## Platba kartou

Tlačítko **Přibalit a zaplatit** vede do platební brány. Statická stránka
přesměrovat neumí, takže je místo ní snímek skutečné ComGate brány
(`assets/platebni-brana.png`) — klepnutím na něj se proklikáš dál na
děkovačku, takže jde ukázat celá cesta včetně návratu po zaplacení.

**Pro vývoj:** návratová URL z brány musí mířit na děkovačku, ne na běžnou
stránku po objednávce. A pravdu o platbě zná jen serverový callback z brány,
ne návratová URL — pokud zákazník zavře okno, stránka se nikdy nedozví, jak
to dopadlo.

### Když se doplatek nepodaří zaplatit

Po návratu z brány se místo nabídky ukáže jedna karta. Liší se jen ikonou,
nadpisem, textem a tlačítky — samostatné obrazovky by se lišily jednou větou.

| Situace | Nadpis | Hlavní tlačítko | Vedlejší |
|---|---|---|---|
| Zákazník platbu zrušil | Platbu jste zrušili | Zkusit znovu → brána | Nechci → konec |
| Banku platbu zamítla | Platba se nepodařila | Zkusit znovu → brána | Nechci → konec |
| Nabídka mezitím vypršela | Nabídka už skončila | Pokračovat → konec | — |

Všechny tři texty začínají ujištěním, že **původní objednávka je zaplacená
a v pořádku**. Stránka nahoře hlásí „Objednávka je zaplacená" — když pak
selže platba, zákazník si snadno domyslí, že se rozbila celá objednávka.
To je nejdražší nedorozumění, jaké tu může vzniknout, proto je ta věta první.

**Košík se po neúspěchu nevysype.** Nepovedený pokus není rozhodnutí, takže
přibalené věci i jejich počty zůstanou a „Zkusit znovu" platí přesně to, co
je v košíku. Vysype se až po „Nechci", které nabídku zavře natrvalo.

**Odpočet 15 minut je lhůta na zahájení platby.** Kdo klikl včas, může platbu
dokončit i po vypršení. Nový pokus už ale nezačne — po návratu z neúspěšné
platby se místo „Zkusit znovu" ukáže „Nabídka už skončila". Odpočet se
nikde nepauzuje.

### Pravidla pro vývoj

1. Doplatek je **vždy samostatná platba**. Původní zaplacená objednávka se
   nikdy neruší, nemění, nevrací ani nestrhává znovu jako jedna částka.
2. Přibalené věci se k objednávce přidají **až po potvrzení platby
   serverovým callbackem**.
3. Dokud callback nedorazí, platí pro sklad: **doplňky nejsou zaplacené
   a nebalí se**.
4. Existuje **okamžik uzamčení objednávky k expedici**:
   - callback dorazí před ním → přibalené věci jdou do zásilky,
   - callback dorazí po něm → doplatek se vrátí a samostatný balík se neposílá.
5. **Počet pokusů o zaplacení na naší straně neomezujeme**, dokud nabídka
   běží. Limity platební brány platí dál.
6. **Doplacení odkazem v e-mailu se v této fázi nedělá.**

### Jak si stavy vyzkoušet

Odkazem — hodí se na sdílení a screenshoty:

```
dekovacka_obj_kartou.html?stav=zruseno
dekovacka_obj_kartou.html?stav=zamitnuto
dekovacka_obj_kartou.html?stav=vyprselo
```

Nebo proklikáním: přidej produkt, dej **Přibalit a zaplatit** a ve snímku
brány jsou dole tlačítka **Zaplaceno / Zrušeno / Zamítnuto**. Ta jsou jen
v prototypu, na ostré stránce nic takového není.

---

## Zelená varianta (A/B test)

Růžová je kontrolní varianta **A**, zelená je varianta **B**. Liší se jen
barvami, maskotem a zněním v pruhu „Mňau tip" — tlačítka i chování jsou
stejné.

Přepíná se **parametrem v adrese**:

```
dekovacka_obj_prevodem.html?theme=zelena
```

Bez parametru je růžová. Přepínač v `<head>` si podle názvu najde
`theme-zelena.css` a `theme-zelena.js` a přilinkuje je navíc.

Kde se co mění:

| Co | Kde |
|---|---|
| Barvy | blok proměnných `--z-*` nahoře v `theme-zelena.css` |
| Obrázky a texty | blok `ZADÁNÍ` nahoře v `theme-zelena.js` |

Obrázky a texty musí být v JS, protože je CSS změnit neumí.

**Další barva** = kopie obou souborů pod jménem `theme-<nazev>.*`
a `?theme=<nazev>`. V HTML se nemění nic.

Na Shoptetu je tenhle pár souborů celý výstup — A/B nástroj vpustí
variantě B právě jen to CSS a kousek JS navíc.

---

## Soubory

| Soubor | K čemu |
|---|---|
| `dekovacka_obj_*.html` | tři stránky, každá s vlastní kopií skriptu |
| `styles.css` | veškerý layout a komponenty (historicky rozrostlé) |
| `theme-violet.css` | barevné tokeny, výchozí paleta |
| `theme-zelena.css` + `.js` | zelená varianta pro A/B test |
| `prevodem.css` | platební karta s QR a údaji |
| `obj-prijata.css` | modré potvrzení u nezaplacené objednávky |
| `uznic.css` | tlačítka Nechci a děkovací karta |
| `no-badge.css`, `badge-*.css`, `kosik-barva.css` | starší pokusy s pozicí a barvou slevového štítku |
| `assets/` | fotky produktů, maskoti, snímek platební brány |
| `scrap/` | dřívější verze stránky, nepoužívá se |
| `AGENTS.md` | technický kontext pro AI agenta pracujícího v repu |

---

## Co je v prototypu jen naoko

- **QR kód** jsou náhodné čtverečky, ne skutečná platební data. Uložený
  obrázek tedy nic nezaplatí.
- **Snímek platební brány** má natvrdo 3 499 Kč, doplatek je jiný.
- **Produkty a ceny** jsou ukázková data.
- **Odkaz „Zpět do obchodu"** nikam nevede, cílovou URL doplní vývoj.
- **Úprava e-mailu** změní jen text na stránce, nikam se neodesílá.

---

## Vývoj

Otevři soubor v prohlížeči, nebo si pusť jednoduchý server, ať fungují
relativní cesty k obrázkům. Když se změna neprojeví, bývá to cache:
<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>.

Skript je v každém HTML zkopírovaný zvlášť, takže **změnu chování je nutné
udělat ve všech třech souborech.** Ostatní pasti jsou v `AGENTS.md`.
