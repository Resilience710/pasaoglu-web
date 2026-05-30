import { getPayload } from 'payload'
import config from '@payload-config'
import SimpleCollectionEditorClient from './SimpleCollectionEditorClient'
import { getDocIdFromProps } from './_editorProps'

export default async function DocumentsEditor(props: any) {
  const id = getDocIdFromProps(props)
  const payload = await getPayload({ config })
  let doc: any = null
  if (id) {
    try { doc = await payload.findByID({ collection: 'documents', id, depth: 1 }) } catch { doc = null }
  }
  return <SimpleCollectionEditorClient collection="documents" docId={id} initial={doc || {}} />
}
