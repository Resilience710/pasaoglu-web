import type { CollectionConfig } from 'payload'

export const JobOpenings: CollectionConfig = {
  slug: 'jobOpenings',
  labels: { singular: 'İş İlanı', plural: 'İş İlanları' },
  admin: {
    useAsTitle: 'title',
    group: '🎨 Özelleştirme',
    description: 'Kariyer sayfasında listelenecek aktif iş ilanları.',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'department', type: 'text', required: true },
    { name: 'location', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
