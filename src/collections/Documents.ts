import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Belge / Sertifika', plural: 'Belgeler & Sertifikalar' },
  admin: {
    useAsTitle: 'title',
    group: '🎨 Özelleştirme',
    description: 'ISO sertifikaları, kalite belgeleri, MSDS/TDS gibi dosyalar.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text', label: 'Kategori (ör. Sertifika, Politika)' },
    { name: 'description', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Kapak görseli' },
    { name: 'file', type: 'upload', relationTo: 'media', label: 'PDF dosyası', required: true },
  ],
}
