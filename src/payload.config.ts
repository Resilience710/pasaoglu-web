import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { tr } from '@payloadcms/translations/languages/tr'
import { en } from '@payloadcms/translations/languages/en'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Sectors } from './collections/Sectors'
import { ProductCategories } from './collections/ProductCategories'
import { Documents } from './collections/Documents'
import { JobOpenings } from './collections/JobOpenings'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { CareerApplications } from './collections/CareerApplications'
import { NewsArticles } from './collections/NewsArticles'
import { SiteSettings } from './globals/SiteSettings'
import { MainNav } from './globals/MainNav'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    meta: {
      titleSuffix: ' — Paşaoğlu Group Admin',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/BrandLogo#default',
        Icon: '@/components/admin/BrandIcon#default',
      },
      Nav: '@/components/admin/AdminTopNav#default',
      beforeLogin: ['@/components/admin/LoginBeforeLogin#default'],
      views: {
        dashboard: {
          Component: '@/components/admin/AdminDashboard#default',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Sectors,
    ProductCategories,
    Documents,
    JobOpenings,
    ContactSubmissions,
    CareerApplications,
    NewsArticles,
  ],
  globals: [SiteSettings, MainNav],
  editor: lexicalEditor(),
  sharp,
  i18n: {
    fallbackLanguage: 'tr',
    supportedLanguages: { tr, en },
  },
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /**
   * Dual-driver database — DATABASE_URI prefix'ine göre adapter seçilir.
   *  - postgres:// veya postgresql:// → PostgreSQL (production / Plesk)
   *  - file:// veya boş               → SQLite (lokal geliştirme)
   */
  db: (() => {
    const uri = process.env.DATABASE_URI || 'file:./pasaoglu.db'
    if (uri.startsWith('postgres://') || uri.startsWith('postgresql://')) {
      return postgresAdapter({
        pool: { connectionString: uri },
        // İlk deploy + ongoing schema sync için push mode.
        // Migrationsız tek geliştirici deployment'ı için uygundur.
        push: true,
      })
    }
    return sqliteAdapter({
      client: { url: uri },
    })
  })(),
  upload: {
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  },
})
