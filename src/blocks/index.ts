import type { Block } from 'payload'

export const HeroVideo: Block = {
  slug: 'heroVideo',
  labels: { singular: 'Hero (Büyük Üst Alan)', plural: 'Hero (Büyük Üst Alan)' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      label: 'Görünüm Stili',
      options: [
        { label: 'Ortalı Overlay (Veskim tarzı)', value: 'centered' },
        { label: 'Sağ Panel (Ergun tarzı)', value: 'sidePanel' },
        { label: 'Sol Hizalı (Klasik)', value: 'leftAligned' },
        { label: 'Tam Ekran Görsel (Gıda)', value: 'fullImage' },
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Üst etiket' },
    { name: 'title', type: 'text', required: true, label: 'Başlık (* için * etrafı bold olur)' },
    { name: 'titleAccent', type: 'text', label: 'Vurgu kelimesi (bold)' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    { name: 'video', type: 'upload', relationTo: 'media', label: 'Arkaplan video' },
    { name: 'poster', type: 'upload', relationTo: 'media', label: 'Yedek görsel (video yoksa)' },
    {
      name: 'buttons',
      type: 'array',
      label: 'Butonlar',
      maxRows: 3,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Birincil (dolu altın)', value: 'primary' },
            { label: 'İkincil (çerçeveli)', value: 'ghost' },
            { label: 'Beyaz/Aksan', value: 'accent' },
          ],
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Sertifika rozetleri (Veskim tarzı için)',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Ad (ör. ISO 9001)' },
        { name: 'description', type: 'text', label: 'Alt etiket (ör. KALİTE YÖNETİM)' },
      ],
    },
    {
      name: 'sidePanel',
      type: 'group',
      label: 'Sağ Panel (Ergun stili için)',
      fields: [
        { name: 'panelTitle', type: 'text' },
        { name: 'panelText', type: 'textarea' },
        { name: 'panelCtaLabel', type: 'text' },
        { name: 'panelCtaHref', type: 'text' },
      ],
    },
    { name: 'showScrollIndicator', type: 'checkbox', defaultValue: true, label: 'Aşağı kaydır oku göster' },
  ],
}

export const SplitTextImage: Block = {
  slug: 'splitTextImage',
  labels: { singular: 'Bölünmüş (Metin+Görsel)', plural: 'Bölünmüş (Metin+Görsel)' },
  fields: [
    {
      name: 'mediaSide',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Görsel sağda', value: 'right' },
        { label: 'Görsel solda', value: 'left' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'features',
      type: 'array',
      label: 'Alt özellikler (opsiyonel)',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'button',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

export const StatsGrid: Block = {
  slug: 'statsGrid',
  labels: { singular: 'İstatistik Grid', plural: 'İstatistik Grid' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Koyu (Navy arkaplan)', value: 'dark' },
        { label: 'Açık (Krem arkaplan)', value: 'light' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Değer (ör. 36, 155+, 25.000)' },
        { name: 'label', type: 'text', required: true, label: 'Etiket (ör. YILLIK TECRÜBE)' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const FeatureCards: Block = {
  slug: 'featureCards',
  labels: { singular: 'Kart Grid', plural: 'Kart Grid' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 sütun', value: '2' },
        { label: '3 sütun', value: '3' },
        { label: '4 sütun', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text', label: 'Link (opsiyonel)' },
      ],
    },
  ],
}

export const PartnerMarquee: Block = {
  slug: 'partnerMarquee',
  labels: { singular: 'Ortak Logoları (Kayan)', plural: 'Ortak Logoları (Kayan)' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text' },
      ],
    },
  ],
}

export const DocumentGrid: Block = {
  slug: 'documentGrid',
  labels: { singular: 'Belge Grid', plural: 'Belge Grid' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
  ],
}

export const Accordion: Block = {
  slug: 'accordion',
  labels: { singular: 'Akordeon', plural: 'Akordeon' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
      ],
    },
  ],
}

export const QuoteBand: Block = {
  slug: 'quoteBand',
  labels: { singular: 'Alıntı Bandı', plural: 'Alıntı Bandı' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text' },
    { name: 'background', type: 'upload', relationTo: 'media' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Zengin Metin', plural: 'Zengin Metin' },
  fields: [{ name: 'content', type: 'richText', required: true }],
}

export const ProductAccordion: Block = {
  slug: 'productAccordion',
  labels: { singular: 'Ürün Kategorileri (Akordeon)', plural: 'Ürün Kategorileri (Akordeon)' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'productCategories',
      hasMany: true,
    },
  ],
}

export const PolicyNav: Block = {
  slug: 'policyNav',
  labels: { singular: 'Politika Nav', plural: 'Politika Nav' },
  fields: [
    {
      name: 'links',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}

export const ContactBlock: Block = {
  slug: 'contactBlock',
  labels: { singular: 'İletişim Bloğu', plural: 'İletişim Bloğu' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'offices',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'mapEmbed', type: 'textarea', label: 'Google Maps iframe src' },
      ],
    },
  ],
}

export const CareerFormBlock: Block = {
  slug: 'careerForm',
  labels: { singular: 'Kariyer Formu', plural: 'Kariyer Formu' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'departments',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'İletişim Formu', plural: 'İletişim Formu' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'subjects',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}

export const allBlocks = [
  HeroVideo,
  SplitTextImage,
  StatsGrid,
  FeatureCards,
  PartnerMarquee,
  DocumentGrid,
  Accordion,
  QuoteBand,
  RichTextBlock,
  ProductAccordion,
  PolicyNav,
  ContactBlock,
  CareerFormBlock,
  ContactFormBlock,
]
