import { getPayload } from 'payload'
import config from '@payload-config'
import SectorEditorClient from './SectorEditorClient'
import { getDocIdFromProps } from './_editorProps'

export default async function SectorEditor(props: any) {
  const id = getDocIdFromProps(props)

  const payload = await getPayload({ config })
  let doc: any = null
  if (id) {
    try {
      doc = await payload.findByID({ collection: 'sectors', id, depth: 2 })
    } catch {
      doc = null
    }
  }

  return (
    <SectorEditorClient
      sectorId={id}
      initial={{
        name: doc?.name || '',
        slug: doc?.slug || '',
        shortDescription: doc?.shortDescription || '',
        cardImage: doc?.cardImage || null,
        theme: doc?.theme || 'chem',
        layout: doc?.layout || [],
      }}
    />
  )
}
