This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Menjalankan bersama backend

Autentikasi user (sign in, sign up, reset password, update profil) memanggil backend
(`../khena-backend`) **langsung dari browser** — lihat `AGENTS.md` / issue ISSUE-17 untuk arsitektur
lengkapnya. Untuk mengujinya secara lokal:

1. Jalankan backend di `http://localhost:5000` (`bun install && bun run db:migrate && bun run dev`
   di repo `khena-backend`).
2. Jalankan frontend ini di `http://localhost:3000` (`bun dev`) — **port ini tidak boleh diganti
   sembarangan**, karena sudah didaftarkan di `trustedOrigins`/`APP_PUBLIC_URL` backend. Request
   dari origin lain akan ditolak CORS.
3. Isi `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` di `.env` (lihat `.env.example`).

Backend berjalan dengan `MAIL_DRIVER=console` di lokal, jadi email verifikasi/reset password
**tidak benar-benar terkirim** — link-nya dicetak ke log terminal backend (cari baris
`outgoing email (console driver)`). Salin link tersebut ke browser untuk melanjutkan alur lupa
password.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Catatan deployment — autentikasi (ISSUE-17)

- Backend wajib `COOKIE_SECURE=true` dan seluruh trafik lewat HTTPS.
- Kalau website dan API berada di domain terdaftar yang **berbeda**
  (mis. `khena.com` vs `khena-api.net`), cookie sesi `SameSite=Lax` **tidak akan terkirim** — backend
  harus pindah ke `SameSite=None; Secure`. Kalau hanya beda subdomain (`khena.com` vs
  `api.khena.com`), `Lax` tetap jalan.
- `APP_PUBLIC_URL` di backend wajib diisi origin produksi frontend ini, kalau tidak semua request
  auth ditolak CORS.
- `MAIL_DRIVER` backend harus diganti dari `console` sebelum produksi, kalau tidak email reset
  password tidak pernah benar-benar terkirim.
- `NEXT_PUBLIC_API_BASE_URL` di frontend memang terekspos ke browser — itu wajar, isinya cuma URL
  base API (request auth berangkat langsung dari browser ke backend, bukan lewat proxy Next.js).
