# 🚀 Dompet Pintar — Deploy ke Vercel

Ikuti langkah-langkah di bawah untuk deploy. Totalnya sekitar 5 menit!

---

## Step 1 — Setup Supabase (kalau belum)

1. Buka [supabase.com](https://supabase.com) → login → buka project kamu
2. Pergi ke **SQL Editor**
3. Copy semua isi file `supabase_setup.sql` → paste → klik **Run**
4. Pastikan tabel `users` dan `transactions` muncul di **Table Editor**

---

## Step 2 — Upload ke GitHub

1. Buat repo baru di [github.com](https://github.com) (nama apa aja, contoh: `dompet-pintar`)
2. Upload semua file dari folder ini ke repo tersebut
3. Pastikan `.env.local` **ikut di-upload** (penting!)

---

## Step 3 — Deploy di Vercel

1. Buka [vercel.com](https://vercel.com) → login (bisa pakai akun GitHub)
2. Klik **New Project** → pilih repo `dompet-pintar` kamu
3. Di halaman deploy, pastikan:
   - **Framework Preset** = `Next.js`
   - **Root Directory** = `.` (default)
4. Klik **Deploy**
5. Tunggu beberapa detik... selesai! 🎉

---

## Step 4 — Buka & Test

1. Vercel bakal kasih URL seperti `https://dompet-pintar-xxxx.vercel.app`
2. Buka di browser → klik **✨ Daftar** → buat akun
3. Login dan mulai tambah transaksi!

---

## Catatan

- `.env.local` sudah berisi Supabase URL dan key, jadi **nggak perlu isi ulang** di Vercel.
- Kalau nanti mau ganti key atau URL, bisa edit di file `.env.local` dan re-deploy.
- Orang satunya bisa daftar akun sendiri, data transaksi masing-masing terpisah.
