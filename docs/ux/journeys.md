# Top 3 User Journey

---

## 1. Bejelentkezés és jegyzet megnyitása

**Persona:** Egy egyetemista hallgató, aki gyorsan meg akar nyitni egy korábban feltöltött jegyzetet.

**Belépési pont:** App megnyitása (böngésző / app icon)

### Lépések:

1. S01 — Login  
   A user beírja az email címét és jelszavát, majd rákattint a "Bejelentkezés" gombra.  
   → S03 (Home) betöltődik.  
   Hibaág: hibás email vagy jelszó → hibaüzenet jelenik meg.

2. S03 — Home  
   A user görgeti a feedet, majd kiválaszt egy jegyzetet.  
   → S06 (Note Details) megnyílik.  
   Hibaág: ha nincs tartalom → empty state jelenik meg.

3. S06 — Note Details  
   A user megtekinti a jegyzet tartalmát vagy letölti azt.  
   Hibaág: betöltési hiba → error state jelenik meg.

**Sikerkritérium:** A user sikeresen megnyit egy jegyzetet és látja annak tartalmát.

**Mért időtartam:** ~10–20 másodperc / 2–3 kattintás

---

## 2. Kurzus böngészése és jegyzet kiválasztása

**Persona:** Egy hallgató, aki egy adott tantárgyhoz keres tananyagot.

**Belépési pont:** Home oldal (már bejelentkezett user)

### Lépések:

1. S03 — Home  
   A user rákattint a "Courses" menüpontra.  
   → S04 (Courses) megnyílik.

2. S04 — Courses  
   A user kiválaszt egy kurzust a listából.  
   → S05 (Course Details) megnyílik.  
   Hibaág: ha nincs kurzus → empty state.

3. S05 — Course Details  
   A user kiválaszt egy jegyzetet.  
   → S06 (Note Details) megnyílik.  
   Hibaág: ha nincs jegyzet → empty state.

4. S06 — Note Details  
   A user elolvassa vagy letölti a jegyzetet.

**Sikerkritérium:** A user megtalálja és megnyitja a kívánt kurzushoz tartozó jegyzetet.

**Mért időtartam:** ~15–30 másodperc / 3–4 kattintás

---

## 3. Profil / beállítások módosítása

**Persona:** Egy felhasználó, aki frissíteni szeretné a profiladatait vagy beállításait.

**Belépési pont:** Home oldal

### Lépések:

1. S03 — Home  
   A user rákattint a "Settings" menüpontra.  
   → S07 (Settings) megnyílik.

2. S07 — Settings  
   A user módosítja az adatait (pl. jelszó), majd rákattint a "Mentés" gombra.  
   → Mentés után a rendszer visszajelzést ad (success state).
   Hibaág: invalid input → validációs hibaüzenet jelenik meg.

3. S07 — Settings  
   A user látja a frissített adatokat.

**Sikerkritérium:** A módosított adatok sikeresen mentésre kerülnek és megjelennek.

**Mért időtartam:** ~10–25 másodperc / 2–3 kattintás
