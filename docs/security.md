# Biztonsági összefoglaló

A rendszer fejlesztése során kiemelt figyelmet fordítottunk az alkalmazás biztonságára. Az alábbiakban bemutatásra kerülnek a legfontosabb alkalmazott védelmi mechanizmusok.

## XSS (Cross-Site Scripting) elleni védelem

A kliensoldali megjelenítés során minden felhasználói input megfelelően szűrésre és escape-elésre kerül. React használata esetén az alapértelmezett escaping mechanizmus védi az alkalmazást az XSS támadások jelentős részétől.
Például a dangerouslySetInnerHTML használata teljesen el lett kerülve, egyértelmű okokból kifojólag.

## Input validáció

Az alkalmazás minden bemeneti adatot validál:

- Kliens oldalon (form validáció)
- Szerver oldalon (kötelező mezők, adattípusok, hosszkorlátok)

Ez biztosítja, hogy csak megfelelő formátumú és biztonságos adatok kerüljenek feldolgozásra.

## AAA (Authentication, Authorization, Accounting)

- **Authentication (Hitelesítés):**  
  A felhasználók bejelentkezése biztonságos módon történik (session alapú autentikáció).

- **Authorization (Jogosultságkezelés):**  
  Az egyes funkciókhoz való hozzáférés szerepkörök alapján van szabályozva (pl. admin, felhasználó).

- **Accounting (Naplózás):**  
  A rendszer naplózza a fontosabb eseményeket (pl. bejelentkezés, műveletek végrehajtása).

## Credential kezelés

A jelszavak nem kerülnek tárolásra plain text formában. Hash-elés történik bcrypt használatával
Érzékeny adatok (pl. API kulcsok) környezeti változókban kerülnek tárolásra (`.env`), és nem részei a forráskódnak.

## Jogosultságkezelés

A backend oldalon minden védett végpont ellenőrzi a felhasználó jogosultságait.  
Nem történik kizárólag kliensoldali jogosultság ellenőrzés.

## Naplózás (Logging)

A rendszer naplózza a hibákat, errorokat, egyéb eseményeket.

A naplózás segíti a hibakeresést és az esetleges visszaélések azonosítását.

## Hibakezelés

A rendszer nem ad vissza érzékeny információkat a kliens számára (pl. stack trace).  
A hibák kezelése központosított módon történik, egységes válaszformátummal.
