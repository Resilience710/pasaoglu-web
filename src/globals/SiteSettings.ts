import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Ayarları (Logo, Footer, İletişim)',
  admin: {
    group: '🎨 Özelleştirme',
    description: 'Logo, telefon, e-posta, sosyal medya ve footer kolonları — tüm sayfalarda görünür.',
  },
  access: { read: () => true },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    { name: 'logoDark', type: 'upload', relationTo: 'media', label: 'Logo (koyu arkaplan için)' },
    { name: 'tagline', type: 'text', label: 'Topbar metni' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'text' },
    {
      name: 'addresses',
      type: 'array',
      label: 'Adresler',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
      ],
    },
    {
      name: 'social',
      type: 'array',
      label: 'Sosyal medya',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['LinkedIn', 'Instagram', 'Facebook', 'YouTube', 'X'].map((v) => ({
            label: v,
            value: v.toLowerCase(),
          })),
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO & Analytics (Site Geneli)',
      admin: { description: 'Sayfaya özel meta verilmediğinde kullanılan varsayılanlar ve analitik entegrasyonları.' },
      fields: [
        { name: 'siteName', type: 'text', label: 'Site Adı (başlık şablonu için)', defaultValue: 'Paşaoğlu Group' },
        { name: 'titleTemplate', type: 'text', label: 'Başlık Şablonu', defaultValue: '%s | Paşaoğlu Group', admin: { description: '%s sayfanın başlığıyla değiştirilir.' } },
        { name: 'defaultDescription', type: 'textarea', label: 'Varsayılan Açıklama' },
        { name: 'defaultOgImage', type: 'upload', relationTo: 'media', label: 'Varsayılan Paylaşım Görseli' },
        { name: 'twitterHandle', type: 'text', label: 'Twitter / X Kullanıcı Adı (@ olmadan)' },
        { name: 'googleSiteVerification', type: 'text', label: 'Google Search Console Doğrulama Kodu' },
        { name: 'googleAnalyticsId', type: 'text', label: 'Google Analytics ID (ör. G-XXXXXXXXXX)' },
        { name: 'organizationLegalName', type: 'text', label: 'Kurumsal Yasal Ad (Schema.org)' },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        { name: 'description', type: 'textarea' },
        {
          name: 'columns',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
        { name: 'copyright', type: 'text' },
      ],
    },
  ],
}
