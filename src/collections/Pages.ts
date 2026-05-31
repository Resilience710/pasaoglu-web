import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { seoMetaField } from '../fields/seoMeta'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Sayfa', plural: 'Sayfalar' },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  admin: {
    useAsTitle: 'title',
    group: '🎨 Özelleştirme',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Sitedeki tüm sayfaların içeriği. Her sayfa "Sayfa içeriği" altındaki bloklarla yönetilir. Her bloğun metni, görseli, butonu düzenlenebilir.',
    listSearchableFields: ['title', 'slug'],
    components: {
      views: {
        edit: {
          root: { Component: '@/components/admin/PageEditor#default' },
        },
      },
    },
  },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Temel Bilgiler',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Sayfa Adı',
              admin: { description: 'Admin panelinde gösterilen sayfa adı (ör. "Ana Sayfa", "Hakkımızda"). URL’i etkilemez.' },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'URL Yolu (slug)',
              admin: {
                description: 'Sayfanın adresi. Ana sayfa için "home". Diğerleri için "hakkimizda", "kariyer", "iletisim" gibi. Politika alt sayfaları için "politikalarimiz/kalite" şeklinde.',
              },
            },
          ],
        },
        {
          label: 'Sayfa İçeriği',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: allBlocks,
              label: 'Sayfa İçeriği — Sürükle-bırak Bölümler',
              labels: { singular: 'Bölüm', plural: 'Bölümler' },
              admin: {
                initCollapsed: true,
                description: 'Bölümler varsayılan olarak kapalı gelir, düzenlemek için tıklayın. "+ Bölüm Ekle" ile yeni içerik ekleyin.',
              },
            },
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
