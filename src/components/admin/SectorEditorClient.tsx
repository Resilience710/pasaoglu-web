'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SectionCard, TextField, TextAreaField, ImageField, SelectField, SaveBar, type MediaValue } from './fields'
import SectionList from './blocks/SectionList'
import { normalizeBlockForSave, toMedia } from './blocks/blockSections'

export default function SectorEditorClient({
  sectorId,
  initial,
}: {
  sectorId: string | number | null
  initial: { name: string; slug: string; shortDescription: string; cardImage: any; theme: string; layout: any[] }
}) {
  const isNew = !sectorId
  const [name, setName] = useState(initial.name || '')
  const [slug, setSlug] = useState(initial.slug || '')
  const [shortDescription, setShortDescription] = useState(initial.shortDescription || '')
  const [cardImage, setCardImage] = useState<MediaValue>(toMedia(initial.cardImage))
  const [theme, setTheme] = useState(initial.theme || 'chem')
  const [layout, setLayout] = useState<any[]>(initial.layout || [])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; message?: string }>({ type: 'idle' })

  const save = async () => {
    setSaving(true)
    setStatus({ type: 'idle' })
    try {
      const body: any = {
        name,
        slug,
        shortDescription,
        cardImage: cardImage?.id ?? null,
        theme,
        layout: layout.map(normalizeBlockForSave),
      }
      const url = isNew ? '/api/sectors' : `/api/sectors/${sectorId}`
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
      if (isNew && data?.doc?.id) window.location.href = `/admin/collections/sectors/${data.doc.id}`
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
          <h1>{isNew ? 'Yeni Sektör' : name || 'Sektör Düzenle'}</h1>
          <p>Sektör bilgilerini ve sayfa bölümlerini düzenleyin; alttaki butonla kaydedin.</p>
        </div>
        {!isNew && (
          <Link href={`/sektorler/${slug}`} target="_blank" className="ae-btn">
            <ExternalLink size={15} /> Önizle
          </Link>
        )}
      </div>

      <SectionCard title="Sektör Bilgileri" desc="Temel bilgiler ve renk teması.">
        <div className="ae-grid ae-grid--2">
          <TextField label="Sektör Adı" value={name} onChange={setName} />
          <TextField label="URL slug" value={slug} onChange={setSlug} hint="kimya, yapi, gida — değiştirmeyin" />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextAreaField label="Kısa Açıklama" rows={2} value={shortDescription} onChange={setShortDescription} hint="Sektörler listesi kartında görünür" />
        </div>
        <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
          <ImageField label="Kart Görseli" value={cardImage} onChange={setCardImage} />
          <SelectField
            label="Renk Teması"
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'chem', label: 'Kimya — Mor' },
              { value: 'build', label: 'Yapı — Gri' },
              { value: 'food', label: 'Gıda — Yeşil' },
            ]}
          />
        </div>
      </SectionCard>

      <SectionList layout={layout} onChange={setLayout} />

      <SaveBar onSave={save} saving={saving} status={status} />
    </div>
  )
}
