import { getPayload } from 'payload'
import config from '@payload-config'
import MainNavEditorClient from './MainNavEditorClient'

export default async function MainNavEditor() {
  const payload = await getPayload({ config })
  let doc: any = {}
  try {
    doc = await payload.findGlobal({ slug: 'mainNav', depth: 0 })
  } catch {
    doc = {}
  }
  return <MainNavEditorClient initial={doc || {}} />
}
