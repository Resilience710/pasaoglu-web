import { getPayload } from 'payload'
import config from '@payload-config'
import SimpleCollectionEditorClient from './SimpleCollectionEditorClient'
import { getDocIdFromProps } from './_editorProps'

export default async function NewsArticlesEditor(props: any) {
  const id = getDocIdFromProps(props)
  const payload = await getPayload({ config })
  let doc: any = null
  if (id) {
    try { doc = await payload.findByID({ collection: 'newsArticles', id, depth: 1 }) } catch { doc = null }
  }
  return <SimpleCollectionEditorClient collection="newsArticles" docId={id} initial={doc || {}} />
}
