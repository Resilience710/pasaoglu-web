import { getPayload } from 'payload'
import config from '@payload-config'
import ProductCategoryEditorClient from './ProductCategoryEditorClient'
import { getDocIdFromProps } from './_editorProps'

export default async function ProductCategoryEditor(props: any) {
  const id = getDocIdFromProps(props)

  const payload = await getPayload({ config })
  let doc: any = null
  if (id) {
    try {
      doc = await payload.findByID({ collection: 'productCategories', id, depth: 1 })
    } catch {
      doc = null
    }
  }

  return <ProductCategoryEditorClient catId={id} initial={doc || {}} />
}
