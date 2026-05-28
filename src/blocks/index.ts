import type { Block } from 'payload'

const buttonsField = {
  name: 'buttons',
  type: 'array' as const,
  label: 'Butonlar',
  maxRows: 3,
  fields: [
    { name: 'label', type: 'text' as const, required: true, label: 'Buton Yazısı' },
    { name: 'href', type: 'text' as const, required: true, label: 'Bağlantı (URL veya iç sayfa örn. /iletisim)' },
    {
      name: 'variant', type: 'select' as const, defaultValue: 'primary',
      label: 'Buton Stili',
      options: [
        { label: 'Birincil (dolu mavi)', value: 'primary' },
        { label: 'Aksan (renkli)', value: 'accent' },
        { label: 'Çerçeveli (şeffaf)', value: 'ghost' },
      ],
    },
  ],
}

export const HeroVideo: Block = {
  slug: 'heroVideo',
  admin: { disableBlockName: true },
  labels: { singular: '🎬 Hero (Üst Büyük Alan)', plural: 'Hero (Üst Büyük Alan)' },
  fields: [
    {
      name: 'variant', type: 'select', defaultValue: 'centered', label: 'Görünüm Stili',
      options: [
        { label: 'Ortalı Overlay (Veskim tarzı) — koyu zemin üzeri merkez yazı', value: 'centered' },
        { label: 'Sağ Panel (Ergun tarzı) — sol başlık + sağ beyaz panel', value: 'sidePanel' },
        { label: 'Sol Hizalı — klasik soldan başlık', value: 'leftAligned' },
        { label: 'Tam Ekran Görsel — alt-sol başlık, açık zemin', value: 'fullImage' },
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Üst Etiket (küçük yazı, ör. "1987’den bu yana")' },
    { name: 'title', type: 'text', required: true, label: 'Ana Başlık' },
    { name: 'titleAccent', type: 'text', label: 'Vurgu Kelimesi (alt satırda kalın/renkli görünür)' },
    { name: 'description', type: 'textarea', label: 'Açıklama Paragrafı' },
    { name: 'video', type: 'upload', relationTo: 'media', label: 'Arkaplan Videosu (otomatik döner)' },
    { name: 'poster', type: 'upload', relationTo: 'media', label: 'Yedek / Açık Tema Görseli' },
    buttonsField,
    {
      name: 'certifications',
      type: 'array',
      label: 'Sertifika Rozetleri (Ortalı Stil için — Veskim ekranındaki gibi)',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Ad (ör. ISO 9001)' },
        { name: 'description', type: 'text', label: 'Alt Etiket (ör. KALİTE YÖNETİM)' },
      ],
    },
    {
      name: 'sidePanel', type: 'group',
      label: 'Sağ Panel (Sadece "Sağ Panel" stili için)',
      fields: [
        { name: 'panelTitle', type: 'text', label: 'Panel Başlığı' },
        { name: 'panelText', type: 'textarea', label: 'Panel Metni' },
        { name: 'panelCtaLabel', type: 'text', label: 'Panel Buton Yazısı' },
        { name: 'panelCtaHref', type: 'text', label: 'Panel Buton Linki' },
      ],
    },
    { name: 'showScrollIndicator', type: 'checkbox', defaultValue: true, label: 'Aşağı kaydır oku göster' },
  ],
}

export const SplitTextImage: Block = {
  slug: 'splitTextImage',
  admin: { disableBlockName: true },
  labels: { singular: '🖼️ Görsel + Metin', plural: 'Görsel + Metin Bölümleri' },
  fields: [
    {
      name: 'mediaSide', type: 'select', defaultValue: 'right', label: 'Görselin Pozisyonu',
      options: [
        { label: 'Sağda', value: 'right' },
        { label: 'Solda', value: 'left' },
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Üst Etiket' },
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    { name: 'body', type: 'richText', label: 'Açıklama Metni (zengin format)' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Görsel' },
    { name: 'imageCaption', type: 'text', label: 'Görsel Altı Etiket (opsiyonel, ör. "Çorlu Üretim Tesisi · 16.000 m²")' },
    {
      name: 'features', type: 'array', label: 'Alt Özellik Kutuları (numaralı liste, opsiyonel)',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Başlık' },
        { name: 'description', type: 'textarea', label: 'Açıklama' },
      ],
    },
    {
      name: 'button', type: 'group', label: 'Buton (opsiyonel)',
      fields: [
        { name: 'label', type: 'text', label: 'Buton Yazısı' },
        { name: 'href', type: 'text', label: 'Bağlantı' },
      ],
    },
  ],
}

export const StatsGrid: Block = {
  slug: 'statsGrid',
  admin: { disableBlockName: true },
  labels: { singular: '📊 İstatistik Şeridi', plural: 'İstatistik Şeritleri' },
  fields: [
    {
      name: 'variant', type: 'select', defaultValue: 'dark', label: 'Arkaplan',
      options: [
        { label: 'Koyu (Navy)', value: 'dark' },
        { label: 'Açık (Krem)', value: 'light' },
      ],
    },
    {
      name: 'items', type: 'array', minRows: 2, maxRows: 6, label: 'İstatistikler',
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Değer (ör. 36, 155+, 25.000)' },
        { name: 'label', type: 'text', required: true, label: 'Etiket (ör. YILLIK TECRÜBE)' },
        { name: 'description', type: 'textarea', label: 'Açıklama (opsiyonel)' },
      ],
    },
  ],
}

export const FeatureCards: Block = {
  slug: 'featureCards',
  admin: { disableBlockName: true },
  labels: { singular: '🎴 Kart Grid (Özellikler/Sektörler)', plural: 'Kart Grid Bölümleri' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Üst Etiket' },
    { name: 'title', type: 'text', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'columns', type: 'select', defaultValue: '3', label: 'Sütun Sayısı',
      options: [
        { label: '2 sütun', value: '2' },
        { label: '3 sütun', value: '3' },
        { label: '4 sütun', value: '4' },
      ],
    },
    {
      name: 'cards', type: 'array', minRows: 1, label: 'Kartlar',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Kart Görseli' },
        { name: 'title', type: 'text', required: true, label: 'Kart Başlığı' },
        { name: 'description', type: 'textarea', label: 'Kart Açıklaması' },
        { name: 'href', type: 'text', label: 'Tıklanınca gidilecek sayfa (opsiyonel, ör. /sektorler/kimya)' },
      ],
    },
  ],
}

export const PartnerMarquee: Block = {
  slug: 'partnerMarquee',
  admin: { disableBlockName: true },
  labels: { singular: '🔗 İş Ortakları (Kayan Logolar)', plural: 'İş Ortakları Bandı' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık (ör. "İş Ortaklarımız")' },
    {
      name: 'logos', type: 'array', label: 'Logolar',
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', required: true, label: 'Logo Dosyası' },
        { name: 'name', type: 'text', label: 'Şirket Adı' },
      ],
    },
  ],
}

