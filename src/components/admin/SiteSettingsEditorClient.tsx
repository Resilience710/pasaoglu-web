'use client'

import React, { useState } from 'react'
import {
  SectionCard,
  TextField,
  TextAreaField,
  ImageField,
  SelectField,
  RepeaterField,
  SaveBar,
  type MediaValue,
} from './fields'
import { toMedia } from './blocks/blockSections'

export default function SiteSettingsEditorClient({ initial }: { initial: any }) {
  const [d, setD] = useState<any>({
    tagline: initial.tagline || '',
    phone: initial.phone || '',
    email: initial.email || '',
    addresses: initial.addresses || [],
    social: initial.social || [],
    footer: initial.footer || { description: '', columns: [], copyright: '' },
    seo: initial.seo || {},
  })
  const [logo, setLogo] = useState<MediaValue>(toMedia(initial.logo))
  const [logoDark, setLogoDark] = useState<MediaValue>(toMedia(initial.logoDark))
  const [ogImage, setOgImage] = useState<MediaValue>(toMedia(initial.seo?.defaultOgImage))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'ok' | 'err'; message?: string }>({ type: 'idle' })

  const set = (patch: Record<string, any>) => setD((p: any) => ({ ...p, ...patch }))
  const setFooter = (patch: Record<string, any>) => setD((p: any) => ({ ...p, footer: { ...p.footer, ...patch } }))
  const setSeo = (patch: Record<string, any>) => setD((p: any) => ({ ...p, seo: { ...p.seo, ...patch } }))

  const save = async () => {
    setSaving(true)
    setStatus({ type: 'idle' })
    try {
      const body = {
        ...d,
        logo: logo?.id ?? null,
        logoDark: logoDark?.id ?? null,
        seo: { ...d.seo, defaultOgImage: ogImage?.id ?? null },
      }
      const res = await fetch('/api/globals/siteSettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
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
          <h1>Site Ayarları</h1>
          <p>Logo, iletişim, footer ve SEO ayarları — tüm sayfalarda görünür.</p>
        </div>
      </div>

      <SectionCard num={1} title="Marka & Üst Alan" desc="Logo ve topbar metni.">
        <div className="ae-grid ae-grid--2">
          <ImageField label="Logo" value={logo} onChange={setLogo} />
          <ImageField label="Logo (koyu arkaplan)" value={logoDark} onChange={setLogoDark} />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextField label="Topbar metni" value={d.tagline} onChange={(v) => set({ tagline: v })} />
        </div>
      </SectionCard>

      <SectionCard num={2} title="İletişim & Sosyal" desc="Telefon, e-posta, adresler ve sosyal medya.">
        <div className="ae-grid ae-grid--2">
          <TextField label="Telefon" value={d.phone} onChange={(v) => set({ phone: v })} />
          <TextField label="E-posta" value={d.email} onChange={(v) => set({ email: v })} />
        </div>
        <div style={{ marginTop: 16 }}>
          <RepeaterField
            label="Adresler"
            items={d.addresses || []}
            onChange={(items) => set({ addresses: items })}
            newItem={() => ({ name: '', address: '' })}
            rowLabel={(it: any) => it.name || 'Adres'}
            addLabel="Adres Ekle"
            renderRow={(it: any, upd) => (
              <>
                <TextField label="Ad" value={it.name} onChange={(v) => upd({ name: v })} />
                <div style={{ marginTop: 12 }}>
                  <TextAreaField label="Adres" rows={2} value={it.address} onChange={(v) => upd({ address: v })} />
                </div>
              </>
            )}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <RepeaterField
            label="Sosyal Medya"
            items={d.social || []}
            onChange={(items) => set({ social: items })}
            newItem={() => ({ platform: 'linkedin', url: '' })}
            rowLabel={(it: any) => it.platform || 'Sosyal'}
            addLabel="Hesap Ekle"
            renderRow={(it: any, upd) => (
              <div className="ae-grid ae-grid--2">
                <SelectField
                  label="Platform"
                  value={it.platform}
                  onChange={(v) => upd({ platform: v })}
                  options={['linkedin', 'instagram', 'facebook', 'youtube', 'x'].map((v) => ({ value: v, label: v }))}
                />
                <TextField label="URL" value={it.url} onChange={(v) => upd({ url: v })} />
              </div>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard num={3} title="Footer" desc="Alt bilgi açıklaması, kolonlar ve telif.">
        <TextAreaField label="Footer açıklaması" rows={2} value={d.footer?.description} onChange={(v) => setFooter({ description: v })} />
        <div style={{ marginTop: 16 }}>
          <RepeaterField
            label="Footer Kolonları"
            items={d.footer?.columns || []}
            onChange={(items) => setFooter({ columns: items })}
            newItem={() => ({ title: '', links: [] })}
            rowLabel={(it: any) => it.title || 'Kolon'}
            addLabel="Kolon Ekle"
            max={4}
            renderRow={(it: any, upd) => (
              <>
                <TextField label="Kolon Başlığı" value={it.title} onChange={(v) => upd({ title: v })} />
                <div style={{ marginTop: 12 }}>
                  <RepeaterField
                    label="Bağlantılar"
                    items={it.links || []}
                    onChange={(links) => upd({ links })}
                    newItem={() => ({ label: '', href: '' })}
                    rowLabel={(l: any) => l.label || 'Bağlantı'}
                    addLabel="Bağlantı Ekle"
                    renderRow={(l: any, lupd) => (
                      <div className="ae-grid ae-grid--2">
                        <TextField label="Etiket" value={l.label} onChange={(v) => lupd({ label: v })} />
                        <TextField label="URL" value={l.href} onChange={(v) => lupd({ href: v })} />
                      </div>
                    )}
                  />
                </div>
              </>
            )}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextField label="Telif metni (copyright)" value={d.footer?.copyright} onChange={(v) => setFooter({ copyright: v })} />
        </div>
      </SectionCard>

      <SectionCard num={4} title="SEO & Analytics" desc="Varsayılan meta ve analitik entegrasyonları.">
        <div className="ae-grid ae-grid--2">
          <TextField label="Site Adı" value={d.seo?.siteName} onChange={(v) => setSeo({ siteName: v })} />
          <TextField label="Başlık Şablonu" value={d.seo?.titleTemplate} onChange={(v) => setSeo({ titleTemplate: v })} hint="%s sayfanın başlığıyla değişir" />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextAreaField label="Varsayılan Açıklama" rows={2} value={d.seo?.defaultDescription} onChange={(v) => setSeo({ defaultDescription: v })} />
        </div>
        <div className="ae-grid ae-grid--2" style={{ marginTop: 16 }}>
          <ImageField label="Varsayılan Paylaşım Görseli" value={ogImage} onChange={setOgImage} />
          <div>
            <TextField label="Twitter / X kullanıcı adı" value={d.seo?.twitterHandle} onChange={(v) => setSeo({ twitterHandle: v })} />
            <div style={{ marginTop: 14 }}>
              <TextField label="Google Analytics ID" value={d.seo?.googleAnalyticsId} onChange={(v) => setSeo({ googleAnalyticsId: v })} placeholder="G-XXXXXXXXXX" />
            </div>
            <div style={{ marginTop: 14 }}>
              <TextField label="Google Doğrulama Kodu" value={d.seo?.googleSiteVerification} onChange={(v) => setSeo({ googleSiteVerification: v })} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <TextField label="Kurumsal Yasal Ad (Schema.org)" value={d.seo?.organizationLegalName} onChange={(v) => setSeo({ organizationLegalName: v })} />
        </div>
      </SectionCard>

      <SaveBar onSave={save} saving={saving} status={status} />
    </div>
  )
}
