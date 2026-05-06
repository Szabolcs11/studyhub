# Jegyzetmegosztó Rendszer – Futtatási útmutató

## 1. Követelmények

A projekt futtatásához megfelelő fejlesztői környezet szükséges.

### Szükséges szoftverek:

- Node.js (minimum v18, ajánlott LTS verzió, pl. 24.x)
- npm (Node.js része)
- MySQL szerver
- XAMPP (Apache + MySQL futtatásához)
- phpMyAdmin (adatbázis kezeléshez)

---

## 2. Backend beállítása

### 2.1 Adatbázis előkészítése

1. Indítsuk el a XAMPP Control Panelt
2. Indítsuk el:
   - Apache
   - MySQL
3. Nyissuk meg a phpMyAdmin felületet:  
   http://localhost/phpmyadmin
4. Hozzunk létre egy új adatbázist: `studyhub` néven
5. Importáljuk a projekt `.sql` fájlt az adatbázisba

---

### 2.2 Backend konfigurálása

1. Navigáljunk az `api` mappába
2. Hozzunk létre egy `.env` fájlt az alábbi tartalommal:

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASS=
MYSQL_DB=studyhub
MYSQL_PORT=3306

APP_URL=http://localhost:5173
PORT=2004

Ezután csak telepítenünk kell az npm csomagokat.
`npm install`

### 2.4 Backend indítása

Fejlesztői módban:
`npm run dev`

Build készítése:
`npm run build`

Megjegyzés:  
Fejlesztés során a `dev` script használata ajánlott, mivel automatikus újratöltést (hot reload) biztosít.

---

## 3. Frontend beállítása

### 3.1 Telepítés

Navigáljunk az `app` mappába:
`npm install`

Alternatíva:
`npm ci`

Ez a `package-lock.json` alapján telepít, így fix csomagverzók kerülnek telepítésre

---

### 3.2 Környezeti változók

Hozzunk létre egy `.env` fájlt az alábbi tartalommal:

VITE_API_URL=http://localhost:2004/api/
VITE_APP_URL=http://localhost:5173/

---

Ezután csak telepítenünk kell az npm csomagokat.
`npm install`

### 3.3 Frontend indítása

Fejlesztői módban:
`npm run dev`

Build készítése:
`npm run build`

Megjegyzés:  
A frontend is támogatja a hot reload funkciót, így a módosítások azonnal megjelennek.

---

## 4. Rendszer elérése

Sikeres indítás után:

Frontend:  
http://localhost:5173/

Backend:  
http://localhost:2004/

---

Az alkalmazásunk elérhető az http://localhost:5173/ url -en.