export const DocumentGrid: Block = {
  slug: 'documentGrid',
  admin: { disableBlockName: true },
  labels: { singular: '📄 Belge / Sertifika Grid', plural: 'Belge Grid Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'documents', type: 'relationship', relationTo: 'documents', hasMany: true,
      label: 'Belgeler — "Özelleştirme → Belgeler & Sertifikalar"dan ekleyin',
    },
  ],
}

export const Accordion: Block = {
  slug: 'accordion',
  admin: { disableBlockName: true },
  labels: { singular: '➕ Akordeon (Aç-Kapa)', plural: 'Akordeon Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'items', type: 'array', minRows: 1, label: 'Akordeon Öğeleri',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Öğe Başlığı' },
        { name: 'body', type: 'richText', label: 'İçerik' },
      ],
    },
  ],
}

export const QuoteBand: Block = {
  slug: 'quoteBand',
  admin: { disableBlockName: true },
  labels: { singular: '💬 Alıntı Bandı', plural: 'Alıntı Bantları' },
  fields: [
    { name: 'quote', type: 'textarea', required: true, label: 'Alıntı Metni' },
    { name: 'author', type: 'text', label: 'Söyleyen / Kaynak' },
    { name: 'background', type: 'upload', relationTo: 'media', label: 'Arkaplan Görseli (opsiyonel)' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  admin: { disableBlockName: true },
  labels: { singular: '📝 Serbest Metin', plural: 'Serbest Metin Bölümleri' },
  fields: [{ name: 'content', type: 'richText', required: true, label: 'İçerik' }],
}

export const ProductAccordion: Block = {
  slug: 'productAccordion',
  admin: { disableBlockName: true },
  labels: { singular: '🧪 Ürün Kategorileri (Akordeon)', plural: 'Ürün Akordeon Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'categories', type: 'relationship', relationTo: 'productCategories', hasMany: true,
      label: 'Kategoriler — "Özelleştirme → Ürün Kategorileri"nden ekleyin',
    },
  ],
}

export const PolicyNav: Block = {
  slug: 'policyNav',
  admin: { disableBlockName: true },
  labels: { singular: '🔗 Politika Üst Menü', plural: 'Politika Üst Menüleri' },
  fields: [
    {
      name: 'links', type: 'array', minRows: 2, label: 'Bağlantılar',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Etiket' },
        { name: 'href', type: 'text', required: true, label: 'URL' },
      ],
    },
  ],
}

