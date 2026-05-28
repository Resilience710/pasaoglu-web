import { rm } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const targets = ['.next', '.next-dev']

for (const target of targets) {
  const fullPath = path.join(root, target)

  try {
    await rm(fullPath, { force: true, recursive: true })
    console.log(`[clean-next-cache] removed ${target}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[clean-next-cache] could not remove ${target}: ${message}`)
  }
}
