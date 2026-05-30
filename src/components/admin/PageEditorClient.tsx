'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SectionCard, TextField, SaveBar } from './fields'
import SectionList from './blocks/SectionList'
import { normalizeBlockForSave } from './blocks/blockSections'

export default function PageEditorClient({
  pageId,
  initial,
}: {
  pageId: string | number | null
  initial: { title: string; slug: string; layout: any[] }
}) {
  const isNew = !pageId
  const [title, setTitle] = useState(initial.title || '')
  const [slug, setSlug] = useState(initial.slug || '')
  const [layout, setLayout] = useState<any[]>(initial.layout || [])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; message?: string }>({ type: 'idle' })

  const save = async () => {
    setSaving(true)
    setStatus({ type: 'idle' })
    try {
      const body = { title, slug, layout: layout.map(normalizeBlockForSave) }
      const url = isNew ? '/api/pages' : `/api/pages/${pageId}`
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
      if (isNew && data?.doc?.id) window.location.href = `/admin/collections/pages/${data.doc.id}`
    } catch (e: any) {
      setStatus({ type: 'err', message: e?.message || 'Bir hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const pageHref = slug === 'home' ? '/' : `/${slug}`

  return (
    <div className="ae-wrap">
      <div className="ae-pagehead">
        <div>
          <h1>{isNew ? 'Yeni Sayfa' : title || 'Sayfa Düzenle'}</h1>
          <p>Bölümleri düzenleyin, yeni bölüm ekleyin veya sıralayın; alttaki butonla kaydedin.</p>
        </div>
        {!isNew && (
          <Link href={pageHref} target="_blank" className="ae-btn">
            <ExternalLink size={15} /> Önizle
          </Link>
        )}
      </div>

      <SectionCard title="Temel Bilgiler" desc="Sayfanın adı ve adresi.">
        <div className="ae-grid ae-grid--2">
          <TextField label="Sayfa Adı" value={title} onChange={setTitle} />
          <TextField label="URL Yolu (slug)" value={slug} onChange={setSlug} hint='Ana sayfa için "home". Diğerleri "hakkimizda", "iletisim" gibi.' />
        </div>
      </SectionCard>

      <SectionList layout={layout} onChange={setLayout} />

      <SaveBar onSave={save} saving={saving} status={status} />
    </div>
  )
}
