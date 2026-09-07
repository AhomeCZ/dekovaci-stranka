/* =============================================================
   BAREVNÁ VARIANTA "ZELENÁ" — texty a obrázky
   -------------------------------------------------------------
   Barvy jsou v theme-zelena.css, tady je jen to, co CSS změnit
   neumí: jiné obrázky maskota a jiné znění textů v kartě
   "Mňau tip". Na úpravu stačí přepsat hodnoty v bloku ZADÁNÍ.
   ============================================================= */
(function(){

  /* ---------- ZADÁNÍ ---------- */
  const OBRAZKY = {
    tip:'assets/img-3.png',              /* kočka v kartě "Mňau tip" */
    bar:'assets/img-5.png',              /* kočka ve spodní souhrnné liště */
    dekovaci:'assets/krabicka-green.png' /* kočka v krabici v děkovací kartě */
  };
  const TEXTY = {
    nadpis:'Mňau tip: Přibalit?',           /* kurzívou a tučně */
    vedle:'Vejde se tam ještě něco!',       /* řádek pod nadpisem */
    pod:'',                                 /* druhý řádek pod tím; prázdné = žádný */
    /* děkovací karta po odmítnutí / uzavření objednávky */
    dekujemeNadpis:'Díky! Už balíme 🐾',
    dekujemeText:'Jakmile objednávka vyrazí, dáme vědět.'
  };
  /* ---------- /ZADÁNÍ ---------- */

  /* Maskoti: onerror se musí vynulovat, jinak by je zpětně přepsal
     hledač obrázků ze stránky (zkouší několik cest a spadne na
     fallback z HTML — viz AGENTS.md). */
  function nastavObrazek(img, src){
    if (!img) return;
    img.onerror = null;
    img.src = src;
  }
  nastavObrazek(document.querySelector('.tip .mascot--tip'), OBRAZKY.tip);
  nastavObrazek(document.querySelector('.mascot--bar'), OBRAZKY.bar);
  nastavObrazek(document.querySelector('.decline-done .mascot--tip'), OBRAZKY.dekovaci);

  /* Karta "Mňau tip": nadpis a první text na jednom řádku,
     druhý text pod tím. Tlapka z původního nadpisu zůstává. */
  const copy = document.querySelector('.tip-copy');
  if (copy){
    const nadpis = copy.querySelector('strong');
    const tlapka = nadpis ? nadpis.querySelector('svg') : null;
    const podtext = copy.querySelector('span');

    if (nadpis){
      nadpis.textContent = TEXTY.nadpis + ' ';
      if (tlapka) nadpis.appendChild(tlapka);
    }
    if (podtext){
      podtext.className = 'tip-lead';
      podtext.textContent = TEXTY.vedle;
      if (TEXTY.pod){
        const dalsi = document.createElement('span');
        dalsi.className = 'tip-sub';
        dalsi.textContent = TEXTY.pod;
        podtext.insertAdjacentElement('afterend', dalsi);
      }
    }
  }

  /* Děkovací karta po odmítnutí nabídky / uzavření objednávky. */
  const nadpisDik = document.getElementById('declineHeadline');
  const textDik = document.querySelector('.decline-done-copy span');
  if (nadpisDik) nadpisDik.textContent = TEXTY.dekujemeNadpis;
  if (textDik) textDik.textContent = TEXTY.dekujemeText;

  /* Hotovo — odkrýt text a maskota (do teď schované v theme-zelena.css,
     aby neproblikly původní růžové texty). */
  document.documentElement.classList.add('z-theme-ready');

  /* Stránka si nadpis přepisuje sama při kliknutí na "Nechci" i
     "Uzavřít objednávku" — původní znění se sem musí propsat taky,
     jinak by se po kliknutí vrátil růžový text. */
  if (typeof window.showThanks === 'function'){
    const puvodni = window.showThanks;
    window.showThanks = function(headline){
      puvodni(headline);
      if (nadpisDik && (!headline || headline.indexOf('V pořádku') === 0)){
        nadpisDik.textContent = TEXTY.dekujemeNadpis;
      }
    };
  }
})();
