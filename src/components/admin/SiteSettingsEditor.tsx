import { getPayload } from 'payload'
import config from '@payload-config'
import SiteSettingsEditorClient from './SiteSettingsEditorClient'

export default async function SiteSettingsEditor() {
  const payload = await getPayload({ config })
  let doc: any = {}
  try {
    doc = await payload.findGlobal({ slug: 'siteSettings', depth: 1 })
  } catch {
    doc = {}
  }
  return <SiteSettingsEditorClient initial={doc || {}} />
}
