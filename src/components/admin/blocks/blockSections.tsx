'use client'

import React from 'react'
import {
  TextField,
  TextAreaField,
  ToggleField,
  SelectField,
  NumberField,
  ImageField,
  RepeaterField,
  RelationshipMultiField,
  type MediaValue,
} from '../fields'

/* ===========================================================
   Lexical <-> düz metin
=========================================================== */
// Lexical düğümlerinden düz metin çıkar. Madde listeleri "- madde" satırı olur.
function nodeText(node: any): string {
  return (node?.children || [])
    .map((c: any) => (typeof c?.text === 'string' ? c.text : nodeText(c)))
    .join('')
}
export function lexicalToText(rt: any): string {
  try {
    const children = rt?.root?.children || []
    const blocks: string[] = []
    for (const node of children) {
      if (node?.type === 'list') {
        const items = (node.children || []).map((li: any) => '- ' + nodeText(li).trim())
        if (items.length) blocks.push(items.join('\n'))
      } else {
        const t = nodeText(node)
        if (t.trim()) blocks.push(t)
      }
    }
    return blocks.join('\n\n')
  } catch {
    return ''
  }
}

const textNode = (text: string) => ({ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal', style: '' })
const paragraphNode = (text: string) => ({ type: 'paragraph', version: 1, children: [textNode(text)] })
const listNode = (items: string[]) => ({
  type: 'list', version: 1, tag: 'ul', listType: 'bullet', start: 1, direction: 'ltr', format: '', indent: 0,
  children: items.map((t, i) => ({ type: 'listitem', version: 1, value: i + 1, direction: 'ltr', format: '', indent: 0, children: [textNode(t)] })),
})

// Düz metni Lexical'e çevir. "- " / "• " / "* " ile başlayan satırlar madde listesi olur.
export function textToLexical(text: string): any {
  const lines = (text || '').replace(/\r/g, '').split('\n')
  const nodes: any[] = []
  let para: string[] = []
  let bullets: string[] = []
  const isBullet = (l: string) => /^\s*[-•*]\s+/.test(l)
  const flushPara = () => { if (para.length) { nodes.push(paragraphNode(para.join(' ').trim())); para = [] } }
  const flushBullets = () => { if (bullets.length) { nodes.push(listNode(bullets)); bullets = [] } }
  for (const line of lines) {
    if (isBullet(line)) { flushPara(); bullets.push(line.replace(/^\s*[-•*]\s+/, '').trim()) }
    else if (line.trim() === '') { flushPara(); flushBullets() }
    else { flushBullets(); para.push(line.trim()) }
  }
  flushPara(); flushBullets()
  if (!nodes.length) nodes.push(paragraphNode(''))
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: nodes } }
}

/* ===========================================================
   Medya normalize
=========================================================== */
export function toMedia(v: any): MediaValue {
  if (!v) return null
  if (typeof v === 'object') return { id: v.id, url: v.url, alt: v.alt }
  return { id: v }
}
function fromMedia(v: any): any {
  if (!v) return null
  if (typeof v === 'object') return v.id ?? null
  return v
}
function relIds(v: any[]): (string | number)[] {
  return (v || []).map((x) => (x && typeof x === 'object' ? x.id : x))
}

/* ===========================================================
   Blok meta + "Bölüm Ekle" listesi
=========================================================== */
export const BLOCK_META: Record<string, { label: string }> = {
  heroVideo: { label: 'Üst Hero (Büyük Alan)' },
  splitTextImage: { label: 'Metin + Görsel' },
  statsGrid: { label: 'İstatistik Şeridi' },
  featureCards: { label: 'Kart Grid (Sektör/Özellik)' },
  partnerMarquee: { label: 'İş Ortakları (Logolar)' },
  documentGrid: { label: 'Belge / Sertifika Grid' },
  accordion: { label: 'Akordeon (Aç-Kapa)' },
  quoteBand: { label: 'Alıntı Bandı' },
  richText: { label: 'Serbest Metin' },
  productAccordion: { label: 'Ürün Kategorileri (Akordeon)' },
  policyNav: { label: 'Politika Üst Menü' },
  policyTabs: { label: 'Politika Tabları' },
  timeline: { label: 'Tarihçe (Timeline)' },
  officeGrid: { label: 'Ofis Adres Kartları' },
  ctaBand: { label: 'Eylem Çağrısı (CTA)' },
  contactBlock: { label: 'İletişim Adres Kartı (Harita)' },
  careerForm: { label: 'Kariyer Formu' },
  contactForm: { label: 'İletişim Formu' },
  newsGrid: { label: 'Haberler Grid' },
  worldReach: { label: 'Küresel Erişim (Harita)' },
}

