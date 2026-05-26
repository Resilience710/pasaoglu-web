import type { GlobalConfig } from 'payload'

export const MainNav: GlobalConfig = {
  slug: 'mainNav',
  label: 'Ana Menü',
  admin: { group: 'Ayarlar' },
  access: { read: () => true },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menü öğeleri',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          label: 'Alt menü',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
