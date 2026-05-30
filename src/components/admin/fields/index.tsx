'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ImagePlus, Trash2, UploadCloud, Plus, X } from 'lucide-react'

/* ----------------------------------------------------------------
   SectionCard — numaralı başlık + açıklama + içerik kabı
------------------------------------------------------------------- */
export function SectionCard({
  num,
  title,
  desc,
  children,
}: {
  num?: number | string
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <section className="ae-card">
      <div className="ae-card__head">
        {num != null && <span className="ae-card__num">{num}</span>}
        <div>
          <h3 className="ae-card__title">{title}</h3>
          {desc && <p className="ae-card__desc">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

/* ----------------------------------------------------------------
   TextField
------------------------------------------------------------------- */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="ae-field">
      <label>{label}</label>
      <input
        className="ae-input"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <span className="ae-hint">{hint}</span>}
    </div>
  )
}

/* ----------------------------------------------------------------
   TextAreaField
------------------------------------------------------------------- */
export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  rows?: number
}) {
  return (
    <div className="ae-field">
      <label>{label}</label>
      <textarea
        className="ae-textarea"
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <span className="ae-hint">{hint}</span>}
    </div>
  )
}

/* ----------------------------------------------------------------
   SelectField
------------------------------------------------------------------- */
export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  hint?: string
}) {
  return (
    <div className="ae-field">
      <label>{label}</label>
      <select className="ae-input ae-select" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="ae-hint">{hint}</span>}
    </div>
  )
}

/* ----------------------------------------------------------------
   NumberField
------------------------------------------------------------------- */
export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string
  value: number | string | undefined
  onChange: (v: number | undefined) => void
  placeholder?: string
  hint?: string
}) {
  return (
    <div className="ae-field">
      <label>{label}</label>
      <input
        className="ae-input"
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        placeholder={placeholder}
      />
      {hint && <span className="ae-hint">{hint}</span>}
    </div>
  )
}

/* ----------------------------------------------------------------
   ColorField
------------------------------------------------------------------- */
export function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <div className="ae-field">
      <label>{label}</label>
      <div className="ae-color">
        <input
          type="color"
          className="ae-color__swatch"
          value={value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#3B82F6'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="ae-input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#3B82F6"
        />
      </div>
      {hint && <span className="ae-hint">{hint}</span>}
    </div>
  )
}

