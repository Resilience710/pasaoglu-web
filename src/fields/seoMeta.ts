import type { Field } from 'payload'

export const seoMetaField: Field = {
  name: 'meta',
  type: 'group',
  label: '🔍 SEO Ayarları',
  admin: {
    description: 'Sayfanın Google ve sosyal medyada nasıl görüneceği. Boş bırakılan alanlar için sayfa başlığı/açıklaması kullanılır.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'SEO Başlığı (Google’da gösterilen başlık)',
      admin: { description: '50-60 karakter ideal. Boş bırakılırsa sayfa adı kullanılır. Site adı otomatik eklenir.' },
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'SEO Açıklaması (meta description)',
      admin: { description: '150-160 karakter ideal. Google arama sonuçlarında görünür.' },
      maxLength: 200,
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Anahtar Kelimeler (virgülle ayırın)',
      admin: { description: 'ör. kimya, yapı, gıda, holding, paşaoğlu' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Paylaşım Görseli (Open Graph / Twitter Card)',
      admin: { description: 'WhatsApp/Facebook/Twitter’da link paylaşıldığında görünen kapak. 1200x630 px önerilir.' },
    },
    {
      name: 'ogTitle',
      type: 'text',
      label: 'Sosyal Medya Başlığı (opsiyonel)',
      admin: { description: 'Sosyal paylaşımlar için ayrı başlık. Boşsa SEO başlığı kullanılır.' },
    },
    {
      name: 'ogDescription',
      type: 'textarea',
      label: 'Sosyal Medya Açıklaması (opsiyonel)',
      admin: { description: 'Sosyal paylaşımlar için ayrı açıklama.' },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Kanonik URL (opsiyonel)',
      admin: { description: 'Sayfanın resmi tek adresi. Yinelenen içerik problemini önler. ör. https://pasaoglugroup.com.tr/hakkimizda' },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'Google’a indeksletme (noindex)',
      defaultValue: false,
      admin: { description: 'İşaretlerseniz bu sayfa Google’da görünmez.' },
    },
  ],
}