export const ADDABLE_BLOCKS: { value: string; label: string }[] = Object.entries(BLOCK_META).map(
  ([value, m]) => ({ value, label: m.label }),
)

export function blockLabel(blockType: string): string {
  return BLOCK_META[blockType]?.label || blockType
}

/* ===========================================================
   Yeni blok fabrikaları
=========================================================== */
export function newBlock(blockType: string): any {
  const base = { blockType }
  switch (blockType) {
    case 'heroVideo':
      return { ...base, variant: 'centered', title: 'Yeni Başlık', titleAccent: '', eyebrow: '', description: '', showScrollIndicator: true, certifications: [], buttons: [] }
    case 'splitTextImage':
      return { ...base, mediaSide: 'right', eyebrow: '', title: 'Yeni Başlık', body: textToLexical(''), imageCaption: '', button: { label: '', href: '' } }
    case 'statsGrid':
      return { ...base, variant: 'dark', items: [{ value: '0', label: 'Etiket' }, { value: '0', label: 'Etiket' }] }
    case 'featureCards':
      return { ...base, eyebrow: '', title: 'Başlık', description: '', columns: '3', cards: [{ title: 'Kart', description: '', href: '' }] }
    case 'partnerMarquee':
      return { ...base, title: 'İş Ortaklarımız', logos: [] }
    case 'documentGrid':
      return { ...base, title: '', description: '', documents: [] }
    case 'accordion':
      return { ...base, title: '', description: '', items: [{ title: 'Başlık', body: textToLexical('') }] }
    case 'quoteBand':
      return { ...base, quote: 'Alıntı metni', author: '' }
    case 'richText':
      return { ...base, content: textToLexical('') }
    case 'productAccordion':
      return { ...base, title: '', description: '', categories: [] }
    case 'policyNav':
      return { ...base, links: [{ label: '', href: '' }, { label: '', href: '' }] }
    case 'policyTabs':
      return { ...base, sectionEyebrow: 'Kurumsal', sectionTitle: 'Başlık', tabs: [{ title: 'Tab', body: textToLexical(''), detailHref: '' }, { title: 'Tab', body: textToLexical(''), detailHref: '' }] }
    case 'timeline':
      return { ...base, title: 'Tarihçemiz', description: '', milestones: [{ year: '2020', title: 'Başlık', description: '' }, { year: '2021', title: 'Başlık', description: '' }] }
    case 'officeGrid':
      return { ...base, title: '', description: '', columns: '3', offices: [{ name: 'Ofis', address: 'Adres' }] }
    case 'ctaBand':
      return { ...base, variant: 'dark', eyebrow: '', title: 'Başlık', description: '', buttons: [] }
    case 'contactBlock':
      return { ...base, title: '', offices: [{ name: 'Ofis', address: 'Adres' }] }
    case 'careerForm':
      return { ...base, title: '', description: '', departments: [] }
    case 'contactForm':
      return { ...base, title: '', subjects: [] }
    case 'newsGrid':
      return { ...base, eyebrow: 'Haber Bülteni', title: 'Başlık', description: '', items: [{ title: 'Haber', category: '', excerpt: '', href: '' }] }
    case 'worldReach':
      return { ...base, eyebrow: 'Küresel Erişim', title: 'Başlık', description: '', stats: [], highlightPoints: [] }
    default:
      return base
  }
}

/* ===========================================================
   Kaydetmeden önce medya/ilişki id'ye indir
=========================================================== */
export function normalizeBlockForSave(b: any): any {
  const nb: any = { ...b }
  if ('video' in nb) nb.video = fromMedia(nb.video)
  if ('poster' in nb) nb.poster = fromMedia(nb.poster)
  if ('image' in nb) nb.image = fromMedia(nb.image)
  if ('background' in nb) nb.background = fromMedia(nb.background)
  if (Array.isArray(nb.cards)) nb.cards = nb.cards.map((c: any) => ({ ...c, image: fromMedia(c.image) }))
  if (Array.isArray(nb.logos)) nb.logos = nb.logos.map((l: any) => ({ ...l, logo: fromMedia(l.logo) }))
  if (nb.blockType === 'newsGrid' && Array.isArray(nb.items))
    nb.items = nb.items.map((i: any) => ({ ...i, image: fromMedia(i.image) }))
  if (Array.isArray(nb.documents)) nb.documents = relIds(nb.documents)
  if (Array.isArray(nb.categories)) nb.categories = relIds(nb.categories)
  return nb
}

