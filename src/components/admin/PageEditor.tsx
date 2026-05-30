import { getPayload } from 'payload'
import config from '@payload-config'
import PageEditorClient from './PageEditorClient'
import { getDocIdFromProps } from './_editorProps'

export default async function PageEditor(props: any) {
  const id = getDocIdFromProps(props)

  const payload = await getPayload({ config })
  let doc: any = null
  if (id) {
    try {
      doc = await payload.findByID({ collection: 'pages', id, depth: 2 })
    } catch {
      doc = null
    }
  }

  return (
    <PageEditorClient
      pageId={id}
      initial={{ title: doc?.title || '', slug: doc?.slug || '', layout: doc?.layout || [] }}
    />
  )
}
