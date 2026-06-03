import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Kullanıcı', plural: '👤 Yönetici Kullanıcılar' },
  admin: {
    useAsTitle: 'email',
    group: '⚙️ Sistem',
    components: {
      views: { edit: { root: { Component: '@/components/admin/UsersEditor#default' } } },
    },
  },
  auth: true,
  access: {
    // Güvenlik: admin kullanıcı listesi/e-postaları herkese açık OLMAMALI — sadece giriş yapmış yöneticiler
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Yönetici', value: 'admin' },
        { label: 'Editör', value: 'editor' },
      ],
    },
  ],
}
