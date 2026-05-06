# Architektúra rövid összefoglaló

## Általános áttekintés

A StudyHub egy webalapú tanulási platform, amely lehetővé teszi a felhasználók számára jegyzetek megosztását, kurzusok böngészését és közösségi interakciókat egyetemi környezetben. Az alkalmazás két fő komponensből áll: egy React-alapú frontendből és egy Node.js/Express backend API-ból, amelyek MySQL adatbázissal kommunikálnak.

## Architektúra diagram

```
[React Frontend (SPA)] <--- HTTP/HTTPS ---> [Express API Backend] <--- MySQL Connector ---> [MySQL Database]
       |                                              |
       | (axios)                                     | (mysql2)
       |                                              |
       +---- File Upload (multer)                     +---- Authentication (bcrypt, Google OAuth)
              |                                              |
              +---- Routing (react-router-dom)               +---- Logging (winston)
                                                             |
                                                             +---- Scheduling (node-schedule)
```

## Komponensek részletei

### Frontend (app)

- **Technológia**: React 19, TypeScript, Vite
- **Főbb könyvtárak**:
  - `react-router-dom`: Kliensoldali routing
  - `axios`: HTTP kérések kezelése
  - `react-hook-form` + `yup`: Form kezelés és validáció
  - `@react-oauth/google`: Google OAuth integráció
  - `react-toastify`: Értesítések
- **Struktúra**:
  - `components/`: Újrafelhasználható UI komponensek (pl. CommentForm, Sidebar)
  - `pages`: Oldalak (pl. kurzusok, jegyzetek)
  - `services`: API hívások
  - `types`: TypeScript típusdefiníciók

### Backend (api)

- **Technológia**: Node.js, Express 5, TypeScript
- **Főbb könyvtárak**:
  - `express`: Web keretrendszer
  - `mysql2`: MySQL adatbázis kapcsolat
  - `bcrypt`: Jelszó hashelés
  - `multer`: Fájlfeltöltés
  - `winston`: Naplózás
  - `google-auth-library`: Google autentikáció
  - `cors`: Cross-Origin Resource Sharing
  - `cookie-parser`: Cookie kezelés
- **Architektúra minta**: MVC-szerű (Routes -> Controllers -> Services -> Database Queries)
- **Struktúra**:
  - `routes`: API végpontok definíciói
  - `controllers`: Üzleti logika vezérlése
  - `services`: Szolgáltatások (pl. autentikáció, jegyzetkezelés)
  - `database`: Adatbázis lekérdezések
  - `middlewares`: Köztes szoftverek (auth, logger, error handler)
  - `validators`: Input validáció
  - `types`: TypeScript típusok
  - `utils`: Segéd függvények

### Adatbázis

- **Technológia**: MySQL (MariaDB 10.4)
- **Főbb táblák**:
  - `universities`: Egyetemek
  - `faculties`: Karok (university_id)
  - `courses`: Kurzusok (faculty_id)
  - `notes`: Jegyzetek (course_id, uploader_user_id)
  - `users`: Felhasználók (auth adatok, Google ID)
  - `note_comments`: Kommentek jegyzeteken
  - `note_likes`: Like-ok jegyzeteken
  - `sessions`: Munkamenetek

## Minőségi attribútumok

- **Biztonság**: bcrypt hashelés, Google OAuth, session management, input validáció
- **Teljesítmény**: Aszinkron adatbázis műveletek, fájlfeltöltés optimalizálás
- **Skálázhatóság**: RESTful API design, moduláris kódstruktúra
- **Karbantarthatóság**: TypeScript használata, ESLint, Prettier, tiszta architektúra
- **Felhasználói élmény**: Reszponzív design, loading állapotok, skeleton loader, toast értesítések

## ADR (Architecture Decision Records)

1. **Frontend keretrendszer**: React választása a komponens-alapú fejlesztés és nagy közösség miatt.
2. **Backend keretrendszer**: Express.js a Node.js ökoszisztéma illeszkedése és egyszerűsége miatt.
3. **Adatbázis**: MySQL a relációs adatok kezelése és széles körű támogatottság miatt.
4. **Autentikáció**: Hagyományos jelszó + Google OAuth kombináció a rugalmasságért.
5. **Fájltárolás**: Lokális fájlrendszer (multer) egyszerűség miatt.
6. **Naplózás**: Winston strukturált naplózás és konfigurálhatóság miatt.

## Modulhatárok

- **Frontend modul**: UI logika, API kommunikáció
- **Backend API modul**: Üzleti logika, adatvalidáció, autentikáció
- **Adatbázis modul**: Adatelérés, lekérdezések
- **Fájlkezelés modul**: Feltöltés, tárolás, lekérés

---

**Utolsó frissítés:** 2026-05-06
