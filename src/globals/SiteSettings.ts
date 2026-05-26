import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Ayarları',
  admin: { group: 'Ayarlar' },
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
