import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'productCategories',
  labels: { singular: 'Ürün Kategorisi', plural: 'Ürün Kategorileri' },
  admin: {
    useAsTitle: 'name',
    group: '🎨 Özelleştirme',
    defaultColumns: ['name', 'slug', 'designVariant', 'sortOrder', 'updatedAt'],
    description: 'Her kategori /urunler/[slug] adresinde kendi sayfasına sahiptir. Tasarım ve renk kategoriye özeldir.',
    components: {
      views: {
        edit: {
          root: { Component: '@/components/admin/ProductCategoryEditor#default' },
        },
      },
    },
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Kategori Adı' },
    {
      name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug',
      admin: { description: 'URL’deki ad (ör. gida-kimyasallari). /urunler/[slug] adresinde açılır.' },
    },
    { name: 'tagline', type: 'text', label: 'Üst Etiket / Slogan (sayfada hero altında)' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Kategori Görseli (hero arkaplanı)' },
    {
      name: 'accent', type: 'text', defaultValue: '#3B82F6', label: 'Aksan Rengi (HEX)',
      admin: { description: 'Kategoriye özel renk, ör. #16A34A. Sayfa vurguları bu renkten gelir.' },
    },
    {
      name: 'designVariant', type: 'select', defaultValue: 'accordion', label: 'Sayfa Tasarımı',
      options: [
        { label: 'Akordeon (aç-kapa alt gruplar)', value: 'accordion' },
        { label: 'Kart Grid (alt grup kartları + ürün chipleri)', value: 'grid' },
        { label: 'Sütunlar (3 sütun masonry liste)', value: 'columns' },
        { label: 'Tablo (tek liste, alfabetik)', value: 'table' },
      ],
    },
    { name: 'icon', type: 'text', label: 'Lucide ikon adı (ör. Beaker)' },
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
