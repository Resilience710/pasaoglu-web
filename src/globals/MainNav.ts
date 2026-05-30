import type { GlobalConfig } from 'payload'

export const MainNav: GlobalConfig = {
  slug: 'mainNav',
  label: 'Üst Menü (Header Navigasyon)',
  admin: {
    group: '🎨 Özelleştirme',
    description: 'Sitenin üst kısmındaki menü öğeleri ve alt menüleri.',
    components: {
      views: {
        edit: {
          root: { Component: '@/components/admin/MainNavEditor#default' },
        },
      },
    },
  },
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
