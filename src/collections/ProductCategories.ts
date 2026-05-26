import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'productCategories',
  labels: { singular: 'Ürün Kategorisi', plural: 'Ürün Kategorileri' },
  admin: {
    useAsTitle: 'name',
    group: '🎨 Özelleştirme',
    defaultColumns: ['name', 'sortOrder', 'updatedAt'],
    description: 'Kimya sayfasındaki ürün accordion’unda görünen kategoriler ve ürünler.',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'icon', type: 'text', label: 'Lucide ikon adı (ör. Beaker)' },
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    {
      name: 'subGroups',
      type: 'array',
      label: 'Alt gruplar',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'products',
          type: 'array',
          fields: [{ name: 'name', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Eylem butonları',
      fields: [
        { name: 'quoteHref', type: 'text', label: 'Teklif Al linki', defaultValue: '/iletisim' },
        { name: 'msdsHref', type: 'text', label: 'MSDS talep linki', defaultValue: '/iletisim' },
      ],
    },
  ],
}
