'use client'

import { useState } from 'react'

export function CareerForm({ block }: { block: any }) {
  const departments = (block.departments || []).map((d: any) => d.name)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const fd = new FormData(e.currentTarget)
    if (fd.get('website')) { setStatus('sent'); return }
    try {
      const res = await fetch('/api/forms/career', { method: 'POST', body: fd })
      if (!res.ok) throw new Error((await res.json()).error || 'Hata')
      setStatus('sent')
      e.currentTarget.reset()
    } catch (err: any) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <section className="py-20">
      <div className="container-x max-w-2xl">
        {block.title && <h2 className="section-title mb-3 text-center">{block.title}</h2>}
        {block.description && <p className="body-lead text-center mb-8">{block.description}</p>}
        {status === 'sent' ? (
          <div className="bg-brand-cream p-10 rounded-2xl text-center">
            <p className="text-brand-navy text-lg font-serif">Başvurunuz alındı.</p>
            <p className="text-brand-muted mt-2 text-sm">İK ekibimiz başvurunuzu değerlendirecektir.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl border border-brand-line" encType="multipart/form-data">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field name="fullName" label="Ad Soyad" required />
              <Field name="email" label="E-posta" type="email" required />
              <Field name="phone" label="Telefon" />
              {departments.length > 0 ? (
                <div>
                  <label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Departman *</label>
                  <select name="department" required className="mt-2 w-full border border-brand-line rounded-lg px-4 py-3 text-sm bg-white">
                    <option value="">Seçiniz...</option>
                    {departments.map((d: string) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              ) : <Field name="department" label="Departman" required />}
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Ön Yazı</label>
              <textarea name="coverLetter" rows={4} className="mt-2 w-full border border-brand-line rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-navy uppercase tracking-wider">CV (PDF/DOC, max 5MB)</label>
              <input type="file" name="cv" accept=".pdf,.doc,.docx" className="mt-2 w-full text-sm" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full">
              {status === 'sending' ? 'Gönderiliyor...' : 'Başvur'}
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
