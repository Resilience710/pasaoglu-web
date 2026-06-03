import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

const MAX_SIZE = 5 * 1024 * 1024

// Dosya içeriğini (magic bytes) doğrula — istemcinin bildirdiği MIME/uzantıya ASLA güvenme.
// Sadece gerçek PDF / DOC / DOCX kabul edilir; uzantı sunucu tarafından zorlanır.
function detectDocType(b: Buffer): { ext: string; mimetype: string } | null {
  // %PDF
  if (b.length > 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) {
    return { ext: 'pdf', mimetype: 'application/pdf' }
  }
  // PK\x03\x04 → DOCX (Office Open XML = zip)
  if (b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) {
    return { ext: 'docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  }
  // D0 CF 11 E0 A1 B1 1A E1 → eski .doc (OLE compound)
  if (
    b.length > 8 && b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0 &&
    b[4] === 0xa1 && b[5] === 0xb1 && b[6] === 0x1a && b[7] === 0xe1
  ) {
    return { ext: 'doc', mimetype: 'application/msword' }
  }
  return null
}

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
    let cvId: number | undefined

    const cvFile = fd.get('cv')
    if (cvFile && cvFile instanceof File && cvFile.size > 0) {
      if (cvFile.size > MAX_SIZE) {
        return NextResponse.json({ error: 'CV dosyası 5MB sınırını aşıyor.' }, { status: 400 })
      }
      const buf = Buffer.from(await cvFile.arrayBuffer())
      // Güvenlik: dosya türünü içerikten doğrula, istemci verisine güvenme
      const detected = detectDocType(buf)
      if (!detected) {
        return NextResponse.json({ error: 'Sadece geçerli PDF, DOC veya DOCX dosyası kabul edilir.' }, { status: 400 })
      }
      // Güvenli, sunucu tarafından üretilen dosya adı — kullanıcı adı/uzantısı asla kullanılmaz
      const safeName = `cv-${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}.${detected.ext}`
      const created = await payload.create({
        collection: 'media',
        data: { alt: `CV — ${fullName}` },
        file: {
          data: buf,
          mimetype: detected.mimetype,
          name: safeName,
          size: buf.length,
        },
      })
      const uploadedId = Number((created as any).id)
      if (Number.isFinite(uploadedId)) {
        cvId = uploadedId
      }
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
