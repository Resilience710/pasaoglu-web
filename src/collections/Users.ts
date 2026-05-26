import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'Sistem' },
  auth: true,
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Yönetici', value: 'admin' },
        { label: 'Editör', value: 'editor' },
      ],
    },
  ],
}
