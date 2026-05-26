import type { CollectionConfig } from 'payload'

export const CareerApplications: CollectionConfig = {
  slug: 'careerApplications',
  labels: { singular: 'Kariyer Başvurusu', plural: 'Kariyer Başvuruları' },
  admin: {
    useAsTitle: 'fullName',
    group: '📥 Form Gönderileri',
    defaultColumns: ['fullName', 'department', 'email', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'department', type: 'text', required: true },
    { name: 'coverLetter', type: 'textarea' },
    { name: 'cv', type: 'upload', relationTo: 'media', label: 'CV dosyası' },
  ],
}
