/**
 * Seed script — idempotent.
 * Run with: npm run seed
 */
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OLD_ASSETS = path.resolve(__dirname, '..', '..', 'Eski_Site', 'httpdocs', 'assets')

async function uploadAsset(payload: any, filePath: string, alt: string) {
  if (!fs.existsSync(filePath)) return undefined
  const filename = path.basename(filePath)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const data = fs.readFileSync(filePath)
  const ext = path.extname(filename).slice(1).toLowerCase()
  const mimetype =
    ext === 'mp4' ? 'video/mp4'
    : ext === 'png' ? 'image/png'
    : ext === 'webp' ? 'image/webp'
    : ext === 'svg' ? 'image/svg+xml'
    : 'image/jpeg'
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype, name: filename, size: data.length },
  })
  return doc.id
}

async function upsertPage(payload: any, slug: string, data: any) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log('✓ page:', slug)
  } else {
    await payload.create({ collection: 'pages', data: { ...data, slug } })
    console.log('+ page:', slug)
  }
}

async function upsertSector(payload: any, slug: string, data: any) {
  const existing = await payload.find({ collection: 'sectors', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'sectors', id: existing.docs[0].id, data })
    console.log('✓ sector:', slug)
    return existing.docs[0].id
  }
  const doc = await payload.create({ collection: 'sectors', data: { ...data, slug } })
  console.log('+ sector:', slug)
  return doc.id
}

