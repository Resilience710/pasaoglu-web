import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Sectors } from './collections/Sectors'
import { ProductCategories } from './collections/ProductCategories'
import { Documents } from './collections/Documents'
import { JobOpenings } from './collections/JobOpenings'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { CareerApplications } from './collections/CareerApplications'
import { SiteSettings } from './globals/SiteSettings'
import { MainNav } from './globals/MainNav'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Paşaoğlu Group Admin',
    },
    components: {
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
  ],
  globals: [SiteSettings, MainNav],
  editor: lexicalEditor(),
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./pasaoglu.db',
    },
  }),
  upload: {
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  },
})
