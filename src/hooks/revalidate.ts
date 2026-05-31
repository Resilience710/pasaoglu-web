import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * İçerik değiştiğinde Next.js ISR/route cache'ini temizler.
 * Böylece admin panelinden yapılan değişiklikler anında canlıda görünür
 * ve "boş cache'e takılma" sorunu yaşanmaz.
 */
async function purge() {
  try {
    const { revalidatePath } = await import('next/cache')
    // Root layout'u paylaşan tüm sayfaları yeniden üret
    revalidatePath('/', 'layout')
  } catch {
    // Build/script bağlamında next/cache yoksa sessizce geç
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async () => {
  await purge()
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async () => {
  await purge()
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async () => {
  await purge()
}
