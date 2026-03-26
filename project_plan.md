# Project Plan – Study Hub (Tanulási Tudásmegosztó Platform)

## Egy mondatos értékajánlat

Egy webes platform, ahol egyetemisták jegyzeteket, ZH kérdéseket és tananyagokat oszthatnak meg egymással, miközben egy intelligens rendszer segíti a releváns tartalmak megtalálását és minőségi szűrését (értékelések, riportok, verziókezelés) — nem triviális, mert közösségi tartalomkezelést, moderációt és személyre szabást kombinál.

---

## Képességek

| Képesség                                  | Kategória      | Komplexitás | Miért nem triviális?                                               |
| ----------------------------------------- | -------------- | ----------- | ------------------------------------------------------------------ |
| Bejelentkezés és szerepkörök (user/admin) | Productization | M           | JWT + refresh token + role-based route védelem                     |
| Jegyzetek feltöltése és verziókezelés     | Value          | L           | Verziók tárolása, diff logika, rollback lehetőség                  |
| Tartalom keresés és szűrés                | Value          | L           | Full-text search + több szempontos szűrés (tantárgy, nyelv, típus) |
| Értékelési és pontozási rendszer          | Value          | M           | Upvote/downvote + rangsorolás + visszaélés elleni védelem          |
| Hibajelentés és moderáció                 | Productization | M           | Report rendszer + admin review workflow                            |
| Fájlkezelés (PDF, képek)                  | Productization | M           | File upload, storage kezelés, méretlimit, validáció                |
| Session és biztonság kezelés              | Productization | M           | Cookie + CSRF védelem + rate limiting                              |
| Ajánló rendszer (alap szintű)             | Value          | L           | Felhasználói aktivitás alapú ajánlás (pl. hasonló jegyzetek)       |

**Kategória:** `Value` (felhasználó érzékeli) vagy `Productization` (minőséget garantál: auth, hibakezelés, tesztek, deploy)  
**Komplexitás:** `S` < 1 nap · `M` 2–5 nap · `L` 1+ hét

---

## A legnehezebb rész

A verziókezelés és tartalom konzisztencia kezelése.

Egy jegyzet több verzióval rendelkezhet, amelyeket külön kell tárolni, visszaállíthatónak kell lenniük, és közben biztosítani kell, hogy a felhasználók mindig a megfelelő verziót lássák. Emellett kezelni kell az egyidejű módosításokat és a tartalom integritását.

---

## Tech stack – indoklással

| Réteg            | Technológia                   | Miért ezt és nem mást?                                     |
| ---------------- | ----------------------------- | ---------------------------------------------------------- |
| UI               | React (Vite)                  | Gyors fejlesztés, komponens alapú, ismered                 |
| Backend / logika | Node.js + Express             | Egyszerű REST API, jól skálázható, JS fullstack            |
| Adattárolás      | MySQL (phpMyAdmin)            | Könnyen kezelhető, jól ismert, GUI támogatás phpMyAdminnal |
| Auth             | session cookie                | Biztonságos session kezelés, modern standard               |
| File storage     | Lokális fájlrendszer (VPS-en) | Egyszerű implementáció, nincs külső dependency             |
| Deployment       | Saját VPS                     | Teljes kontroll, testreszabható környezet, költséghatékony |

---

## Ami kimarad (non-goals)

- Valós idejű chat rendszer
- AI-alapú jegyzet generálás

---

## Ami még nem tiszta

- Milyen mélységű legyen az ajánló rendszer (egyszerű vs. ML alapú)
- Verziókezelés: teljes diff vagy snapshot alapú?
- Moderáció automatizált legyen-e vagy csak manuális?
