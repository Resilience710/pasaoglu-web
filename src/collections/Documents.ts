import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: { useAsTitle: 'title', group: 'İçerik' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text', label: 'Kategori (ör. Sertifika, Politika)' },
    { name: 'description', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Kapak görseli' },
    { name: 'file', type: 'upload', relationTo: 'media', label: 'PDF dosyası', required: true },
  ],
}
