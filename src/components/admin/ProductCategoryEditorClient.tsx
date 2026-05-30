'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  SelectField,
  NumberField,
  ColorField,
  RepeaterField,
  SaveBar,
  type MediaValue,
} from './fields'
import { toMedia } from './blocks/blockSections'

export default function ProductCategoryEditorClient({
  catId,
  initial,
}: {
  catId: string | number | null
  initial: any
}) {
  const isNew = !catId
  const [d, setD] = useState<any>({
    name: initial.name || '',
    slug: initial.slug || '',
    tagline: initial.tagline || '',
    description: initial.description || '',
    accent: initial.accent || '#3B82F6',
    designVariant: initial.designVariant || 'accordion',
    icon: initial.icon || '',
    sortOrder: initial.sortOrder ?? 0,
    subGroups: initial.subGroups || [],
    cta: initial.cta || { quoteHref: '/iletisim', msdsHref: '/iletisim' },
  })
  const [image, setImage] = useState<MediaValue>(toMedia(initial.image))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; message?: string }>({ type: 'idle' })

  const set = (patch: Record<string, any>) => setD((p: any) => ({ ...p, ...patch }))

  const totalProducts = (d.subGroups || []).reduce((s: number, g: any) => s + ((g.products || []).length), 0)

  const save = async () => {
    setSaving(true)
    setStatus({ type: 'idle' })
    try {
      const body = { ...d, image: image?.id ?? null }
      const url = isNew ? '/api/productCategories' : `/api/productCategories/${catId}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`Kaydedilemedi (${res.status}) ${t.slice(0, 160)}`)
      }
      const data = await res.json()
      setStatus({ type: 'ok', message: 'Kaydedildi! Site ~1 dk içinde güncellenir.' })
      if (isNew && data?.doc?.id) window.location.href = `/admin/collections/productCategories/${data.doc.id}`
    } catch (e: any) {
      setStatus({ type: 'err', message: e?.message || 'Bir hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ae-wrap">
      <div className="ae-pagehead">
        <div>
          <h1>{isNew ? 'Yeni Kategori' : d.name || 'Kategori Düzenle'}</h1>
          <p>{totalProducts} ürün · Kategori bilgileri ve ürün listesini düzenleyin.</p>
        </div>
        {!isNew && (
          <Link href={`/urunler/${d.slug}`} target="_blank" className="ae-btn">
            <ExternalLink size={15} /> Önizle
          </Link>
        )}
      </div>

      <SectionCard title="Kategori Bilgileri" desc="Ad, adres, görsel ve sayfa tasarımı.">
        <div className="ae-grid ae-grid--2">
          <TextField label="Kategori Adı" value={d.name} onChange={(v) => set({ name: v })} />
          <TextField label="URL slug" value={d.slug} onChange={(v) => set({ slug: v })} hint="/urunler/[slug]" />
        </div>
        <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
          <TextField label="Üst Etiket / Slogan" value={d.tagline} onChange={(v) => set({ tagline: v })} />
          <TextField label="Lucide ikon adı" value={d.icon} onChange={(v) => set({ icon: v })} hint="ör. Beaker" />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextAreaField label="Açıklama" value={d.description} onChange={(v) => set({ description: v })} />
        </div>
        <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
          <ImageField label="Kategori Görseli (hero)" value={image} onChange={setImage} />
          <div>
            <ColorField label="Aksan Rengi" value={d.accent} onChange={(v) => set({ accent: v })} />
            <div style={{ marginTop: 14 }}>
              <SelectField
                label="Sayfa Tasarımı"
                value={d.designVariant}
                onChange={(v) => set({ designVariant: v })}
                options={[
                  { value: 'accordion', label: 'Akordeon (aç-kapa)' },
                  { value: 'grid', label: 'Kart Grid' },
                  { value: 'columns', label: 'Sütunlar' },
                  { value: 'table', label: 'Tablo' },
                ]}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <NumberField label="Sıra No" value={d.sortOrder} onChange={(v) => set({ sortOrder: v ?? 0 })} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Ürün Grupları" desc="Alt gruplar ve içlerindeki ürünler.">
        <RepeaterField
          items={d.subGroups || []}
          onChange={(items) => set({ subGroups: items })}
          newItem={() => ({ title: 'Yeni Grup', products: [] })}
          rowLabel={(it: any) => `${it.title || 'Grup'} (${(it.products || []).length} ürün)`}
          addLabel="Alt Grup Ekle"
          renderRow={(it: any, upd) => (
            <>
              <TextField label="Grup Başlığı" value={it.title} onChange={(v) => upd({ title: v })} />
              <div style={{ marginTop: 12 }}>
                <RepeaterField
                  label="Ürünler"
                  items={it.products || []}
                  onChange={(prods) => upd({ products: prods })}
                  newItem={() => ({ name: '' })}
                  rowLabel={(p: any) => p.name || 'Ürün'}
                  addLabel="Ürün Ekle"
                  renderRow={(p: any, pupd) => (
                    <TextField label="Ürün Adı" value={p.name} onChange={(v) => pupd({ name: v })} />
                  )}
                />
              </div>
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="Eylem Butonları" desc="Sayfa altındaki CTA bağlantıları.">
        <div className="ae-grid ae-grid--2">
          <TextField label="Teklif Al linki" value={d.cta?.quoteHref} onChange={(v) => set({ cta: { ...d.cta, quoteHref: v } })} />
          <TextField label="MSDS talep linki" value={d.cta?.msdsHref} onChange={(v) => set({ cta: { ...d.cta, msdsHref: v } })} />
        </div>
      </SectionCard>

      <SaveBar onSave={save} saving={saving} status={status} />
    </div>
  )
}
