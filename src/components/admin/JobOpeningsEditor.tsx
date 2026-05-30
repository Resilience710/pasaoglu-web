import { getPayload } from 'payload'
import config from '@payload-config'
import SimpleCollectionEditorClient from './SimpleCollectionEditorClient'
import { getDocIdFromProps } from './_editorProps'

export default async function JobOpeningsEditor(props: any) {
  const id = getDocIdFromProps(props)
  const payload = await getPayload({ config })
  let doc: any = null
  if (id) {
    try { doc = await payload.findByID({ collection: 'jobOpenings', id, depth: 0 }) } catch { doc = null }
  }
  return <SimpleCollectionEditorClient collection="jobOpenings" docId={id} initial={doc || {}} />
}
