#### 1. Setup & Jalankan Backend (API Port 3000)

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   pnpm install
   ```
3. Jalankan server backend dalam mode *development* (hot reload):
   ```bash
   pnpm dev
   ```
4. *(Opsional)* Untuk melakukan build:
   ```bash
   pnpm build
   pnpm start
   ```

---

#### 2. Setup & Jalankan Frontend (Vite Port 5173)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi:
   ```bash
   pnpm install
   ```
3. Jalankan server frontend dalam mode *development*:
   ```bash
   pnpm dev
   ```
4. *(Opsional)* Untuk melakukan pengujian type checking dan build produksi frontend:
   ```bash
   pnpm build
   ```
   Hasil build akan tersimpan di folder `frontend/dist/`. Untuk melihat preview hasil build:
   ```bash
   pnpm preview
   ```