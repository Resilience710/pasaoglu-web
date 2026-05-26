import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'İçerik' },
  access: { read: () => true },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumb', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Alternatif metin (SEO)' },
    { name: 'caption', type: 'text', label: 'Açıklama' },
  ],
}
