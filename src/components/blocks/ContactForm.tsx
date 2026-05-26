'use client'

import { useState } from 'react'

export function ContactForm({ block }: { block: any }) {
  const subjects = (block.subjects || []).map((s: any) => s.name)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) { setStatus('sent'); return }
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Bir hata oluştu')
      setStatus('sent')
      e.currentTarget.reset()
    } catch (err: any) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <section className="py-20 bg-brand-cream">
      <div className="container-x max-w-2xl">
        {block.title && <h2 className="section-title mb-8 text-center">{block.title}</h2>}
        {status === 'sent' ? (
          <div className="bg-white p-10 rounded-2xl text-center card-shadow">
            <p className="text-brand-navy text-lg font-serif">Mesajınız iletildi.</p>
            <p className="text-brand-muted mt-2 text-sm">En kısa sürede size geri dönüş yapacağız.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl card-shadow space-y-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field name="name" label="Ad Soyad" required />
              <Field name="email" label="E-posta" type="email" required />
              <Field name="phone" label="Telefon" />
              <Field name="company" label="Firma" />
            </div>
            {subjects.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Konu</label>
                <select name="subject" className="mt-2 w-full border border-brand-line rounded-lg px-4 py-3 text-sm bg-white" required>
                  <option value="">Seçiniz...</option>
                  {subjects.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Mesaj</label>
              <textarea name="message" rows={5} className="mt-2 w-full border border-brand-line rounded-lg px-4 py-3 text-sm" required />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full">
              {status === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

function Field({ name, label, type = 'text', required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">{label}{required && ' *'}</label>
      <input name={name} type={type} required={required} className="mt-2 w-full border border-brand-line rounded-lg px-4 py-3 text-sm" />
    </div>
  )
}
