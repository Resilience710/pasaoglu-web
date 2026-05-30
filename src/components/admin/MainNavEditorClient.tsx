'use client'

import React, { useState } from 'react'
import { SectionCard, TextField, RepeaterField, SaveBar } from './fields'

export default function MainNavEditorClient({ initial }: { initial: any }) {
  const [items, setItems] = useState<any[]>(initial.items || [])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; message?: string }>({ type: 'idle' })

  const save = async () => {
    setSaving(true)
    setStatus({ type: 'idle' })
    try {
      const res = await fetch('/api/globals/mainNav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(`Kaydedilemedi (${res.status}) ${t.slice(0, 160)}`)
      }
      setStatus({ type: 'ok', message: 'Kaydedildi! Site ~1 dk içinde güncellenir.' })
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
          <h1>Üst Menü</h1>
          <p>Header navigasyon öğeleri ve alt menüleri.</p>
        </div>
      </div>

      <SectionCard title="Menü Öğeleri" desc="Sırayı yönetin; her öğeye alt menü ekleyebilirsiniz.">
        <RepeaterField
          items={items}
          onChange={setItems}
          newItem={() => ({ label: '', href: '', children: [] })}
          rowLabel={(it: any) => it.label || 'Menü öğesi'}
          addLabel="Menü Öğesi Ekle"
          renderRow={(it: any, upd) => (
            <>
              <div className="ae-grid ae-grid--2">
                <TextField label="Etiket" value={it.label} onChange={(v) => upd({ label: v })} />
                <TextField label="Link" value={it.href} onChange={(v) => upd({ href: v })} placeholder="/hakkimizda" />
              </div>
              <div style={{ marginTop: 12 }}>
                <RepeaterField
                  label="Alt Menü"
                  items={it.children || []}
                  onChange={(children) => upd({ children })}
                  newItem={() => ({ label: '', href: '' })}
                  rowLabel={(c: any) => c.label || 'Alt öğe'}
                  addLabel="Alt Öğe Ekle"
                  renderRow={(c: any, cupd) => (
                    <div className="ae-grid ae-grid--2">
                      <TextField label="Etiket" value={c.label} onChange={(v) => cupd({ label: v })} />
                      <TextField label="Link" value={c.href} onChange={(v) => cupd({ href: v })} />
                    </div>
                  )}
                />
              </div>
            </>
          )}
        />
      </SectionCard>

      <SaveBar onSave={save} saving={saving} status={status} />
    </div>
  )
}
