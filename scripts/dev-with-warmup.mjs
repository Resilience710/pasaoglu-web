import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const extraArgs = process.argv.slice(2)

const parsePort = (args) => {
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index]

    if ((value === '--port' || value === '-p') && args[index + 1]) {
      return Number(args[index + 1]) || 3000
    }
  }

  return 3000
}

const warmRoute = async (url) => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'manual' })
      console.log(`[dev-warmup] ${url} -> ${response.status}`)
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  console.warn(`[dev-warmup] could not warm ${url}`)
}

const warmAdmin = async (port) => {
  await warmRoute(`http://127.0.0.1:${port}/admin/login`)
  await warmRoute(`http://127.0.0.1:${port}/api/users/me`)
  await warmRoute(`http://127.0.0.1:${port}/admin`)
}

await rm(path.join(root, '.next'), { force: true, recursive: true })
console.log('[clean-next-cache] removed .next')

const child = spawn(process.execPath, [nextBin, 'dev', ...extraArgs], {
  cwd: root,
  env: process.env,
  stdio: ['inherit', 'pipe', 'pipe'],
})

let warmed = false
const port = parsePort(extraArgs)

const maybeWarm = (chunk) => {
  if (warmed) return

  const text = chunk.toString()

  if (text.includes('✓ Ready')) {
    warmed = true
    warmAdmin(port).catch((error) => {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[dev-warmup] ${message}`)
    })
  }
}

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
  maybeWarm(chunk)
})

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk)
  maybeWarm(chunk)
})

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal)
  }
}

process.on('SIGINT', () => forwardSignal('SIGINT'))
process.on('SIGTERM', () => forwardSignal('SIGTERM'))

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
