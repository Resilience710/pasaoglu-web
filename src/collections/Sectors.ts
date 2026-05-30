import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { seoMetaField } from '../fields/seoMeta'

export const Sectors: CollectionConfig = {
  slug: 'sectors',
  labels: { singular: 'Sektör Sayfası', plural: 'Sektör Sayfaları' },
  admin: {
    useAsTitle: 'name',
    group: '🎨 Özelleştirme',
    description: 'Kimya, Yapı, Gıda sektör sayfaları. Her birinin renk teması ve içeriği bağımsız düzenlenebilir.',
    defaultColumns: ['name', 'slug', 'theme', 'updatedAt'],
    components: {
      views: {
        edit: {
          root: { Component: '@/components/admin/SectorEditor#default' },
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
            { name: 'name', type: 'text', required: true, label: 'Sektör Adı' },
            {
              name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug',
              admin: { description: 'URL’deki ad (kimya, yapi, gida). Var olanı değiştirmeyin.' },
            },
            { name: 'shortDescription', type: 'textarea', label: 'Kısa Açıklama (sektörler listesi kartında görünür)' },
            { name: 'cardImage', type: 'upload', relationTo: 'media', label: 'Sektörler Sayfasındaki Kart Görseli' },
            {
              name: 'theme', type: 'select', required: true, defaultValue: 'chem',
              label: 'Renk Teması',
              options: [
                { label: 'Kimya — Mor', value: 'chem' },
                { label: 'Yapı — Gri', value: 'build' },
                { label: 'Gıda — Yeşil', value: 'food' },
              ],
            },
          ],
        },
        {
          label: 'Sayfa İçeriği',
          fields: [
            {
              name: 'layout', type: 'blocks', required: true, blocks: allBlocks,
              label: 'Sayfa İçeriği — Sürükle-bırak Bölümler',
              labels: { singular: 'Bölüm', plural: 'Bölümler' },
              admin: {
                initCollapsed: true,
                description: 'Bölümler varsayılan olarak kapalı gelir, düzenlemek için tıklayın.',
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
