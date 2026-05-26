# Paşaoğlu Group — Web

Next.js 15 (App Router) + Payload CMS 3 — tek depo. Holding kurumsal sitesi + içerik yönetim paneli.

## Hızlı Başlangıç

```bash
cd pasaoglu-web
cp .env.example .env       # .env zaten var, secret'ı prod'da değiştirin
npm install                # ~2-3 dk
npm run seed               # admin user, sektörler, sayfalar, medya
npm run dev                # http://localhost:3000
```

- **Site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin
- **Admin giriş:** `admin@pasaoglugroup.com.tr` / `Pasaoglu2026!` (seed'den)

## Yapı

```
pasaoglu-web/
├── src/
│   ├── app/
│   │   ├── (payload)/        # Admin panel (Payload v3 gömülü)
│   │   └── (site)/           # Frontend route'lar
│   │       ├── layout.tsx
│   │       ├── page.tsx                          # / (slug=home)
│   │       ├── [slug]/page.tsx                   # /hakkimizda, /kariyer vb.
│   │       ├── sektorler/page.tsx                # /sektorler
│   │       ├── sektorler/[slug]/page.tsx         # /sektorler/kimya|yapi|gida
│   │       ├── politikalarimiz/[[...slug]]       # /politikalarimiz/...
│   │       └── api/forms/{contact,career}/route.ts
│   ├── blocks/               # Payload block tanımları (HeroVideo, vs.)
│   ├── collections/          # Payload koleksiyonları
│   ├── globals/              # Site ayarları, ana menü
│   ├── components/
│   │   ├── Header.tsx, Footer.tsx
│   │   ├── BlockRenderer.tsx
│   │   └── blocks/*.tsx      # Her blok için frontend bileşeni
│   └── payload.config.ts
├── scripts/seed.ts           # İçerik tohumlama
└── public/media              # Yüklenen dosyalar (gitignore'lu)
```

## Admin Panel — Müşteri Kullanım Rehberi

1. **/admin** adresine giriş yapın.
2. Sol menüden:
   - **İçerik → Sayfalar:** Ana sayfa (slug=home), Hakkımızda, Kariyer, İletişim, Politikalar. Her sayfada **sürükle-bırak bloklar** ile içerik yönetimi.
   - **İçerik → Sektörler:** Kimya, Yapı, Gıda — her birine kendi tema rengi, hero video, içerik blokları.
   - **İçerik → Ürün Kategorileri:** Kimya sayfasındaki accordion'da görünen ürün grupları.
   - **İçerik → Belgeler:** ISO sertifikaları, politika PDF'leri.
   - **İçerik → Kariyer İlanları:** Aktif iş ilanları.
   - **Ayarlar → Site Ayarları:** Logo, footer, telefon, e-posta, sosyal medya.
   - **Ayarlar → Ana Menü:** Üst menü öğeleri.
   - **Form Gönderileri:** İletişim ve kariyer formundan gelen mesajlar/başvurular.
3. **Bloklar** sayfaya eklenebilen modüllerdir: Hero Video, Bölünmüş Metin+Görsel, İstatistik Grid, Kart Grid, Akordeon, Ürün Kategorileri (Akordeon), Belge Grid, Ortak Logoları, Alıntı Bandı, İletişim Bloğu, Politika Nav, İletişim Formu, Kariyer Formu, Zengin Metin.
4. **Medya:** Dosyalar tek bir medya kütüphanesine yüklenir, sonra istenen yerde referanslanır.
5. Değişiklikler **60 saniye** içinde sitede görünür (ISR cache).

## Sektör Temalandırma

Sektör sayfası HTML kök elementine `data-theme="chem|build|food"` atanır. CSS değişkenleri (`--accent`, `--accent-light`) renkleri yöneten butonlar/aksanlar otomatik renk alır. Tek bileşen kodu, üç farklı görünüm.

## Production Deploy

### Önerilen: Vercel + Postgres

1. Postgres veritabanı edin (Neon, Railway, Supabase).
2. `package.json`'da SQLite adapter'ı Postgres ile değiştirin:
   ```bash
   npm uninstall @payloadcms/db-sqlite
   npm install @payloadcms/db-postgres
   ```
3. `src/payload.config.ts`'de adapter'ı değiştirin:
   ```ts
   import { postgresAdapter } from '@payloadcms/db-postgres'
   db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })
   ```
4. Vercel'de proje oluşturun, `.env` değerlerini set edin (`PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SERVER_URL`).
5. Medya için S3 adapter ekleyin (`@payloadcms/storage-s3`) — Vercel filesystem yazılamaz.

### Alternatif: VPS (Plesk uyumlu)

1. Node 20+ kurun.
2. Postgres veya SQLite kullanın.
3. `npm run build && npm start` ile production'da çalıştırın.
4. nginx reverse proxy → port 3000.

## Migrasyon

Eski statik HTML site içeriği `../Eski_Site/httpdocs/` altında. Seed scripti `assets/img` ve `assets/video` klasörlerini otomatik yükler. Sayfa metinleri seed'de elle girilmiştir; ek içerik admin panelden eklenir.

## Notlar

- Geliştirme ortamı SQLite kullanır (sıfır kurulum). Prod'da Postgres tercih edilir.
- `PAYLOAD_SECRET` prod'da uzun rastgele bir değer olmalı.
- E-posta bildirimi şu an aktif değil; ileride Resend/SMTP entegrasyonu form route'larına eklenebilir.
