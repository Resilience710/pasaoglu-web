import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

/**
 * "Ana Sayfayı Düzenle" kısayolu. Kök custom view'lar Nav'sız render edildiğinden
 * burada home page id'sini bulup koleksiyon edit görünümüne (Nav'lı PageEditor) yönlendiriyoruz.
 */
export default async function HomeEditorRedirect() {
  const payload = await getPayload({ config })
  let id: string | number | null = null
  try {
    const res = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
    id = res.docs[0]?.id ?? null
  } catch {
    id = null
  }
  redirect(id ? `/admin/collections/pages/${id}` : '/admin/collections/pages')
}