export const PolicyTabs: Block = {
  slug: 'policyTabs',
  admin: { disableBlockName: true },
  labels: { singular: '📋 Politika Tab’ları (Sol-Sağ Panel)', plural: 'Politika Tab Bölümleri' },
  fields: [
    { name: 'sectionEyebrow', type: 'text', defaultValue: 'Kurumsal', label: 'Üst Etiket' },
    { name: 'sectionTitle', type: 'text', required: true, label: 'Bölüm Başlığı' },
    {
      name: 'tabs', type: 'array', minRows: 2, label: 'Tab’lar (her biri ayrı politika)',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Tab Başlığı' },
        { name: 'body', type: 'richText', required: true, label: 'Politika İçeriği' },
        { name: 'detailHref', type: 'text', label: 'Detay Sayfası Linki (opsiyonel)' },
      ],
    },
  ],
}

export const Timeline: Block = {
  slug: 'timeline',
  admin: { disableBlockName: true },
  labels: { singular: '📅 Tarihçe (Timeline)', plural: 'Tarihçe Bölümleri' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Tarihçemiz', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'milestones', type: 'array', minRows: 2, label: 'Kilometre Taşları',
      fields: [
        { name: 'year', type: 'text', required: true, label: 'Yıl' },
        { name: 'title', type: 'text', required: true, label: 'Başlık' },
        { name: 'description', type: 'textarea', label: 'Açıklama' },
      ],
    },
  ],
}

export const OfficeGrid: Block = {
  slug: 'officeGrid',
  admin: { disableBlockName: true },
  labels: { singular: '📍 Ofis Adres Kartları', plural: 'Ofis Kartı Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'columns', type: 'select', defaultValue: '3', label: 'Sütun Sayısı',
      options: [
        { label: '2 sütun', value: '2' },
        { label: '3 sütun', value: '3' },
        { label: '4 sütun', value: '4' },
      ],
    },
    {
      name: 'offices', type: 'array', label: 'Ofisler',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Ofis Adı' },
        { name: 'address', type: 'textarea', required: true, label: 'Adres' },
        { name: 'phone', type: 'text', label: 'Telefon' },
        { name: 'email', type: 'text', label: 'E-posta' },
      ],
    },
  ],
}

export const CTABand: Block = {
  slug: 'ctaBand',
  admin: { disableBlockName: true },
  labels: { singular: '🎯 CTA (Eylem Çağrısı) Bandı', plural: 'CTA Bantları' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Üst Etiket' },
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'buttons', type: 'array', maxRows: 2, label: 'Butonlar',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Buton Yazısı' },
        { name: 'href', type: 'text', required: true, label: 'Link' },
        {
          name: 'variant', type: 'select', defaultValue: 'gold', label: 'Stil',
          options: [
            { label: 'Aksan (Renkli)', value: 'gold' },
            { label: 'Çerçeveli', value: 'ghost' },
          ],
        },
      ],
    },
    {
      name: 'variant', type: 'select', defaultValue: 'dark', label: 'Arkaplan',
      options: [
        { label: 'Koyu (Navy)', value: 'dark' },
        { label: 'Açık', value: 'light' },
      ],
    },
  ],
}

