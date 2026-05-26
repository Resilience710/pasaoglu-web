import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mediaUrl = (media: any): string | undefined => {
  if (!media) return undefined
  if (typeof media === 'string') return media
  if (media.url) {
    return media.url.startsWith('http') ? media.url : media.url
  }
  if (media.filename) return `/media/${media.filename}`
  return undefined
}

export const mediaAlt = (media: any, fallback = ''): string => {
  if (!media) return fallback
  return media.alt || fallback
}
