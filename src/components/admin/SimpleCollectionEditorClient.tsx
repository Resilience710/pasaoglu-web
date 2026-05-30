'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import {
  SectionCard,
  TextField,
  TextAreaField,
  ToggleField,
  SelectField,
  ImageField,
  SaveBar,
  type MediaValue,
} from './fields'
import { toMedia, lexicalToText, textToLexical } from './blocks/blockSections'

type FieldDef = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'toggle' | 'image' | 'richtext'
  options?: { value: string; label: string }[]
  accept?: string
  hint?: string
  placeholder?: string
}

const SCHEMAS: Record<string, { uploadFields: string[]; fields: FieldDef[] }> = {
  documents: {
    uploadFields: ['cover', 'file'],
    fields: [
      { name: 'title', label: 'Başlık', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'text', placeholder: 'Sertifika, Politika…' },
      { name: 'description', label: 'Açıklama', type: 'textarea' },
      { name: 'cover', label: 'Kapak görseli', type: 'image' },
      { name: 'file', label: 'PDF dosyası', type: 'image', accept: 'application/pdf', hint: 'PDF yükleyin (zorunlu)' },
    ],
  },
  jobOpenings: {
    uploadFields: [],
    fields: [
      { name: 'title', label: 'İlan Başlığı', type: 'text' },
      { name: 'department', label: 'Departman', type: 'text' },
      { name: 'location', label: 'Lokasyon', type: 'text' },
      { name: 'description', label: 'Açıklama', type: 'richtext' },
      { name: 'active', label: 'Aktif (kariyer sayfasında göster)', type: 'toggle' },
    ],
  },
  newsArticles: {
    uploadFields: ['image'],
    fields: [
      { name: 'title', label: 'Haber Başlığı', type: 'text' },
      { name: 'slug', label: 'URL slug', type: 'text', hint: 'küçük harf, tire ile' },
      { name: 'image', label: 'Kapak Görseli', type: 'image' },
      { name: 'excerpt', label: 'Özet', type: 'textarea' },
      { name: 'body', label: 'Haber İçeriği', type: 'richtext' },
      { name: 'date', label: 'Yayın Tarihi', type: 'date' },
      {
        name: 'category', label: 'Kategori', type: 'select',
        options: [
          { value: 'kurumsal', label: 'Kurumsal' },
          { value: 'sektorel', label: 'Sektörel' },
          { value: 'surdurulebilirlik', label: 'Sürdürülebilirlik' },
          { value: 'ihracat', label: 'İhracat' },
          { value: 'kariyer', label: 'Kariyer' },
          { value: 'arge', label: 'Ar-Ge' },
          { value: 'etkinlik', label: 'Etkinlik' },
        ],
      },
      { name: 'featured', label: 'Öne Çıkan', type: 'toggle' },
    ],
  },
  users: {
    uploadFields: [],
    fields: [
      { name: 'name', label: 'Ad Soyad', type: 'text' },
      {
        name: 'role', label: 'Rol', type: 'select',
        options: [
          { value: 'admin', label: 'Yönetici' },
          { value: 'editor', label: 'Editör' },
        ],
      },
    ],
  },
}

const META: Record<string, { title: string; newTitle: string; previewBase?: string }> = {
  documents: { title: 'Belge / Sertifika', newTitle: 'Yeni Belge' },
  jobOpenings: { title: 'İş İlanı', newTitle: 'Yeni İlan' },
  newsArticles: { title: 'Haber', newTitle: 'Yeni Haber', previewBase: '/haberler/' },
  users: { title: 'Kullanıcı', newTitle: 'Yeni Kullanıcı' },
}

export default function SimpleCollectionEditorClient({
  collection,
  docId,
  initial,
}: {
  collection: string
  docId: string | number | null
  initial: any
}) {
  const schema = SCHEMAS[collection]
  const meta = META[collection] || { title: collection, newTitle: 'Yeni Kayıt' }
  const isNew = !docId

  const [d, setD] = useState<any>(() => {
    const base: any = { ...initial }
    schema.uploadFields.forEach((f) => (base[f] = toMedia(initial?.[f])))
    return base
  })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; message?: string }>({ type: 'idle' })

  const set = (name: string, value: any) => {
    setD((p: any) => ({ ...p, [name]: value }))
    setStatus({ type: 'idle' })
  }

  const save = async () => {
    setSaving(true)
    setStatus({ type: 'idle' })
    try {
      const body: any = {}
      schema.fields.forEach((f) => {
        const v = d[f.name]
        if (f.type === 'image') body[f.name] = (v as MediaValue)?.id ?? null
        else body[f.name] = v
      })
      const url = isNew ? `/api/${collection}` : `/api/${collection}/${docId}`
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
      setStatus({ type: 'ok', message: 'Kaydedildi!' })
      if (isNew && data?.doc?.id) window.location.href = `/admin/collections/${collection}/${data.doc.id}`
    } catch (e: any) {
      setStatus({ type: 'err', message: e?.message || 'Bir hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const previewHref = meta.previewBase && d.slug ? `${meta.previewBase}${d.slug}` : null

  return (
    <div className="ae-wrap">
      <div className="ae-pagehead">
        <div>
          <h1>{isNew ? meta.newTitle : d.title || d.name || d.email || meta.title}</h1>
          <p>Alanları düzenleyip kaydedin.</p>
        </div>
        {!isNew && previewHref && (
          <Link href={previewHref} target="_blank" className="ae-btn">
            <ExternalLink size={15} /> Önizle
          </Link>
        )}
      </div>

      <SectionCard title={meta.title} desc="">
        {schema.fields.map((f) => (
          <div key={f.name} style={{ marginBottom: 16 }}>
            {f.type === 'text' && <TextField label={f.label} value={d[f.name] ?? ''} onChange={(v) => set(f.name, v)} placeholder={f.placeholder} hint={f.hint} />}
            {f.type === 'textarea' && <TextAreaField label={f.label} value={d[f.name] ?? ''} onChange={(v) => set(f.name, v)} hint={f.hint} />}
            {f.type === 'date' && <TextField label={f.label} value={d[f.name] ? String(d[f.name]).slice(0, 10) : ''} onChange={(v) => set(f.name, v)} placeholder="2026-01-31" hint={f.hint} />}
            {f.type === 'select' && <SelectField label={f.label} value={d[f.name] ?? ''} onChange={(v) => set(f.name, v)} options={f.options || []} />}
            {f.type === 'toggle' && <ToggleField label={f.label} checked={!!d[f.name]} onChange={(v) => set(f.name, v)} />}
            {f.type === 'image' && <ImageField label={f.label} accept={f.accept} value={d[f.name] as MediaValue} onChange={(v) => set(f.name, v)} hint={f.hint} />}
            {f.type === 'richtext' && <TextAreaField label={f.label} rows={6} value={lexicalToText(d[f.name])} onChange={(v) => set(f.name, textToLexical(v))} hint="Paragrafları boş satırla ayırın" />}
          </div>
        ))}
      </SectionCard>

      {collection === 'users' && (
        <SectionCard title="Şifre & E-posta" desc="Güvenlik nedeniyle bu alanlar Payload'un hesap ekranından değiştirilir.">
          <Link href="/admin/account" className="ae-btn">
            <ExternalLink size={15} /> Hesap ekranını aç
          </Link>
        </SectionCard>
      )}

      <SaveBar onSave={save} saving={saving} status={status} />
    </div>
  )
}
