import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'İçerik', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL yolu (ör. "hakkimizda" → /hakkimizda). Ana sayfa için "home" yazın.' },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: allBlocks,
      label: 'Sayfa içeriği (sürükle-bırak bloklar)',
    },
  ],
}
