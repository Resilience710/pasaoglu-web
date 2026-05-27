import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { seoMetaField } from '../fields/seoMeta'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Sayfa', plural: 'Sayfalar' },
  admin: {
    useAsTitle: 'title',
    group: '🎨 Özelleştirme',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Sitedeki tüm sayfaların içeriği. Her sayfa "Sayfa içeriği" altındaki bloklarla yönetilir. Her bloğun metni, görseli, butonu düzenlenebilir.',
    listSearchableFields: ['title', 'slug'],
  },
  access: { read: () => true },
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
    seoMetaField,
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: allBlocks,
      label: 'Sayfa İçeriği — Sürükle-bırak Bloklar',
      labels: { singular: 'Blok', plural: 'Bloklar' },
      admin: {
        description: 'Sayfaya bölümler ekleyin. "+ Bölüm Ekle" diyerek Hero, Görsel+Metin, İstatistik, Kart Grid, Akordeon vb. ekleyebilirsiniz.',
      },
    },
  ],
}
