/**
 * Payload v3 edit-view (edit.root) server component'ine doc id'sini güvenli çıkarır.
 * Props'ta `id` YOKTUR; bunun yerine docID / initPageResult.docID / doc.id / routeSegments gelir.
 */
export function getDocIdFromProps(props: any): string | number | null {
  const segs = props?.routeSegments
  const raw =
    props?.docID ??
    props?.initPageResult?.docID ??
    props?.doc?.id ??
    (Array.isArray(segs) ? segs[segs.length - 1] : undefined)
  return raw && raw !== 'create' ? raw : null
}
