# 🚀 Panduan Deploy ke Netlify

## Persiapan Supabase

### 1. Jalankan SQL Migration
Buka Supabase Dashboard → SQL Editor, lalu jalankan file `scripts/001_create_voting_tables.sql`.

### 2. Aktifkan Supabase Realtime
Di Supabase Dashboard → Database → Replication, pastikan tabel `staff_members` dan `votes` sudah diaktifkan untuk realtime (sudah diatur di SQL script).

### 3. Buat Storage Bucket untuk Foto
Di Supabase Dashboard → Storage:
1. Klik "New bucket"
2. Nama: `staff-photos`
3. Centang "Public bucket" ✅
4. Klik Save

Lalu tambahkan policy storage ini di SQL Editor:
```sql
-- Public read
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'staff-photos');

-- Allow upload
CREATE POLICY "Allow upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'staff-photos');

-- Allow update
CREATE POLICY "Allow update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'staff-photos');

-- Allow delete  
CREATE POLICY "Allow delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'staff-photos');
```

---

## Deploy ke Netlify

### Cara 1: Via GitHub (Direkomendasikan)
1. Push project ke GitHub repository
2. Buka [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Pilih repository Anda
4. Build settings sudah otomatis terbaca dari `netlify.toml`
5. Set **Environment Variables** (lihat bagian di bawah)
6. Klik **Deploy**

### Cara 2: Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --build --prod
```

---

## Environment Variables (WAJIB)

Di Netlify Dashboard → Site Settings → Environment Variables, tambahkan:

| Variable | Nilai |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase kamu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key dari Supabase |
| `ADMIN_CODE` | Kode rahasia untuk admin (ganti dari default!) |

Cara cari Supabase credentials: Supabase Dashboard → Settings → API

---

## Fitur-fitur yang Tersedia

### 🗳️ Halaman Voting (`/vote`)
- Login dengan kode akses (VALID_CODES di `app/page.tsx`)
- Vote satu kandidat dari seluruh divisi
- Anti double-vote berdasarkan IP + User Agent

### 📊 Dashboard (`/dashboard`)
- **Realtime** — hasil update otomatis tanpa refresh (Supabase Realtime)
- Indikator Live/Offline koneksi realtime
- Top 3 keseluruhan & terbaik per divisi
- Bar progress persentase vote

### ⚙️ Panel Admin (di Dashboard)
- **Verifikasi** dengan kode admin (default: `RESETPIM2024`)
- **Reset Voting** — hapus semua data vote
- **Tambah Anggota** — nama + divisi
- **Hapus Anggota** — hapus beserta votesnya
- **Ganti Foto** — upload foto ke Supabase Storage (ikon kamera di setiap baris)

---

## Ganti Kode Akses Voting

Edit `app/page.tsx`, cari `VALID_CODES`:
```typescript
const VALID_CODES = ["PIM2024", "MUDAMENGABDI", "RELAWANJOGJA", "STAFFOFMONTH"]
```
Ganti dengan kode yang Anda inginkan.

## Ganti Kode Admin
Set environment variable `ADMIN_CODE` di Netlify. Jangan gunakan default di production!
