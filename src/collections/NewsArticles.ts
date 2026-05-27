import type { CollectionConfig } from 'payload'
import { seoMetaField } from '../fields/seoMeta'

export const NewsArticles: CollectionConfig = {
  slug: 'newsArticles',
  labels: { singular: 'Haber', plural: 'Haberler & Duyurular' },
  admin: {
    useAsTitle: 'title',
    group: '🎨 Özelleştirme',
    defaultColumns: ['title', 'category', 'date', 'featured', 'updatedAt'],
    description: 'Sitedeki /haberler sayfasında listelenen kurumsal haberler ve duyurular.',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Haber İçeriği',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Haber Başlığı' },
            {
              name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug',
              admin: { description: 'URL’deki ad — küçük harf, tire ile (ör. "holding-yapilanmasi").' },
            },
            { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Kapak Görseli' },
            { name: 'excerpt', type: 'textarea', required: true, label: 'Özet (liste kartında görünür)' },
            { name: 'body', type: 'richText', required: true, label: 'Haber İçeriği (tam metin)' },
          ],
        },
        {
          label: 'Yayın Ayarları',
          fields: [
            {
              name: 'date', type: 'date', required: true, label: 'Yayın Tarihi',
              admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
              defaultValue: () => new Date(),
            },
            {
              name: 'category', type: 'select', required: true, label: 'Kategori', defaultValue: 'kurumsal',
              options: [
                { label: 'Kurumsal', value: 'kurumsal' },
                { label: 'Sektörel', value: 'sektorel' },
                { label: 'Sürdürülebilirlik', value: 'surdurulebilirlik' },
                { label: 'İhracat', value: 'ihracat' },
                { label: 'Kariyer', value: 'kariyer' },
                { label: 'Ar-Ge', value: 'arge' },
                { label: 'Etkinlik', value: 'etkinlik' },
              ],
            },
            { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Öne Çıkan (üstte gösterilir)' },
          ],
        },
        {
          label: 'SEO',
          fields: [seoMetaField],
        },
      ],
    },
  ],
}
