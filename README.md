# Bozorcha — Admin frontend

Do'kon boshqaruv paneli. React 19 + Vite + Tailwind CSS v4 + shadcn uslubidagi komponentlar. **Faqat UI tayyor** — integratsiya RTK Query bilan talabalar tomonidan qilinadi.

Bu — ikkita alohida frontend ilovadan biri (ikkinchisi: `frontend-user`). Ular mustaqil loyihalar, alohida `npm install` va alohida portda ishga tushadi.

## O'rnatish

```bash
npm install
cp .env.example .env
npm run dev
```
http://localhost:5174

`.env`:
```
VITE_API_BASE_URL=http://localhost:8989
```

## Sahifalar

- `/login` — Admin kirish sahifasi
- `/` — Dashboard (statistika)
- `/products`, `/products/new`, `/products/:id` — Mahsulotlar boshqaruvi
- `/categories` — Kategoriyalar boshqaruvi
- `/orders` — Buyurtmalar va ularning holatini boshqarish
- `/banners` — Bosh sahifa bannerlari
- `/users` — Foydalanuvchilar ro'yxati

Admin hisobi backendda `/auth/signup-admin` endpointi orqali (`.env` dagi `REG_KEY` bilan) yaratiladi — bu haqda `backend/README.md` da batafsil.

## Talabalar uchun vazifa

`src/store/api/*/*.js` fayllaridagi bo'sh `injectEndpoints`larni to'ldiring (har bir modulning `path.js` faylida barcha backend endpoint manzillari tayyor). So'ng `src/data/mockData.js` dagi statik ma'lumotlarni RTK Query hook'lari bilan almashtiring. Faqat admin roliga tegishli endpointlar (`AdminMiddleware` bilan himoyalangan) ishlatiladi. Batafsil: loyihaning bosh papkasidagi `README.md`.
