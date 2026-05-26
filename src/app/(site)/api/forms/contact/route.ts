import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Geçersiz e-posta.' }, { status: 400 })
    }
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contactSubmissions',
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: body.phone ? String(body.phone).slice(0, 60) : undefined,
        company: body.company ? String(body.company).slice(0, 200) : undefined,
        subject: body.subject ? String(body.subject).slice(0, 200) : undefined,
        message: String(message).slice(0, 5000),
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Sunucu hatası' }, { status: 500 })
  }
}
