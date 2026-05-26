import type { CollectionConfig } from 'payload'

export const JobOpenings: CollectionConfig = {
  slug: 'jobOpenings',
  admin: { useAsTitle: 'title', group: 'İçerik' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'department', type: 'text', required: true },
    { name: 'location', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