/* ----------------------------------------------------------------
   RelationshipMultiField — ilişki çoklu seçim (checkbox listesi)
   value: array of id | { id }
------------------------------------------------------------------- */
export function RelationshipMultiField({
  label,
  relationTo,
  value,
  onChange,
  hint,
}: {
  label: string
  relationTo: string
  value: any[]
  onChange: (ids: (string | number)[]) => void
  hint?: string
}) {
  const [opts, setOpts] = useState<{ id: string | number; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    fetch(`/api/${relationTo}?limit=100&depth=0`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        setOpts((d.docs || []).map((x: any) => ({ id: x.id, label: x.name || x.title || String(x.id) })))
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [relationTo])

  const ids = (value || []).map((v) => (v && typeof v === 'object' ? v.id : v))
  const toggle = (id: string | number) =>
    onChange(ids.includes(id) ? ids.filter((i: any) => i !== id) : [...ids, id])

  return (
    <div className="ae-field">
      <label>{label}</label>
      <div className="ae-rel">
        {loading && <span className="ae-hint">Yükleniyor…</span>}
        {!loading && opts.length === 0 && <span className="ae-hint">Seçenek bulunamadı.</span>}
        {opts.map((o) => (
          <label className="ae-rel__item" key={o.id}>
            <input type="checkbox" checked={ids.includes(o.id)} onChange={() => toggle(o.id)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {hint && <span className="ae-hint">{hint}</span>}
    </div>
  )
}

/* ----------------------------------------------------------------
   ToggleField
------------------------------------------------------------------- */
export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="ae-toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ae-toggle__track" />
      <span className="ae-toggle__label">{label}</span>
    </label>
  )
}

/* ----------------------------------------------------------------
   ImageField — önizleme + yükle (POST /api/media) + kaldır
   value: { id, url } | null
------------------------------------------------------------------- */
export type MediaValue = { id: string | number; url?: string; alt?: string } | null

export function ImageField({
  label,
  value,
  onChange,
  hint,
  accept = 'image/*',
}: {
  label: string
  value: MediaValue
  onChange: (v: MediaValue) => void
  hint?: string
  accept?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const upload = async (file: File) => {
    setBusy(true)
    setErr(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', file.name)
      const res = await fetch('/api/media', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Yükleme başarısız (' + res.status + ')')
      const data = await res.json()
      const doc = data?.doc || data
      onChange({ id: doc.id, url: doc.url, alt: doc.alt })
    } catch (e: any) {
      setErr(e?.message || 'Yükleme hatası')
    } finally {
      setBusy(false)
    }
  }

  const isVideo = accept.includes('video')

  return (
    <div className="ae-field">
      <label>{label}</label>
      <div className="ae-image">
        <div className="ae-image__preview">
          {value?.url ? (
            isVideo ? (
              <video src={value.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.url} alt={value.alt || ''} />
            )
          ) : (
            <span className="ae-image__empty">
              <ImagePlus size={26} style={{ opacity: 0.4, display: 'block', margin: '0 auto 6px' }} />
              Henüz görsel yok
            </span>
          )}
        </div>
        <div className="ae-image__actions">
          <button
            type="button"
            className="ae-btn"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud size={15} />
            {busy ? 'Yükleniyor…' : value?.url ? 'Değiştir' : 'Yükle'}
          </button>
          {value?.url && (
            <button type="button" className="ae-btn ae-btn--danger" onClick={() => onChange(null)}>
              <Trash2 size={15} />
              Kaldır
            </button>
          )}
        </div>
        {err && <span className="ae-hint" style={{ color: '#DC2626' }}>{err}</span>}
        {hint && !err && <span className="ae-hint">{hint}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) upload(f)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   RepeaterField — dizi alanlar (ekle/sil satırlar)
------------------------------------------------------------------- */
export function RepeaterField<T>({
  label,
  items,
  onChange,
  renderRow,
  newItem,
  rowLabel,
  addLabel = 'Satır Ekle',
  max,
}: {
  label?: string
  items: T[]
  onChange: (items: T[]) => void
  renderRow: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode
  newItem: () => T
  rowLabel?: (item: T, index: number) => string
  addLabel?: string
  max?: number
}) {
  const update = (i: number, patch: Partial<T>) => {
    const next = items.slice()
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, newItem()])

  return (
    <div className="ae-field">
      {label && <label>{label}</label>}
      <div className="ae-rep">
        {items.map((item, i) => (
          <div className="ae-rep__row" key={i}>
            <div className="ae-rep__row-head">
              <span className="ae-rep__row-title">{rowLabel ? rowLabel(item, i) : `Satır ${i + 1}`}</span>
              <button
                type="button"
                className="ae-btn ae-btn--danger"
                style={{ padding: '6px 10px' }}
                onClick={() => remove(i)}
              >
                <X size={14} />
              </button>
            </div>
            {renderRow(item, (patch) => update(i, patch), i)}
          </div>
        ))}
        {(max == null || items.length < max) && (
          <button type="button" className="ae-btn" onClick={add}>
            <Plus size={15} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   SaveBar — sticky alt çubuk
------------------------------------------------------------------- */
export function SaveBar({
  onSave,
  saving,
  status,
}: {
  onSave: () => void
  saving: boolean
  status?: { type: 'idle' | 'ok' | 'err'; message?: string }
}) {
  return (
    <div className="ae-savebar">
      <span
        className={
          'ae-savebar__status' +
          (status?.type === 'ok' ? ' is-ok' : status?.type === 'err' ? ' is-err' : '')
        }
      >
        {status?.message || 'Değişiklikleri yaptıktan sonra kaydedin.'}
      </span>
      <button type="button" className="ae-save-lg" onClick={onSave} disabled={saving}>
        <UploadCloud size={17} />
        {saving ? 'Kaydediliyor…' : 'Tüm Değişiklikleri Kaydet'}
      </button>
    </div>
  )
}
