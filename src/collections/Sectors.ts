import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'

export const Sectors: CollectionConfig = {
  slug: 'sectors',
  admin: {
    useAsTitle: 'name',
    group: 'İçerik',
    description: 'Kimya / Yapı / Gıda sektör sayfaları. Her birine farklı renk teması atayın.',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Sektör adı' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug (ör. kimya)' },
    { name: 'shortDescription', type: 'textarea', label: 'Kısa açıklama (kart için)' },
    { name: 'cardImage', type: 'upload', relationTo: 'media', label: 'Kart görseli' },
    {
      name: 'theme',
      type: 'select',
      required: true,
      defaultValue: 'chem',
      label: 'Renk teması',
      options: [
        { label: 'Kimya (Mavi)', value: 'chem' },
        { label: 'Yapı (Toprak)', value: 'build' },
        { label: 'Gıda (Yeşil)', value: 'food' },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: allBlocks,
      label: 'Sayfa içeriği',
    },
  ],
}