/* ===========================================================
   Blok gövde render
=========================================================== */
type Patch = (partial: Record<string, any>) => void

const HERO_VARIANTS = [
  { value: 'centered', label: 'Ortalı Overlay (Veskim)' },
  { value: 'sidePanel', label: 'Sağ Panel (Ergun)' },
  { value: 'leftAligned', label: 'Sol Hizalı' },
  { value: 'fullImage', label: 'Tam Ekran Görsel' },
]
const COLS = [
  { value: '2', label: '2 sütun' },
  { value: '3', label: '3 sütun' },
  { value: '4', label: '4 sütun' },
]

export function renderBlockBody(block: any, patch: Patch): React.ReactNode {
  const t = block.blockType

  switch (t) {
    case 'heroVideo':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <SelectField label="Görünüm Stili" value={block.variant} onChange={(v) => patch({ variant: v })} options={HERO_VARIANTS} />
            <TextField label="Üst Etiket" value={block.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
            <TextField label="Ana Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Vurgu Kelimesi" value={block.titleAccent} onChange={(v) => patch({ titleAccent: v })} hint="Başlığın renkli kısmı" />
          </div>
          <div style={{ marginTop: 16 }}>
            <TextAreaField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
            <ImageField label="Arkaplan Videosu" accept="video/*" value={toMedia(block.video)} onChange={(v) => patch({ video: v })} hint="MP4 önerilir" />
            <ImageField label="Yedek Görsel (Poster)" value={toMedia(block.poster)} onChange={(v) => patch({ poster: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Sertifika Rozetleri"
              items={block.certifications || []}
              onChange={(items) => patch({ certifications: items })}
              newItem={() => ({ name: '', description: '' })}
              rowLabel={(it: any) => it.name || 'Sertifika'}
              addLabel="Sertifika Ekle"
              renderRow={(it: any, upd) => (
                <div className="ae-grid ae-grid--2">
                  <TextField label="Ad" value={it.name} onChange={(v) => upd({ name: v })} />
                  <TextField label="Alt Etiket" value={it.description} onChange={(v) => upd({ description: v })} />
                </div>
              )}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Butonlar"
              items={block.buttons || []}
              onChange={(items) => patch({ buttons: items })}
              newItem={() => ({ label: '', href: '', variant: 'primary' })}
              rowLabel={(it: any) => it.label || 'Buton'}
              addLabel="Buton Ekle"
              max={3}
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Yazı" value={it.label} onChange={(v) => upd({ label: v })} />
                    <TextField label="Link" value={it.href} onChange={(v) => upd({ href: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <SelectField label="Stil" value={it.variant} onChange={(v) => upd({ variant: v })} options={[{ value: 'primary', label: 'Birincil' }, { value: 'accent', label: 'Aksan' }, { value: 'ghost', label: 'Çerçeveli' }]} />
                  </div>
                </>
              )}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <ToggleField label="Aşağı kaydır okunu göster" checked={block.showScrollIndicator} onChange={(v) => patch({ showScrollIndicator: v })} />
          </div>
        </>
      )

    case 'splitTextImage':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <SelectField label="Görsel Pozisyonu" value={block.mediaSide} onChange={(v) => patch({ mediaSide: v })} options={[{ value: 'right', label: 'Sağda' }, { value: 'left', label: 'Solda' }]} />
            <TextField label="Üst Etiket" value={block.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <TextAreaField label="Açıklama Metni" rows={5} value={lexicalToText(block.body)} onChange={(v) => patch({ body: textToLexical(v) })} hint="Paragrafları boş satırla ayırın" />
          </div>
          <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
            <ImageField label="Görsel" value={toMedia(block.image)} onChange={(v) => patch({ image: v })} />
            <div>
              <TextField label="Görsel Altı Etiket" value={block.imageCaption} onChange={(v) => patch({ imageCaption: v })} />
              <div style={{ marginTop: 14 }}>
                <TextField label="Buton Yazısı" value={block.button?.label} onChange={(v) => patch({ button: { ...block.button, label: v } })} />
              </div>
              <div style={{ marginTop: 14 }}>
                <TextField label="Buton Linki" value={block.button?.href} onChange={(v) => patch({ button: { ...block.button, href: v } })} placeholder="/hakkimizda" />
              </div>
            </div>
          </div>
        </>
      )

    case 'statsGrid':
      return (
        <>
          <SelectField label="Arkaplan" value={block.variant} onChange={(v) => patch({ variant: v })} options={[{ value: 'dark', label: 'Koyu (Navy)' }, { value: 'light', label: 'Açık' }]} />
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="İstatistikler"
              items={block.items || []}
              onChange={(items) => patch({ items })}
              newItem={() => ({ value: '0', label: 'Etiket', description: '' })}
              rowLabel={(it: any) => it.label || 'İstatistik'}
              addLabel="İstatistik Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Değer" value={it.value} onChange={(v) => upd({ value: v })} placeholder="36" />
                    <TextField label="Etiket" value={it.label} onChange={(v) => upd({ label: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="Açıklama" rows={2} value={it.description} onChange={(v) => upd({ description: v })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'featureCards':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Üst Etiket" value={block.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          </div>
          <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
            <TextAreaField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
            <SelectField label="Sütun Sayısı" value={block.columns} onChange={(v) => patch({ columns: v })} options={COLS} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Kartlar"
              items={block.cards || []}
              onChange={(items) => patch({ cards: items })}
              newItem={() => ({ title: '', description: '', href: '', image: null })}
              rowLabel={(it: any) => it.title || 'Kart'}
              addLabel="Kart Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Başlık" value={it.title} onChange={(v) => upd({ title: v })} />
                    <TextField label="Link" value={it.href} onChange={(v) => upd({ href: v })} placeholder="/sektorler/kimya" />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="Açıklama" rows={2} value={it.description} onChange={(v) => upd({ description: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <ImageField label="Kart Görseli" value={toMedia(it.image)} onChange={(v) => upd({ image: v as any })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'partnerMarquee':
      return (
        <>
          <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Logolar"
              items={block.logos || []}
              onChange={(items) => patch({ logos: items })}
              newItem={() => ({ logo: null, name: '' })}
              rowLabel={(it: any) => it.name || 'Logo'}
              addLabel="Logo Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <TextField label="Şirket Adı" value={it.name} onChange={(v) => upd({ name: v })} />
                  <div style={{ marginTop: 12 }}>
                    <ImageField label="Logo" value={toMedia(it.logo)} onChange={(v) => upd({ logo: v as any })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'documentGrid':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RelationshipMultiField label="Belgeler" relationTo="documents" value={block.documents || []} onChange={(ids) => patch({ documents: ids })} hint="Belgeler & Sertifikalar koleksiyonundan seçin" />
          </div>
        </>
      )

    case 'accordion':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Akordeon Öğeleri"
              items={block.items || []}
              onChange={(items) => patch({ items })}
              newItem={() => ({ title: 'Başlık', body: textToLexical('') })}
              rowLabel={(it: any) => it.title || 'Öğe'}
              addLabel="Öğe Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <TextField label="Öğe Başlığı" value={it.title} onChange={(v) => upd({ title: v })} />
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="İçerik" value={lexicalToText(it.body)} onChange={(v) => upd({ body: textToLexical(v) })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'quoteBand':
      return (
        <>
          <TextAreaField label="Alıntı Metni" value={block.quote} onChange={(v) => patch({ quote: v })} />
          <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
            <TextField label="Söyleyen / Kaynak" value={block.author} onChange={(v) => patch({ author: v })} />
            <ImageField label="Arkaplan Görseli" value={toMedia(block.background)} onChange={(v) => patch({ background: v })} />
          </div>
        </>
      )

    case 'richText':
      return (
        <TextAreaField label="İçerik" rows={8} value={lexicalToText(block.content)} onChange={(v) => patch({ content: textToLexical(v) })} hint="Paragrafları boş satırla ayırın" />
      )

    case 'productAccordion':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RelationshipMultiField label="Kategoriler" relationTo="productCategories" value={block.categories || []} onChange={(ids) => patch({ categories: ids })} hint="Ürün Kategorileri koleksiyonundan seçin" />
          </div>
        </>
      )

    case 'policyNav':
      return (
        <RepeaterField
          label="Bağlantılar"
          items={block.links || []}
          onChange={(items) => patch({ links: items })}
          newItem={() => ({ label: '', href: '' })}
          rowLabel={(it: any) => it.label || 'Bağlantı'}
          addLabel="Bağlantı Ekle"
          renderRow={(it: any, upd) => (
            <div className="ae-grid ae-grid--2">
              <TextField label="Etiket" value={it.label} onChange={(v) => upd({ label: v })} />
              <TextField label="URL" value={it.href} onChange={(v) => upd({ href: v })} />
            </div>
          )}
        />
      )

    case 'policyTabs':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Üst Etiket" value={block.sectionEyebrow} onChange={(v) => patch({ sectionEyebrow: v })} />
            <TextField label="Bölüm Başlığı" value={block.sectionTitle} onChange={(v) => patch({ sectionTitle: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Tab'lar"
              items={block.tabs || []}
              onChange={(items) => patch({ tabs: items })}
              newItem={() => ({ title: 'Tab', body: textToLexical(''), detailHref: '' })}
              rowLabel={(it: any) => it.title || 'Tab'}
              addLabel="Tab Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Tab Başlığı" value={it.title} onChange={(v) => upd({ title: v })} />
                    <TextField label="Detay Linki" value={it.detailHref} onChange={(v) => upd({ detailHref: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="Politika İçeriği" value={lexicalToText(it.body)} onChange={(v) => upd({ body: textToLexical(v) })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'timeline':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Kilometre Taşları"
              items={block.milestones || []}
              onChange={(items) => patch({ milestones: items })}
              newItem={() => ({ year: '', title: '', description: '' })}
              rowLabel={(it: any) => it.year || 'Yıl'}
              addLabel="Dönem Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Yıl" value={it.year} onChange={(v) => upd({ year: v })} />
                    <TextField label="Başlık" value={it.title} onChange={(v) => upd({ title: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="Açıklama" rows={2} value={it.description} onChange={(v) => upd({ description: v })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'officeGrid':
    case 'contactBlock':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            {t === 'officeGrid' && (
              <SelectField label="Sütun Sayısı" value={block.columns} onChange={(v) => patch({ columns: v })} options={COLS} />
            )}
          </div>
          {t === 'officeGrid' && (
            <div style={{ marginTop: 16 }}>
              <TextAreaField label="Açıklama" rows={2} value={block.description} onChange={(v) => patch({ description: v })} />
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Ofisler"
              items={block.offices || []}
              onChange={(items) => patch({ offices: items })}
              newItem={() => ({ name: '', address: '', phone: '', email: '' })}
              rowLabel={(it: any) => it.name || 'Ofis'}
              addLabel="Ofis Ekle"
              renderRow={(it: any, upd) => (
                <>
                  <TextField label="Ofis Adı" value={it.name} onChange={(v) => upd({ name: v })} />
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="Adres" rows={2} value={it.address} onChange={(v) => upd({ address: v })} />
                  </div>
                  <div className="ae-grid ae-grid--2" style={{ marginTop: 12 }}>
                    <TextField label="Telefon" value={it.phone} onChange={(v) => upd({ phone: v })} />
                    <TextField label="E-posta" value={it.email} onChange={(v) => upd({ email: v })} />
                  </div>
                  {t === 'contactBlock' && (
                    <div style={{ marginTop: 12 }}>
                      <TextAreaField label="Google Maps iframe src URL" rows={2} value={it.mapEmbed} onChange={(v) => upd({ mapEmbed: v })} />
                    </div>
                  )}
                </>
              )}
            />
          </div>
        </>
      )

    case 'ctaBand':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Üst Etiket" value={block.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          </div>
          <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
            <TextAreaField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
            <SelectField label="Arkaplan" value={block.variant} onChange={(v) => patch({ variant: v })} options={[{ value: 'dark', label: 'Koyu (Navy)' }, { value: 'light', label: 'Açık' }]} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Butonlar"
              items={block.buttons || []}
              onChange={(items) => patch({ buttons: items })}
              newItem={() => ({ label: '', href: '', variant: 'gold' })}
              rowLabel={(it: any) => it.label || 'Buton'}
              addLabel="Buton Ekle"
              max={2}
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Yazı" value={it.label} onChange={(v) => upd({ label: v })} />
                    <TextField label="Link" value={it.href} onChange={(v) => upd({ href: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <SelectField label="Stil" value={it.variant} onChange={(v) => upd({ variant: v })} options={[{ value: 'gold', label: 'Aksan (Renkli)' }, { value: 'ghost', label: 'Çerçeveli' }]} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'careerForm':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
            <TextField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Departman Seçenekleri"
              items={block.departments || []}
              onChange={(items) => patch({ departments: items })}
              newItem={() => ({ name: '' })}
              rowLabel={(it: any) => it.name || 'Departman'}
              addLabel="Departman Ekle"
              renderRow={(it: any, upd) => (
                <TextField label="Departman Adı" value={it.name} onChange={(v) => upd({ name: v })} />
              )}
            />
          </div>
        </>
      )

    case 'contactForm':
      return (
        <>
          <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Konu Seçenekleri"
              items={block.subjects || []}
              onChange={(items) => patch({ subjects: items })}
              newItem={() => ({ name: '' })}
              rowLabel={(it: any) => it.name || 'Konu'}
              addLabel="Konu Ekle"
              renderRow={(it: any, upd) => (
                <TextField label="Konu Adı" value={it.name} onChange={(v) => upd({ name: v })} />
              )}
            />
          </div>
        </>
      )

    case 'newsGrid':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Üst Etiket" value={block.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <TextAreaField label="Açıklama" rows={2} value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Haberler"
              items={block.items || []}
              onChange={(items) => patch({ items })}
              newItem={() => ({ title: 'Haber', category: '', excerpt: '', href: '', image: null })}
              rowLabel={(it: any) => it.title || 'Haber'}
              addLabel="Haber Ekle"
              max={8}
              renderRow={(it: any, upd) => (
                <>
                  <div className="ae-grid ae-grid--2">
                    <TextField label="Haber Başlığı" value={it.title} onChange={(v) => upd({ title: v })} />
                    <TextField label="Kategori" value={it.category} onChange={(v) => upd({ category: v })} />
                  </div>
                  <div className="ae-grid ae-grid--2" style={{ marginTop: 12 }}>
                    <TextField label="Tarih (GG.AA.YYYY)" value={it.date ? String(it.date).slice(0, 10) : ''} onChange={(v) => upd({ date: v })} placeholder="2026-01-31" />
                    <TextField label="Devamı linki" value={it.href} onChange={(v) => upd({ href: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <TextAreaField label="Özet" rows={2} value={it.excerpt} onChange={(v) => upd({ excerpt: v })} />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <ImageField label="Haber Görseli" value={toMedia(it.image)} onChange={(v) => upd({ image: v as any })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    case 'worldReach':
      return (
        <>
          <div className="ae-grid ae-grid--2">
            <TextField label="Üst Etiket" value={block.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
            <TextField label="Başlık" value={block.title} onChange={(v) => patch({ title: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <TextAreaField label="Açıklama" value={block.description} onChange={(v) => patch({ description: v })} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Alt İstatistikler"
              items={block.stats || []}
              onChange={(items) => patch({ stats: items })}
              newItem={() => ({ value: '', label: '' })}
              rowLabel={(it: any) => it.label || 'İstatistik'}
              addLabel="İstatistik Ekle"
              max={4}
              renderRow={(it: any, upd) => (
                <div className="ae-grid ae-grid--2">
                  <TextField label="Değer" value={it.value} onChange={(v) => upd({ value: v })} />
                  <TextField label="Etiket" value={it.label} onChange={(v) => upd({ label: v })} />
                </div>
              )}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <RepeaterField
              label="Harita Vurgu Noktaları"
              items={block.highlightPoints || []}
              onChange={(items) => patch({ highlightPoints: items })}
              newItem={() => ({ name: '', xPercent: 50, yPercent: 50 })}
              rowLabel={(it: any) => it.name || 'Nokta'}
              addLabel="Nokta Ekle"
              max={12}
              renderRow={(it: any, upd) => (
                <>
                  <TextField label="Bölge Adı" value={it.name} onChange={(v) => upd({ name: v })} />
                  <div className="ae-grid ae-grid--2" style={{ marginTop: 12 }}>
                    <NumberField label="X % (soldan)" value={it.xPercent} onChange={(v) => upd({ xPercent: v })} />
                    <NumberField label="Y % (üstten)" value={it.yPercent} onChange={(v) => upd({ yPercent: v })} />
                  </div>
                </>
              )}
            />
          </div>
        </>
      )

    default:
      return <p className="ae-hint">Bu blok tipi ({t}) için özel editör yok.</p>
  }
}
