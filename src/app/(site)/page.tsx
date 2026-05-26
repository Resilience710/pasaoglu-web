import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'

export const revalidate = 60

async function getHomePage() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0]
}

export default async function HomePage() {
  const page = await getHomePage()
  if (!page) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="section-title">Paşaoğlu Group</h1>
        <p className="body-lead mt-4">
          Site içeriği henüz eklenmemiş. Admin paneline gidip
          <code className="mx-2 px-2 py-1 bg-brand-cream rounded">slug=home</code>
          olan bir sayfa oluşturun.
        </p>
        <a href="/admin" className="btn btn-primary mt-8">Admin Paneline Git</a>
      </div>
    )
  }
  return <BlockRenderer layout={page.layout as any[]} />
}
