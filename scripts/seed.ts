/**
 * Seed script — boots Payload, ensures admin user, and populates baseline content.
 * Run with: npm run seed
 * Idempotent.
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
  if (!fs.existsSync(filePath)) {
    console.warn('⚠ missing asset:', filePath)
    return undefined
  }
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
    console.log('✓ page updated:', slug)
  } else {
    await payload.create({ collection: 'pages', data: { ...data, slug } })
    console.log('+ page created:', slug)
  }
}

async function upsertSector(payload: any, slug: string, data: any) {
  const existing = await payload.find({ collection: 'sectors', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'sectors', id: existing.docs[0].id, data })
    console.log('✓ sector updated:', slug)
    return existing.docs[0].id
  }
  const doc = await payload.create({ collection: 'sectors', data: { ...data, slug } })
  console.log('+ sector created:', slug)
  return doc.id
}

const rt = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{
      type: 'paragraph', version: 1,
      children: [{ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal', style: '' }],
    }],
  },
})

const CERTS_VESKIM_TOP = [
  { name: 'YYS / AEO', description: 'Yetkilendirilmiş Yükümlü Sertifikası' },
  { name: 'ISO 9001', description: 'Kalite Yönetim' },
  { name: 'ISO 14001', description: 'Çevre Yönetim' },
  { name: 'ISO 14064-1', description: 'Karbon Ayak İzi' },
  { name: 'ISO 27001', description: 'Bilgi Güvenliği' },
]

async function run() {
  const payload = await getPayload({ config })
  console.log('Payload booted.')

  // 1. Admin user
  const userEmail = 'admin@pasaoglugroup.com.tr'
  const userPassword = 'Pasaoglu2026!'
  const usersExisting = await payload.find({ collection: 'users', where: { email: { equals: userEmail } }, limit: 1 })
  if (!usersExisting.docs[0]) {
    await payload.create({
      collection: 'users',
      data: { email: userEmail, password: userPassword, name: 'Yönetici', role: 'admin' },
    })
    console.log(`+ admin user: ${userEmail} / ${userPassword}`)
  } else {
    console.log('✓ admin user exists')
  }

  // 2. Upload media
  console.log('\n— uploading media —')
  const logo = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'logo.png'), 'Paşaoğlu Group Logo')
  const logoWhite = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'logo-white.png'), 'Paşaoğlu Group Logo (beyaz)')

  const kimyaImg1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'kimya-pexels-pixabay-209251.jpg'), 'Kimya laboratuvarı')
  const kimyaImg2 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'kimya-pexels-tiger-lily-4483608.jpg'), 'Endüstriyel kimya')
  const kimyaImg3 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'kimya-pexels-wenxin-dong-450439949-16924265.jpg'), 'Kimya tesisi')
  const yapiImg1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-eduschadesoares-5498230.jpg'), 'Yapı ve inşaat')
  const yapiImg2 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-matreding-10410106.jpg'), 'Yapı malzemeleri')
  const yapiImg3 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-james-richardson-2159544295-36122954.jpg'), 'İnşaat sahası')
  const yapiImg4 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'yapi-pexels-kawan-santos-1459008164-37162865.jpg'), 'Yapı projesi')
  const gidaImg1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'gida-pexels-freek-wolsink-508219-34221998.jpg'), 'Gıda üretimi')
  const gidaImg2 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'gida-pexels-1892494919-28657994.jpg'), 'Gıda hammaddesi')
  const gidaImg3 = await uploadAsset(payload, path.join(OLD_ASSETS, 'img', 'gida-pexels-marek-piwnicki-3907296-33149702.jpg'), 'Gıda tedarik')

  const kimyaVid = await uploadAsset(payload, path.join(OLD_ASSETS, 'video', 'kimya-13996856_3840_2160_30fps.mp4'), 'Kimya hero video')
  const heroVid1 = await uploadAsset(payload, path.join(OLD_ASSETS, 'video', 'kimya-9856370-hd_1920_1080_30fps.mp4'), 'Hero video')
  const yapiVid = await uploadAsset(payload, path.join(OLD_ASSETS, 'video', 'yapi-11396197-uhd_3840_2160_60fps.mp4'), 'Yapı hero video')

  const partnerNames = ['archroma', 'basf', 'clariant', 'dow', 'evonik', 'lanxess', 'nouryon', 'solvay']
  const partnerIds: { id: any; name: string }[] = []
  for (const name of partnerNames) {
    for (const ext of ['png', 'svg', 'webp']) {
      const p = path.join(OLD_ASSETS, 'img', 'partners', `${name}.${ext}`)
      if (fs.existsSync(p)) {
        const id = await uploadAsset(payload, p, `${name} logo`)
        if (id) partnerIds.push({ id, name: name.toUpperCase() })
        break
      }
    }
  }

  // 3. Site settings & nav
  console.log('\n— site settings —')
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
        { label: 'Politikalarımız', href: '/politikalarimiz' },
        { label: 'Kariyer', href: '/kariyer' },
        { label: 'İletişim', href: '/iletisim' },
      ],
    },
  })

  // 4. Sectors — each visually distinct
  console.log('\n— sectors —')

  // KİMYA — Veskim tarzı (centered overlay + sertifika grid + ürün accordion'lu koyu zemin)
  await upsertSector(payload, 'kimya', {
    name: 'Kimya', theme: 'chem',
    shortDescription: 'Tekstil, kozmetik, deri, gıda ve endüstriyel kimyasallarda geniş hammadde portföyü.',
    cardImage: kimyaImg1,
    meta: { title: 'Kimya', description: 'Paşaoğlu Group Kimya — sertifikalı tedarik' },
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'centered',
        eyebrow: '1987’den bu yana',
        title: 'Farkı Yaratan',
        titleAccent: 'Kimyamız',
        description: 'Kimya sektörünün ihtiyaç duyduğu tüm kategorilerde yüksek kaliteli çözümler.',
        video: kimyaVid,
        certifications: CERTS_VESKIM_TOP,
        showScrollIndicator: true,
      },
      {
        blockType: 'statsGrid',
        variant: 'dark',
        items: [
          { value: '36', label: 'Yıllık Tecrübe' },
          { value: '155+', label: 'Çalışan' },
          { value: '30+', label: 'Ülkeye İhracat' },
          { value: '25.000', label: 'Ton/Yıl Kapasite' },
          { value: '45.500', label: 'M² Alan' },
        ],
      },
      {
        blockType: 'splitTextImage',
        mediaSide: 'right',
        eyebrow: 'Ürün Yaklaşımımız',
        title: 'Geniş ürün yelpazesi, teknik destek',
        body: rt('Onaylı tedarikçi ağımızla; tekstil, gıda, kozmetik ve endüstriyel kimyasal kategorilerinde sürekliliği yüksek tedarik sağlıyoruz. Ar-Ge ekibimiz, müşterilerimize teknik dokümantasyon ve uygulama desteği sunar.'),
        image: kimyaImg2,
        features: [
          { title: 'Sertifikalı Tedarik', description: 'ISO 9001, REACH uyumlu hammaddeler.' },
          { title: 'Teknik Destek', description: 'MSDS, TDS ve uygulama danışmanlığı.' },
        ],
      },
    ],
  })

  // YAPI — Ergun tarzı (side panel hero, sıcak toprak tonu, alt'a renkli 3 sütun)
  await upsertSector(payload, 'yapi', {
    name: 'Yapı', theme: 'build',
    shortDescription: 'İnşaat kimyasalları ve yapı malzemelerinde profesyonel çözüm ortağı.',
    cardImage: yapiImg1,
    meta: { title: 'Yapı' },
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'sidePanel',
        eyebrow: 'Yapı Sektörü',
        title: 'Sağlam yapıların arkasındaki',
        titleAccent: 'mühendislik',
        description: 'İnşaat kimyasalları, izolasyon, derz malzemeleri ve yapı tutkallarında uçtan uca tedarik.',
        video: yapiVid,
        sidePanel: {
          panelTitle: 'Sahada Doğrulanmış',
          panelText: 'Şantiye desteği ve uygulama danışmanlığı standart hizmetimizdir. CE ve TSE belgeli ürün portföyü.',
          panelCtaLabel: 'İletişime Geç',
          panelCtaHref: '/iletisim',
        },
        buttons: [{ label: 'Sektörü Tanıyın', href: '#detay', variant: 'ghost' }],
        showScrollIndicator: true,
      },
      {
        blockType: 'featureCards',
        eyebrow: 'Çözüm alanlarımız',
        title: 'Yapıdaki uzmanlığımız',
        columns: '3',
        cards: [
          { image: yapiImg2, title: 'İnşaat Kimyasalları', description: 'Derz, beton katkıları, izolasyon ve yapıştırıcı çözümleri.' },
          { image: yapiImg3, title: 'Yapı Malzemeleri', description: 'Sertifikalı tedarikçilerden, projeye özel tedarik.' },
          { image: yapiImg4, title: 'Saha Desteği', description: 'Uygulama ekipleriyle teknik denetim ve danışmanlık.' },
        ],
      },
      {
        blockType: 'splitTextImage',
        mediaSide: 'left',
        eyebrow: 'Yaklaşımımız',
        title: 'Müteahhitten son kullanıcıya',
        body: rt('Türkiye genelinde müteahhitler, uygulayıcılar ve büyük ölçekli yapı projeleri için sertifikalı yapı kimyasalları tedarik ediyoruz. Şantiye desteği ve uygulama danışmanlığı standart hizmetimizdir.'),
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

  // GIDA — minimalist, ferah, tam ekran görsel hero, soft kart düzeni
  await upsertSector(payload, 'gida', {
    name: 'Gıda', theme: 'food',
    shortDescription: 'Gıda güvenliği standartlarında hammadde ve katkı çözümleri.',
    cardImage: gidaImg1,
    meta: { title: 'Gıda' },
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'fullImage',
        eyebrow: 'Gıda Sektörü',
        title: 'Güvenilir gıda için doğru',
        titleAccent: 'hammadde',
        description: 'Asitler, emülgatörler, koruyucular ve tatlandırıcılar — HACCP ve ISO 22000 uyumlu.',
        poster: gidaImg1,
        buttons: [
          { label: 'Ürünler', href: '#urunler', variant: 'accent' },
          { label: 'Teklif Al', href: '/iletisim', variant: 'ghost' },
        ],
      },
      {
        blockType: 'statsGrid',
        variant: 'light',
        items: [
          { value: 'ISO 22000', label: 'Gıda Güvenliği' },
          { value: 'HACCP', label: 'Kritik Kontrol Noktaları' },
          { value: '30+', label: 'Ürün Kategorisi' },
          { value: 'Helal', label: 'Sertifikasyon' },
        ],
      },
      {
        blockType: 'featureCards',
        eyebrow: 'Ürün gruplarımız',
        title: 'Gıdaya değer katan çözümler',
        columns: '3',
        cards: [
          { image: gidaImg2, title: 'Asit & Tuzlar', description: 'Sitrik asit, sodyum bikarbonat ve daha fazlası.' },
          { image: gidaImg3, title: 'Emülgatör & Stabilizör', description: 'Tekstür ve raf ömrü için profesyonel çözümler.' },
          { image: gidaImg1, title: 'Koruyucu & Aroma', description: 'Doğal ve sentetik koruyucu kategorisi.' },
        ],
      },
      {
        blockType: 'splitTextImage',
        mediaSide: 'right',
        eyebrow: 'Tedarik Felsefemiz',
        title: 'İzlenebilirlik ve şeffaflık',
        body: rt('Gıda üreticilerimize, tedarik zincirinin başından itibaren izlenebilir ve sertifikalı hammadde sağlıyoruz. Kalite kontrolü ve teknik dokümantasyon süreçlerimiz tamamen şeffaftır.'),
        image: gidaImg3,
      },
    ],
  })

  // 5. Pages
  console.log('\n— pages —')

  await upsertPage(payload, 'home', {
    title: 'Ana Sayfa',
    meta: { title: 'Paşaoğlu Group — Holding' },
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'centered',
        eyebrow: '1987’den bu yana',
        title: 'Farkı Yaratan',
        titleAccent: 'Holding',
        description: 'Kimya, Yapı ve Gıda sektörlerinde holding yapılanmasıyla katma değer üreten kurumsal grup.',
        video: heroVid1,
        certifications: CERTS_VESKIM_TOP,
        showScrollIndicator: true,
      },
      {
        blockType: 'statsGrid',
        variant: 'dark',
        items: [
          { value: '36', label: 'Yıllık Tecrübe' },
          { value: '155+', label: 'Çalışan' },
          { value: '30+', label: 'Ülkeye İhracat' },
          { value: '25.000', label: 'Ton/Yıl Kapasite' },
          { value: '45.500', label: 'M² Alan' },
        ],
      },
      {
        blockType: 'splitTextImage',
        mediaSide: 'right',
        eyebrow: 'Operasyonel Güç',
        title: 'Sahada güçlü, tedarik zincirinde dirençli',
        body: rt('Paşaoğlu Group; uzun yıllara dayanan deneyimi ve global iş ortaklıklarıyla, üç farklı sektörde uçtan uca operasyon yönetir. Müşterilerimize sürdürülebilir tedarik ve teknik destek sağlıyoruz.'),
        image: kimyaImg2,
        button: { label: 'Hakkımızda', href: '/hakkimizda' },
      },
      {
        blockType: 'featureCards',
        eyebrow: 'Sektörlerimiz',
        title: 'Faaliyet alanlarımız',
        description: 'Her sektör için ayrı uzmanlık, ortak kurumsal değerler.',
        columns: '3',
        cards: [
          { image: kimyaImg1, title: 'Kimya', description: 'Endüstriyel kimyasallar ve hammadde tedariki.', href: '/sektorler/kimya' },
          { image: yapiImg1, title: 'Yapı', description: 'İnşaat kimyasalları ve yapı malzemeleri.', href: '/sektorler/yapi' },
          { image: gidaImg1, title: 'Gıda', description: 'Gıda hammaddeleri ve katkı çözümleri.', href: '/sektorler/gida' },
        ],
      },
      {
        blockType: 'partnerMarquee',
        title: 'İş Ortaklarımız',
        logos: partnerIds.map((p) => ({ logo: p.id, name: p.name })),
      },
      {
        blockType: 'splitTextImage',
        mediaSide: 'left',
        eyebrow: 'Kurumsal Yapı',
        title: 'Holding standartlarında yönetişim',
        body: rt('Şeffaf yönetim, ISO sertifikalı süreçler ve sürdürülebilirlik politikalarımızla; müşterilerimize uzun vadeli, güvenilir bir iş ortaklığı sunuyoruz.'),
        image: yapiImg2,
        button: { label: 'Detaylı Bilgi', href: '/hakkimizda' },
      },
    ],
  })

  await upsertPage(payload, 'hakkimizda', {
    title: 'Hakkımızda',
    meta: { title: 'Hakkımızda' },
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'centered',
        eyebrow: 'Hakkımızda',
        title: 'Köklü bir',
        titleAccent: 'Holding',
        description: 'Üç sektörde ortak değerlerle çalışan bir grup şirketi.',
        video: heroVid1,
        showScrollIndicator: false,
      },
      {
        blockType: 'statsGrid',
        variant: 'dark',
        items: [
          { value: '36', label: 'Yıllık Tecrübe' },
          { value: '155+', label: 'Çalışan' },
          { value: '30+', label: 'Ülkeye İhracat' },
          { value: '25.000', label: 'Ton/Yıl Kapasite' },
          { value: '45.500', label: 'M² Alan' },
        ],
      },
      {
        blockType: 'splitTextImage',
        mediaSide: 'right',
        eyebrow: '1987’den bugüne',
        title: 'Paşaoğlu Group hakkında',
        body: rt('Onlarca yıllık ticari birikim ve global iş ortaklıklarıyla, kimya, yapı ve gıda sektörlerinde uçtan uca hizmet sunan bir holding yapılanmasıyız. Tedarik zincirimizdeki şeffaflık ve teknik destek anlayışımız, uzun vadeli iş ortaklıkları oluşturmamızı sağladı.'),
        image: kimyaImg3,
      },
      {
        blockType: 'featureCards',
        eyebrow: 'Değerlerimiz',
        title: 'Vizyon, Misyon ve Değerler',
        columns: '3',
        cards: [
          { title: 'Vizyon', description: 'Üç sektörde de referans gösterilen bir holding olmak.' },
          { title: 'Misyon', description: 'Müşterilerimize sürdürülebilir, sertifikalı ve teknik destekli çözümler sunmak.' },
          { title: 'Değerler', description: 'Şeffaflık, kalite, sürdürülebilirlik ve uzun vadeli iş ortaklığı.' },
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

  await upsertPage(payload, 'politikalarimiz', {
    title: 'Politikalarımız',
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'centered',
        eyebrow: 'Kurumsal',
        title: 'Holding',
        titleAccent: 'Politikalarımız',
        description: 'Kalite, sürdürülebilirlik, etik yönetim ve operasyon ilkelerimiz.',
        poster: yapiImg2,
        showScrollIndicator: false,
      },
      {
        blockType: 'policyNav',
        links: [
          { label: 'Kalite', href: '/politikalarimiz/kalite' },
          { label: 'Sürdürülebilirlik', href: '/politikalarimiz/surdurulebilirlik' },
          { label: 'Ar-Ge & İnovasyon', href: '/politikalarimiz/arge-inovasyon' },
          { label: 'Operasyon Gücü', href: '/politikalarimiz/operasyon-gucu' },
        ],
      },
      {
        blockType: 'featureCards',
        title: 'İlkelerimiz',
        columns: '3',
        cards: [
          { title: 'Kalite Politikası', description: 'ISO 9001 standartlarına uygun süreç yönetimi.' },
          { title: 'Çevre', description: 'ISO 14001 çerçevesinde çevresel sorumluluk.' },
          { title: 'İSG', description: 'ISO 45001 iş sağlığı ve güvenliği taahhüdü.' },
          { title: 'Etik Yönetim', description: 'Şeffaf ve hesap verebilir yönetim.' },
          { title: 'Tedarik', description: 'Sürdürülebilir tedarik zinciri ilkeleri.' },
          { title: 'Ürün Güvenliği', description: 'MSDS, TDS ve regülasyon uyumu.' },
        ],
      },
    ],
  })

  await upsertPage(payload, 'kariyer', {
    title: 'Kariyer',
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'centered',
        eyebrow: 'İK',
        title: 'Birlikte',
        titleAccent: 'Büyüyelim',
        description: 'Ekiplerimize katılmak için başvurunuzu iletin.',
        poster: gidaImg1,
        showScrollIndicator: false,
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

  await upsertPage(payload, 'iletisim', {
    title: 'İletişim',
    layout: [
      {
        blockType: 'heroVideo',
        variant: 'centered',
        eyebrow: 'Bize Ulaşın',
        title: 'İletişime',
        titleAccent: 'Geçin',
        description: 'Sorularınız, teklif talepleriniz ve iş ortaklıkları için.',
        poster: yapiImg1,
        showScrollIndicator: false,
      },
      {
        blockType: 'contactBlock',
        title: 'Ofislerimiz',
        offices: [{
          name: 'Genel Müdürlük',
          address: 'İstanbul, Türkiye',
          phone: '+90 212 000 00 00',
          email: 'info@pasaoglugroup.com.tr',
        }],
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
