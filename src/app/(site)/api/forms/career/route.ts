import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: Request) {
  try {
    const fd = await req.formData()
    const fullName = String(fd.get('fullName') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const department = String(fd.get('department') || '').trim()
    if (!fullName || !email || !department) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçersiz e-posta.' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    let cvId: number | string | undefined

    const cvFile = fd.get('cv')
    if (cvFile && cvFile instanceof File && cvFile.size > 0) {
      if (cvFile.size > MAX_SIZE) {
        return NextResponse.json({ error: 'CV dosyası 5MB sınırını aşıyor.' }, { status: 400 })
      }
      if (!ALLOWED_TYPES.includes(cvFile.type)) {
        return NextResponse.json({ error: 'Sadece PDF, DOC, DOCX kabul edilir.' }, { status: 400 })
      }
      const buf = Buffer.from(await cvFile.arrayBuffer())
      const created = await payload.create({
        collection: 'media',
        data: { alt: `CV — ${fullName}` },
        file: {
          data: buf,
          mimetype: cvFile.type,
          name: cvFile.name,
          size: cvFile.size,
        },
      })
      cvId = (created as any).id
    }

    await payload.create({
      collection: 'careerApplications',
      data: {
        fullName,
        email,
        phone: String(fd.get('phone') || '').slice(0, 60) || undefined,
        department,
        coverLetter: String(fd.get('coverLetter') || '').slice(0, 5000) || undefined,
        cv: cvId,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Sunucu hatası' }, { status: 500 })
  }
}