export const ContactBlock: Block = {
  slug: 'contactBlock',
  admin: { disableBlockName: true },
  labels: { singular: '📞 İletişim Adres Kartı (Harita ile)', plural: 'İletişim Adres Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    {
      name: 'offices', type: 'array', maxRows: 4, label: 'Ofisler',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Ofis Adı' },
        { name: 'address', type: 'textarea', required: true, label: 'Adres' },
        { name: 'phone', type: 'text', label: 'Telefon' },
        { name: 'email', type: 'text', label: 'E-posta' },
        { name: 'mapEmbed', type: 'textarea', label: 'Google Maps iframe src URL’i (opsiyonel)' },
      ],
    },
  ],
}

export const CareerFormBlock: Block = {
  slug: 'careerForm',
  admin: { disableBlockName: true },
  labels: { singular: '💼 Kariyer Formu', plural: 'Kariyer Form Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'departments', type: 'array', label: 'Departman Seçenekleri',
      fields: [{ name: 'name', type: 'text', required: true, label: 'Departman Adı' }],
    },
  ],
}

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  admin: { disableBlockName: true },
  labels: { singular: '✉️ İletişim Formu', plural: 'İletişim Form Bölümleri' },
  fields: [
    { name: 'title', type: 'text', label: 'Başlık' },
    {
      name: 'subjects', type: 'array', label: 'Konu Seçenekleri',
      fields: [{ name: 'name', type: 'text', required: true, label: 'Konu Adı' }],
    },
  ],
}

export const NewsGrid: Block = {
  slug: 'newsGrid',
  admin: { disableBlockName: true },
  labels: { singular: '📰 Haberler Grid', plural: 'Haberler Bölümleri' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Üst Etiket', defaultValue: 'Haber Bülteni' },
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'items', type: 'array', minRows: 1, maxRows: 8, label: 'Haberler',
      fields: [
        { name: 'date', type: 'date', label: 'Tarih', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
        { name: 'category', type: 'text', label: 'Kategori (ör. KURUMSAL, SEKTÖREL)' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Haber Görseli' },
        { name: 'title', type: 'text', required: true, label: 'Haber Başlığı' },
        { name: 'excerpt', type: 'textarea', label: 'Özet' },
        { name: 'href', type: 'text', label: 'Devamı için link (opsiyonel)' },
      ],
    },
  ],
}

export const WorldReach: Block = {
  slug: 'worldReach',
  admin: { disableBlockName: true },
  labels: { singular: '🌍 Küresel Erişim (Harita)', plural: 'Küresel Erişim Bölümleri' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Üst Etiket', defaultValue: 'Küresel Erişim' },
    { name: 'title', type: 'text', required: true, label: 'Başlık', defaultValue: '36 Ülkeye İhracat' },
    { name: 'description', type: 'textarea', label: 'Açıklama' },
    {
      name: 'stats', type: 'array', maxRows: 4, label: 'Alt İstatistikler',
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Değer' },
        { name: 'label', type: 'text', required: true, label: 'Etiket' },
      ],
    },
    {
      name: 'highlightPoints',
      type: 'array',
      label: 'Vurgu Noktaları (harita üzerinde parlayan)',
      maxRows: 12,
      fields: [
        { name: 'name', type: 'text', label: 'Bölge Adı' },
        { name: 'xPercent', type: 'number', required: true, min: 0, max: 100, label: 'X% (0-100, soldan)' },
        { name: 'yPercent', type: 'number', required: true, min: 0, max: 100, label: 'Y% (0-100, üstten)' },
      ],
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
  PolicyTabs,
  Timeline,
  OfficeGrid,
  CTABand,
  ContactBlock,
  CareerFormBlock,
  ContactFormBlock,
  NewsGrid,
  WorldReach,
]