// Lexical helper — paragraph
const p = (text: string) => ({
  type: 'paragraph', version: 1,
  children: [{ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal', style: '' }],
})
// Lexical helper — bullet list
const ul = (items: string[]) => ({
  type: 'list', version: 1, tag: 'ul', listType: 'bullet', start: 1,
  children: items.map((t, i) => ({
    type: 'listitem', version: 1, value: i + 1,
    children: [{ type: 'text', text: t, version: 1, format: 0, detail: 0, mode: 'normal', style: '' }],
  })),
})
const rt = (...nodes: any[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: nodes },
})
const rtP = (text: string) => rt(p(text))

const CERTS_VESKIM_TOP = [
  { name: 'YYS / AEO', description: 'Yetkilendirilmiş Yükümlü' },
  { name: 'ISO 9001', description: 'Kalite Yönetim' },
  { name: 'ISO 14001', description: 'Çevre Yönetim' },
  { name: 'ISO 14064-1', description: 'Karbon Ayak İzi' },
  { name: 'ISO 27001', description: 'Bilgi Güvenliği' },
]

async function run() {
  const payload = await getPayload({ config })
  console.log('Payload booted.')

  // Admin user
  const usersExisting = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@pasaoglugroup.com.tr' } },
    limit: 1,
  })
  if (!usersExisting.docs[0]) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@pasaoglugroup.com.tr', password: 'Pasaoglu2026!', name: 'Yönetici', role: 'admin' },
    })
    console.log('+ admin user')
  }

  console.log('\n— uploading media —')
  const logo = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'logo.png'), 'Logo')
  const logoWhite = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'logo-white.png'), 'Logo beyaz')
  const kimyaImg1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'kimya-pexels-pixabay-209251.jpg'), 'Kimya laboratuvarı')
  const kimyaImg2 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'kimya-pexels-tiger-lily-4483608.jpg'), 'Endüstriyel kimya')
  const kimyaImg3 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'kimya-pexels-wenxin-dong-450439949-16924265.jpg'), 'Kimya tesisi')
  const yapiImg1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-eduschadesoares-5498230.jpg'), 'Yapı')
  const yapiImg2 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-matreding-10410106.jpg'), 'Yapı malzemeleri')
  const yapiImg3 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-james-richardson-2159544295-36122954.jpg'), 'Şantiye')
  const yapiImg4 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-kawan-santos-1459008164-37162865.jpg'), 'Yapı projesi')
  const gidaImg1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'gida-pexels-freek-wolsink-508219-34221998.jpg'), 'Gıda üretim')
  const gidaImg2 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'gida-pexels-1892494919-28657994.jpg'), 'Gıda')
  const gidaImg3 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'gida-pexels-marek-piwnicki-3907296-33149702.jpg'), 'Gıda hammaddesi')
  const kimyaVid = await uploadAsset(payload, path.join(OLD_ASSETS, 'video', 'kimya-13996856_3840_2160_30fps.mp4'), 'Kimya video')
  const heroVid1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'video', 'kimya-9856370-hd_1920_1080_30fps.mp4'), 'Hero video')
  const yapiVid = await uploadAsset(payload, path.join(OLD_ASSETS, 'video', 'yapi-11396197-uhd_3840_2160_60fps.mp4'), 'Yapı video')

  const partnerIds: any[] = []
  for (const name of ['archroma', 'basf', 'clariant', 'dow', 'evonik', 'lanxess', 'nouryon', 'solvay']) {
    for (const ext of ['png', 'svg', 'webp']) {
      const p2 = path.join(OLD_ASSETS, 'img', 'partners', `${name}.${ext}`)
      if (fs.existsSync(p2)) {
        const id = await uploadAsset(payload, p2, name)
        if (id) partnerIds.push({ logo: id, name: name.toUpperCase() })
        break
      }
    }
  }

  console.log('\n— site settings & nav —')
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      logo, logoDark: logoWhite || logo,
      tagline: '1987’den bu yana — Üç sektör, tek güç',
      phone: '+90 212 000 00 00',
      email: 'info@pasaoglugroup.com.tr',
      addresses: [{ name: 'Genel Müdürlük', address: 'İstanbul, Türkiye' }],
      social: [{ platform: 'linkedin', url: 'https://linkedin.com/company/pasaoglu-group' }],
      footer: {
        description: 'Paşaoğlu Group; kimya, yapı ve gıda sektörlerinde holding yapılanmasıyla katma değer üreten kurumsal bir gruptur.',
        columns: [
          { title: 'Kurumsal', links: [
            { label: 'Hakkımızda', href: '/hakkimizda' },
            { label: 'Politikalarımız', href: '/politikalarimiz' },
            { label: 'Kariyer', href: '/kariyer' },
          ] },
          { title: 'Sektörler', links: [
            { label: 'Kimya', href: '/sektorler/kimya' },
            { label: 'Yapı', href: '/sektorler/yapi' },
            { label: 'Gıda', href: '/sektorler/gida' },
          ] },
          { title: 'İletişim', links: [
            { label: 'Bize Ulaşın', href: '/iletisim' },
            { label: 'Teklif Al', href: '/iletisim' },
          ] },
        ],
        copyright: `© ${new Date().getFullYear()} Paşaoğlu Group. Tüm hakları saklıdır.`,
      },
    },
  })

  await payload.updateGlobal({
    slug: 'mainNav',
    data: {
      items: [
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Hakkımızda', href: '/hakkimizda' },
        { label: 'Sektörler', href: '/sektorler', children: [
          { label: 'Kimya', href: '/sektorler/kimya' },
          { label: 'Yapı', href: '/sektorler/yapi' },
          { label: 'Gıda', href: '/sektorler/gida' },
        ] },
        { label: 'Politikalarımız', href: '/politikalarimiz', children: [
          { label: 'Kalite Politikası', href: '/politikalarimiz/kalite' },
          { label: 'Sürdürülebilirlik', href: '/politikalarimiz/surdurulebilirlik' },
          { label: 'Ar-Ge & İnovasyon', href: '/politikalarimiz/arge-inovasyon' },
          { label: 'Operasyon Gücü', href: '/politikalarimiz/operasyon-gucu' },
          { label: 'Belgeler', href: '/politikalarimiz/belgeler' },
        ] },
        { label: 'Kariyer', href: '/kariyer' },
        { label: 'İletişim', href: '/iletisim' },
      ],
    },
  })

  // ====== SECTORS ======
  console.log('\n— sectors —')

  await upsertSector(payload, 'kimya', {
    name: 'Kimya', theme: 'chem',
    shortDescription: 'Tekstil, kozmetik, deri, gıda ve endüstriyel kimyasallarda geniş hammadde portföyü.',
    cardImage: kimyaImg1,
    meta: { title: 'Kimya' },
    layout: [
      {
        blockType: 'heroVideo', variant: 'centered',
        eyebrow: '1987’den bu yana', title: 'Farkı Yaratan', titleAccent: 'Kimyamız',
        description: 'Kimya sektörünün ihtiyaç duyduğu tüm kategorilerde yüksek kaliteli çözümler.',
        video: kimyaVid, certifications: CERTS_VESKIM_TOP, showScrollIndicator: true,
      },
      {
        blockType: 'statsGrid', variant: 'dark',
        items: [
          { value: '36', label: 'Yıllık Tecrübe' },
          { value: '155+', label: 'Çalışan' },
          { value: '30+', label: 'Ülkeye İhracat' },
          { value: '25.000', label: 'Ton/Yıl Kapasite' },
          { value: '45.500', label: 'M² Alan' },
        ],
      },
      {
        blockType: 'splitTextImage', mediaSide: 'right',
        eyebrow: 'Ürün Yaklaşımımız', title: 'Geniş ürün yelpazesi, teknik destek',
        body: rtP('Onaylı tedarikçi ağımızla; tekstil, gıda, kozmetik ve endüstriyel kimyasal kategorilerinde sürekliliği yüksek tedarik sağlıyoruz. Ar-Ge ekibimiz, müşterilerimize teknik dokümantasyon ve uygulama desteği sunar.'),
        image: kimyaImg2,
        features: [
          { title: 'Sertifikalı Tedarik', description: 'ISO 9001, REACH uyumlu hammaddeler.' },
          { title: 'Teknik Destek', description: 'MSDS, TDS ve uygulama danışmanlığı.' },
        ],
      },
      {
        blockType: 'featureCards', eyebrow: 'Ürün Grupları', title: 'Kategorilerimiz',
        columns: '4',
        cards: [
          { title: 'Tekstil Kimyasalları', description: 'Ön terbiye, boyama, baskı ve apre süreçleri için.' },
          { title: 'Kozmetik Hammaddeleri', description: 'Yüzey aktifleri, emülgatörler, koruyucular.' },
          { title: 'Gıda Kimyasalları', description: 'Asitler, emülgatörler, koruyucular, tatlandırıcılar.' },
          { title: 'Endüstriyel', description: 'Solventler, asitler, alkali ürünler.' },
        ],
      },
      {
        blockType: 'ctaBand', variant: 'dark',
        eyebrow: 'Teklif & Numune',
        title: 'İhtiyacınıza özel teknik destek ile çalışalım',
        description: 'Hammadde teklif talepleri, MSDS / TDS dökümanları ve numune talepleri için ekibimizle iletişime geçin.',
        buttons: [
          { label: 'Teklif Al', href: '/iletisim', variant: 'gold' },
          { label: 'MSDS Talep', href: '/iletisim', variant: 'ghost' },
        ],
      },
    ],
  })

  await upsertSector(payload, 'yapi', {
    name: 'Yapı', theme: 'build',
    shortDescription: 'İnşaat kimyasalları ve yapı malzemelerinde profesyonel çözüm ortağı.',
    cardImage: yapiImg1,
    meta: { title: 'Yapı' },
    layout: [
      {
        blockType: 'heroVideo', variant: 'sidePanel',
        eyebrow: 'Yapı Sektörü', title: 'Sağlam yapıların arkasındaki', titleAccent: 'mühendislik',
        description: 'İnşaat kimyasalları, izolasyon, derz malzemeleri ve yapı tutkallarında uçtan uca tedarik.',
        video: yapiVid,
        sidePanel: {
          panelTitle: 'Sahada Doğrulanmış',
          panelText: 'Şantiye desteği ve uygulama danışmanlığı standart hizmetimizdir. CE ve TSE belgeli ürün portföyü.',
          panelCtaLabel: 'İletişime Geç', panelCtaHref: '/iletisim',
        },
        showScrollIndicator: true,
      },
      {
        blockType: 'featureCards', eyebrow: 'Çözüm Alanları', title: 'Yapıdaki uzmanlığımız', columns: '3',
        cards: [
          { image: yapiImg2, title: 'İnşaat Kimyasalları', description: 'Derz, beton katkıları, izolasyon ve yapıştırıcı çözümleri.' },
          { image: yapiImg3, title: 'Yapı Malzemeleri', description: 'Sertifikalı tedarikçilerden, projeye özel tedarik.' },
          { image: yapiImg4, title: 'Saha Desteği', description: 'Uygulama ekipleriyle teknik denetim ve danışmanlık.' },
        ],
      },
      {
        blockType: 'splitTextImage', mediaSide: 'left',
        eyebrow: 'Yaklaşımımız', title: 'Müteahhitten son kullanıcıya',
        body: rtP('Türkiye genelinde müteahhitler, uygulayıcılar ve büyük ölçekli yapı projeleri için sertifikalı yapı kimyasalları tedarik ediyoruz. Şantiye desteği ve uygulama danışmanlığı standart hizmetimizdir.'),
        image: yapiImg2,
        features: [
          { title: 'CE & TSE Belgeli', description: 'Tüm ürünlerimiz uyumluluk standartlarına sahiptir.' },
          { title: 'Proje Bazlı Tedarik', description: 'Büyük ölçekli projelere lojistik dahil çözüm.' },
        ],
      },
      {
        blockType: 'quoteBand',
        quote: 'Sağlam temellerin üzerine inşa edilen bir gelecek için, doğru malzeme doğru zamanda.',
        author: 'Paşaoğlu Yapı Ekibi',
        background: yapiImg3,
      },
    ],
  })

  await upsertSector(payload, 'gida', {
    name: 'Gıda', theme: 'food',
    shortDescription: 'Gıda güvenliği standartlarında hammadde ve katkı çözümleri.',
    cardImage: gidaImg1,
    meta: { title: 'Gıda' },
    layout: [
      {
        blockType: 'heroVideo', variant: 'fullImage',
        eyebrow: 'Gıda Sektörü', title: 'Güvenilir gıda için doğru', titleAccent: 'hammadde',
        description: 'Asitler, emülgatörler, koruyucular ve tatlandırıcılar — HACCP ve ISO 22000 uyumlu.',
        poster: gidaImg1,
        buttons: [
          { label: 'Ürünler', href: '#urunler', variant: 'accent' },
          { label: 'Teklif Al', href: '/iletisim', variant: 'ghost' },
        ],
      },
      {
        blockType: 'statsGrid', variant: 'light',
        items: [
          { value: 'ISO 22000', label: 'Gıda Güvenliği' },
          { value: 'HACCP', label: 'Kontrol Sistemi' },
          { value: '30+', label: 'Ürün Kategorisi' },
          { value: 'Helal', label: 'Sertifikasyon' },
        ],
      },
      {
        blockType: 'featureCards', eyebrow: 'Ürün Grupları', title: 'Gıdaya değer katan çözümler', columns: '3',
        cards: [
          { image: gidaImg2, title: 'Asit & Tuzlar', description: 'Sitrik asit, sodyum bikarbonat ve daha fazlası.' },
          { image: gidaImg3, title: 'Emülgatör & Stabilizör', description: 'Tekstür ve raf ömrü için profesyonel çözümler.' },
          { image: gidaImg1, title: 'Koruyucu & Aroma', description: 'Doğal ve sentetik koruyucu kategorisi.' },
        ],
      },
      {
        blockType: 'splitTextImage', mediaSide: 'right',
        eyebrow: 'Tedarik Felsefemiz', title: 'İzlenebilirlik ve şeffaflık',
        body: rtP('Gıda üreticilerimize, tedarik zincirinin başından itibaren izlenebilir ve sertifikalı hammadde sağlıyoruz. Kalite kontrolü ve teknik dokümantasyon süreçlerimiz tamamen şeffaftır.'),
        image: gidaImg3,
      },
      {
        blockType: 'ctaBand', variant: 'light',
        eyebrow: 'Birlikte Çalışalım', title: 'Gıda formülasyonunuz için ihtiyacınız neyse',
        description: 'Sertifikalı, izlenebilir gıda hammaddelerimizle ürünlerinize değer katın.',
        buttons: [{ label: 'İletişime Geç', href: '/iletisim', variant: 'gold' }],
      },
    ],
  })

  // ====== PAGES ======
  console.log('\n— pages —')

  await upsertPage(payload, 'home', {
    title: 'Ana Sayfa',
    meta: { title: 'Paşaoğlu Group — Holding' },
    layout: [
      {
        blockType: 'heroVideo', variant: 'centered',
        eyebrow: '1987’den bu yana', title: 'Farkı Yaratan', titleAccent: 'Holding',
        description: 'Kimya, Yapı ve Gıda sektörlerinde holding yapılanmasıyla katma değer üreten kurumsal grup.',
        video: heroVid1, certifications: CERTS_VESKIM_TOP, showScrollIndicator: true,
      },
      {
        blockType: 'statsGrid', variant: 'dark',
        items: [
          { value: '36', label: 'Yıllık Tecrübe' },
          { value: '155+', label: 'Çalışan' },
          { value: '30+', label: 'Ülkeye İhracat' },
          { value: '25.000', label: 'Ton/Yıl Kapasite' },
          { value: '45.500', label: 'M² Alan' },
        ],
      },
      {
        blockType: 'splitTextImage', mediaSide: 'right',
        eyebrow: 'Operasyonel Güç', title: 'Sahada güçlü, tedarik zincirinde dirençli',
        body: rtP('Paşaoğlu Group; uzun yıllara dayanan deneyimi ve global iş ortaklıklarıyla, üç farklı sektörde uçtan uca operasyon yönetir. Müşterilerimize sürdürülebilir tedarik ve teknik destek sağlıyoruz.'),
        image: kimyaImg2,
        button: { label: 'Hakkımızda', href: '/hakkimizda' },
      },
      {
        blockType: 'featureCards', eyebrow: 'Sektörlerimiz', title: 'Faaliyet alanlarımız',
        description: 'Her sektör için ayrı uzmanlık, ortak kurumsal değerler.',
        columns: '3',
        cards: [
          { image: kimyaImg1, title: 'Kimya', description: 'Endüstriyel kimyasallar ve hammadde tedariki.', href: '/sektorler/kimya' },
          { image: yapiImg1, title: 'Yapı', description: 'İnşaat kimyasalları ve yapı malzemeleri.', href: '/sektorler/yapi' },
          { image: gidaImg1, title: 'Gıda', description: 'Gıda hammaddeleri ve katkı çözümleri.', href: '/sektorler/gida' },
        ],
      },
      {
        blockType: 'timeline', title: 'Tarihçemiz',
        description: 'Köklü birikim, sürekli büyüme.',
        milestones: [
          { year: '1987', title: 'Kuruluş', description: 'İstanbul’da kimya sektörüne yönelik ticari faaliyetlerle yola çıktık.' },
          { year: '1994', title: 'İlk Depo', description: 'Tekirdağ Çorlu’da depolama alanımız hizmete girdi.' },
          { year: '1999', title: '16.000 m²', description: 'Tekstil kimyasalları üretimine başladık.' },
          { year: '2010', title: 'Ar-Ge Laboratuvarı', description: 'Bağımsız Ar-Ge laboratuvarımız kuruldu.' },
          { year: '2015', title: 'ISO 9001 & 27001', description: 'Kalite ve bilgi güvenliği sertifikalarımızı aldık.' },
          { year: '2022', title: '30+ Ülke', description: 'İhracat ağımız 30+ ülkeye ulaştı.' },
          { year: '2026', title: 'Yeni Vizyon', description: 'Üç sektörde holding yapılanmasıyla yeni dönem.' },
        ],
      },
      {
        blockType: 'partnerMarquee', title: 'İş Ortaklarımız',
        logos: partnerIds,
      },
      {
        blockType: 'ctaBand', variant: 'dark',
        eyebrow: 'Birlikten doğan güç', title: 'Üç sektörde güvenilir iş ortağınız',
        description: 'Sektörünüze özel teklif almak veya bizimle iş ortaklığı kurmak için iletişime geçin.',
        buttons: [
          { label: 'İletişime Geç', href: '/iletisim', variant: 'gold' },
          { label: 'Hakkımızda', href: '/hakkimizda', variant: 'ghost' },
        ],
      },
    ],
  })

  await upsertPage(payload, 'hakkimizda', {
    title: 'Hakkımızda',
    meta: { title: 'Hakkımızda' },
    layout: [
      {
        blockType: 'heroVideo', variant: 'centered',
        eyebrow: 'Hakkımızda', title: 'Köklü bir', titleAccent: 'Holding',
        description: 'Üç sektörde ortak değerlerle çalışan bir grup şirketi.',
        video: yapiVid, poster: yapiImg3, showScrollIndicator: false,
      },
      {
        blockType: 'statsGrid', variant: 'dark',
        items: [
          { value: '36', label: 'Yıllık Tecrübe' },
          { value: '155+', label: 'Çalışan' },
          { value: '30+', label: 'Ülkeye İhracat' },
          { value: '25.000', label: 'Ton/Yıl Kapasite' },
          { value: '45.500', label: 'M² Alan' },
        ],
      },
      {
        blockType: 'splitTextImage', mediaSide: 'right',
        eyebrow: '1987’den bugüne', title: 'Paşaoğlu Group hakkında',
        body: rtP('Onlarca yıllık ticari birikim ve global iş ortaklıklarıyla, kimya, yapı ve gıda sektörlerinde uçtan uca hizmet sunan bir holding yapılanmasıyız. Tedarik zincirimizdeki şeffaflık ve teknik destek anlayışımız, uzun vadeli iş ortaklıkları oluşturmamızı sağladı.'),
        image: kimyaImg3,
      },
      {
        blockType: 'featureCards', eyebrow: 'Değerlerimiz', title: 'Vizyon, Misyon ve Değerler', columns: '3',
        cards: [
          { title: 'Vizyon', description: 'Üç sektörde de referans gösterilen bir holding olmak.' },
          { title: 'Misyon', description: 'Müşterilerimize sürdürülebilir, sertifikalı ve teknik destekli çözümler sunmak.' },
          { title: 'Değerler', description: 'Şeffaflık, kalite, sürdürülebilirlik ve uzun vadeli iş ortaklığı.' },
        ],
      },
      {
        blockType: 'timeline', title: 'Tarihçemiz',
        milestones: [
          { year: '1987', title: 'Kuruluş', description: 'İstanbul’da kimya sektörüne yönelik ticari faaliyetlerle yola çıktık.' },
          { year: '1994', title: 'İlk Depo', description: 'Tekirdağ Çorlu’da depolama alanımız hizmete girdi.' },
          { year: '1999', title: 'Üretim', description: '16.000 m² alanda tekstil kimyasalları üretimi.' },
          { year: '2010', title: 'Ar-Ge', description: 'Bağımsız Ar-Ge laboratuvarımız kuruldu.' },
          { year: '2015', title: 'Sertifikasyon', description: 'ISO 9001 ve 27001 sertifikalarımızı aldık.' },
          { year: '2022', title: 'Global', description: '30+ ülkeye ihracat kapasitesine ulaştık.' },
          { year: '2026', title: 'Holding', description: 'Üç sektörde holding yapılanması.' },
        ],
      },
      {
        blockType: 'quoteBand',
        quote: 'Birlikten doğan gücümüzle, güçlü yarınlara.',
        author: 'Paşaoğlu Group',
        background: yapiImg3,
      },
    ],
  })

  // ====== Politikalarımız (hub) ======
  await upsertPage(payload, 'politikalarimiz', {
    title: 'Politikalarımız',
    layout: [
      {
        blockType: 'heroVideo', variant: 'centered',
        eyebrow: 'Kurumsal', title: 'Holding', titleAccent: 'Politikalarımız',
        description: 'Kalite, sürdürülebilirlik, etik yönetim ve operasyon ilkelerimiz.',
        video: kimyaVid, poster: yapiImg2, showScrollIndicator: false,
      },
      {
        blockType: 'policyTabs',
        sectionEyebrow: 'Politikalarımız',
        sectionTitle: 'Tüm politikalarımız tek sayfada',
        tabs: [
          {
            title: 'Kalite Politikası',
            body: rt(
              p('Müşterilerimize her zaman en yüksek kalitede hammadde tedariki sağlamak için süreçlerimizi sürekli geliştiririz.'),
              ul([
                'ISO 9001:2015 standardına tam uyum',
                'Her ürün partisinde laboratuvar kontrolü',
                'Tedarikçi onay ve performans değerlendirme süreçleri',
                'Müşteri geri bildirimleriyle sürekli iyileştirme',
              ]),
            ),
            detailHref: '/politikalarimiz/kalite',
          },
          {
            title: 'Sürdürülebilirlik',
            body: rt(
              p('Tüm operasyonlarımızda gezegenin sınırlarına saygı duyarak büyüyoruz.'),
              ul([
                'ISO 14001 Çevre Yönetim Sistemi',
                'Karbon ayak izi takibi ve azaltma planı',
                'Atık yönetimi ve geri dönüşüm prensipleri',
                'Sürdürülebilir tedarik zinciri politikası',
              ]),
            ),
            detailHref: '/politikalarimiz/surdurulebilirlik',
          },
          {
            title: 'Ar-Ge & İnovasyon',
            body: rt(
              p('İnovasyon, geleceği bugünden inşa etme yöntemimizdir.'),
              ul([
                'Bağımsız Ar-Ge laboratuvarı',
                'Üniversite ve sanayi işbirlikleri',
                'Yeni formülasyon ve uygulama geliştirme',
                'Müşterilere özel çözüm üretimi',
              ]),
            ),
            detailHref: '/politikalarimiz/arge-inovasyon',
          },
          {
            title: 'Operasyon Gücü',
            body: rt(
              p('Tedarik zinciri dirençliliği, müşterilerimize verdiğimiz en büyük güvencedir.'),
              ul([
                '25.000 ton/yıl depolama kapasitesi',
                '45.500 m² operasyon alanı',
                'Türkiye geneli ve uluslararası lojistik ağ',
                '7/24 satış ve teknik destek',
              ]),
            ),
            detailHref: '/politikalarimiz/operasyon-gucu',
          },
          {
            title: 'İSG Politikası',
            body: rt(
              p('Önce insan diyerek, çalışanlarımız ve paydaşlarımızın sağlığı için sıfır taviz veriyoruz.'),
              ul([
                'ISO 45001 İş Sağlığı ve Güvenliği Yönetimi',
                'Düzenli İSG eğitimleri ve denetimler',
                'Risk analizi ve önleyici aksiyon planları',
                'Acil durum hazırlık ve müdahale prosedürleri',
              ]),
            ),
          },
          {
            title: 'Etik Yönetim',
            body: rt(
              p('Şeffaf ve hesap verebilir yönetim anlayışıyla çalışıyoruz.'),
              ul([
                'Etik kurallar ve davranış kuralları',
                'Rüşvet ve yolsuzluk karşıtlığı',
                'Çıkar çatışması yönetimi',
                'İhbar hattı ve gizlilik politikası',
              ]),
            ),
          },
        ],
      },
      {
        blockType: 'ctaBand', variant: 'dark',
        eyebrow: 'Belgeler & Sertifikalar',
        title: 'Sertifikalarımızı incelemek ister misiniz?',
        description: 'ISO 9001, 14001, 27001 ve diğer sertifikalarımızı belgeler sayfasından inceleyebilirsiniz.',
        buttons: [{ label: 'Belgeler', href: '/politikalarimiz/belgeler', variant: 'gold' }],
      },
    ],
  })

  // ====== Politika alt sayfaları ======
  const policyPages: { slug: string; title: string; eyebrow: string; titleMain: string; titleAccent: string; image: any; intro: string; bullets: string[] }[] = [
    {
      slug: 'politikalarimiz/kalite',
      title: 'Kalite Politikası',
      eyebrow: 'Politika', titleMain: 'Kalite', titleAccent: 'Politikası',
      image: kimyaImg2,
      intro: 'Kalite, sadece son üründe değil her süreçte beklediğimiz bir standarttır. Müşterilerimize her zaman en yüksek kalitede hammadde tedariki sağlamak için süreçlerimizi sürekli geliştiririz.',
      bullets: [
        'ISO 9001:2015 standardına tam uyum',
        'Her ürün partisinde laboratuvar kontrolü',
        'Tedarikçi onay ve performans değerlendirme süreçleri',
        'Müşteri geri bildirimleriyle sürekli iyileştirme',
        'Şeffaf MSDS ve TDS dokümantasyonu',
      ],
    },
    {
      slug: 'politikalarimiz/surdurulebilirlik',
      title: 'Sürdürülebilirlik Politikası',
      eyebrow: 'Politika', titleMain: 'Sürdürülebilirlik', titleAccent: 'Politikamız',
      image: gidaImg3,
      intro: 'Tüm operasyonlarımızda gezegenin sınırlarına saygı duyarak büyüyoruz. İş yapış şeklimizi çevresel ve sosyal sorumluluk perspektifinden sürekli yeniden tasarlıyoruz.',
      bullets: [
        'ISO 14001 Çevre Yönetim Sistemi',
        'Karbon ayak izi takibi ve azaltma planı (ISO 14064-1)',
        'Atık yönetimi ve geri dönüşüm prensipleri',
        'Sürdürülebilir tedarik zinciri politikası',
        'Enerji verimliliği projeleri',
      ],
    },
    {
      slug: 'politikalarimiz/arge-inovasyon',
      title: 'Ar-Ge & İnovasyon',
      eyebrow: 'Politika', titleMain: 'Ar-Ge', titleAccent: '& İnovasyon',
      image: kimyaImg3,
      intro: 'İnovasyon, geleceği bugünden inşa etme yöntemimizdir. Müşteri ihtiyaçlarını derinlemesine anlayarak, sektöre yön veren çözümler geliştiriyoruz.',
      bullets: [
        'Bağımsız Ar-Ge laboratuvarı',
        'Üniversite ve sanayi işbirlikleri',
        'Yeni formülasyon ve uygulama geliştirme',
        'Müşterilere özel çözüm üretimi',
        'Patent ve fikri mülkiyet yönetimi',
      ],
    },
    {
      slug: 'politikalarimiz/operasyon-gucu',
      title: 'Operasyon Gücü',
      eyebrow: 'Politika', titleMain: 'Operasyon', titleAccent: 'Gücümüz',
      image: yapiImg2,
      intro: 'Tedarik zinciri dirençliliği, müşterilerimize verdiğimiz en büyük güvencedir. 45.500 m² operasyon alanı, modern depolama ve lojistik altyapısıyla kesintisiz hizmet veriyoruz.',
      bullets: [
        '25.000 ton/yıl depolama kapasitesi',
        '45.500 m² toplam operasyon alanı',
        'Türkiye geneli ve uluslararası lojistik ağ',
        '7/24 satış ve teknik destek',
        'Modern ERP ve takip sistemleri',
      ],
    },
    {
      slug: 'politikalarimiz/belgeler',
      title: 'Belgeler & Sertifikalar',
      eyebrow: 'Kurumsal', titleMain: 'Belgeler', titleAccent: '& Sertifikalar',
      image: yapiImg3,
      intro: 'Holding çatımız altında sürdürdüğümüz operasyonların tümü uluslararası sertifikasyon kuruluşlarınca onaylanmıştır.',
      bullets: [
        'ISO 9001:2015 — Kalite Yönetim Sistemi',
        'ISO 14001:2015 — Çevre Yönetim Sistemi',
        'ISO 45001:2018 — İş Sağlığı ve Güvenliği',
        'ISO 27001 — Bilgi Güvenliği Yönetimi',
        'ISO 14064-1 — Sera Gazı Emisyon Doğrulaması',
        'YYS / AEO — Yetkilendirilmiş Yükümlü Sertifikası',
      ],
    },
  ]

  for (const pg of policyPages) {
    await upsertPage(payload, pg.slug, {
      title: pg.title,
      meta: { title: pg.title },
      layout: [
        {
          blockType: 'heroVideo', variant: 'centered',
          eyebrow: pg.eyebrow, title: pg.titleMain, titleAccent: pg.titleAccent,
          description: pg.intro,
          video: heroVid1, poster: pg.image, showScrollIndicator: false,
        },
        {
          blockType: 'policyNav',
          links: [
            { label: 'Kalite', href: '/politikalarimiz/kalite' },
            { label: 'Sürdürülebilirlik', href: '/politikalarimiz/surdurulebilirlik' },
            { label: 'Ar-Ge & İnovasyon', href: '/politikalarimiz/arge-inovasyon' },
            { label: 'Operasyon', href: '/politikalarimiz/operasyon-gucu' },
            { label: 'Belgeler', href: '/politikalarimiz/belgeler' },
          ],
        },
        {
          blockType: 'splitTextImage', mediaSide: 'right',
          eyebrow: pg.eyebrow, title: pg.title,
          body: rt(p(pg.intro), p('Aşağıdaki ilkeler doğrultusunda hareket ediyoruz:'), ul(pg.bullets)),
          image: pg.image,
        },
        {
          blockType: 'ctaBand', variant: 'light',
          eyebrow: 'Sorularınız mı var?', title: 'Politikalarımız hakkında detaylı bilgi almak için',
          description: 'Ekibimiz, holding politikalarımızla ilgili tüm sorularınızı yanıtlamak için hazır.',
          buttons: [{ label: 'İletişime Geç', href: '/iletisim', variant: 'gold' }],
        },
      ],
    })
  }

  // ====== Kariyer ======
  await upsertPage(payload, 'kariyer', {
    title: 'Kariyer',
    layout: [
      {
        blockType: 'heroVideo', variant: 'centered',
        eyebrow: 'Kariyer', title: 'Birlikte', titleAccent: 'Büyüyelim',
        description: 'Üç sektörde uzmanlaşmış ekiplerimize katılarak kariyerinizi geliştirin.',
        video: heroVid1, poster: gidaImg1, showScrollIndicator: false,
      },
      {
        blockType: 'featureCards', eyebrow: 'Bizimle Çalışmak', title: 'Paşaoğlu’nda kariyer', columns: '3',
        cards: [
          { title: 'Gelişim Odaklı', description: 'Eğitim ve mentorluk programlarıyla sürekli gelişim.' },
          { title: 'Çok Sektörlü', description: 'Üç farklı sektörde deneyim kazanma fırsatı.' },
          { title: 'Etik Yönetim', description: 'Şeffaf, hesap verebilir ve insan odaklı kurum kültürü.' },
        ],
      },
      {
        blockType: 'careerForm',
        title: 'Başvuru Formu',
        description: 'Aşağıdaki formu doldurarak ekibimize katılmak için başvurabilirsiniz.',
        departments: [
          { name: 'Satış' }, { name: 'Satın Alma' }, { name: 'Üretim & Operasyon' },
          { name: 'Ar-Ge' }, { name: 'Lojistik' }, { name: 'İnsan Kaynakları' },
          { name: 'Muhasebe & Finans' }, { name: 'IT' }, { name: 'Pazarlama' }, { name: 'Diğer' },
        ],
      },
    ],
  })

  // ====== İletişim ======
  await upsertPage(payload, 'iletisim', {
    title: 'İletişim',
    layout: [
      {
        blockType: 'heroVideo', variant: 'centered',
        eyebrow: 'Bize Ulaşın', title: 'İletişime', titleAccent: 'Geçin',
        description: 'Sorularınız, teklif talepleriniz ve iş ortaklıkları için.',
        video: yapiVid, poster: yapiImg1, showScrollIndicator: false,
      },
      {
        blockType: 'officeGrid',
        title: 'Ofislerimiz',
        description: 'Türkiye genelinde lokasyonlarımızdan size en yakın olanla iletişime geçebilirsiniz.',
        columns: '3',
        offices: [
          {
            name: 'Genel Müdürlük',
            address: 'Maslak, Sarıyer\nİstanbul, Türkiye',
            phone: '+90 212 000 00 00',
            email: 'info@pasaoglugroup.com.tr',
          },
          {
            name: 'Çorlu Fabrika',
            address: 'Çorlu, Tekirdağ\nTürkiye',
            phone: '+90 282 000 00 00',
            email: 'fabrika@pasaoglugroup.com.tr',
          },
          {
            name: 'Hadımköy Depo',
            address: 'Hadımköy, Arnavutköy\nİstanbul, Türkiye',
            phone: '+90 212 000 00 00',
            email: 'depo@pasaoglugroup.com.tr',
          },
        ],
      },
      {
        blockType: 'contactForm',
        title: 'Mesaj Gönderin',
        subjects: [
          { name: 'Teklif Talebi' }, { name: 'Genel Bilgi' }, { name: 'İş Ortaklığı' },
          { name: 'Kariyer' }, { name: 'Basın' }, { name: 'Diğer' },
        ],
      },
    ],
  })

  console.log('\n✔ Seed completed.')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
