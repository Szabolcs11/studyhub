# Design rendszer / vizuális nyelv — StudyHub

## UI könyvtár / komponens rendszer

- **Frontend:** React
- **Styling:** natív CSS (CSS variables használatával)
- **Komponensek:** saját fejlesztésű komponensek (Button, Input, Card, Layout)

A design rendszer CSS változókra épül, ami biztosítja a konzisztens megjelenést és könnyű karbantarthatóságot.

---

## Színpaletta

A rendszer egy modern, kék alapú palettát használ, kiegészítve státusz színekkel.

- **Primary:** #3b82f6
- **Secondary:** #64748b
- **Success:** #10b981
- **Warning:** #f59e0b
- **Error:** #ef4444

- **Background:** #f8fafc
- **Surface:** #ffffff

- **Text Primary:** #1e293b
- **Text Secondary:** #64748b

- **Border:** #e2e8f0

### Kiemelt vizuális elemek

- Gradientek (pl. gombok, hero elemek)
- Overlay-ek (modal háttér, hover state-ek)
- Focus állapotok (kiemelés accessibility miatt)

---

## Tipográfia

- **Font család:** system font stack  
  (-apple-system, Segoe UI, Roboto, stb.)

- **Méret skála:**
  - 12px (xs)
  - 14px (sm)
  - 16px (base)
  - 18px (lg)
  - 20px (xl)
  - 24px (2xl)
  - 30px (3xl)

A tipográfia célja a jó olvashatóság és világos információs hierarchia.

---

## Spacing / grid rendszer

- **Alap egység:** 4px (0.25rem)
- **Skála:** 4px – 80px között (lépcsőzetesen növelve)
- **Layout:** rugalmas (flexbox alapú)

### Border radius

- Small: 6px
- Medium: 8px
- Large: 12px
- Extra: 16px
- Full: kör alak

---

## Ikonkészlet

- **Natív SVG ikonok**
- Közvetlenül a projektben kezelve
- Skálázható és teljesen testreszabható

---

## Sötét mód

- **Nem támogatott**

A rendszer viszont később bővíthető dark mode-ra a CSS változók miatt.

---

## Reszponzív breakpoint-ok

- **Mobile:** < 768px
- **Tablet:** 768px – 1024px
- **Desktop:** > 1024px

A layout mobile-first megközelítéssel készült.

---

## Forrás / design alapok

- A design fejlesztés közben, iteratívan lett kialakítva
- CSS változók biztosítják az egységes megjelenést
- Nincs külön Figma terv

---

## Megjegyzés

A design fő célja az egyszerű, gyors és átlátható használat biztosítása, különösen a tanulási tartalmak hatékony elérésére optimalizálva.
