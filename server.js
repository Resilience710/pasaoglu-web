/**
 * Plesk Passenger (Phusion) — Node.js startup file
 * Plesk Node.js sekmesinde "Application startup file" alanına `server.js` yaz.
 *
 * Lokal `npm run start` ile aynı işi yapar ama Plesk Passenger'ın istediği
 * formatta (process.env.PORT'tan dinler, top-level await yok, vs.).
 */
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Request error', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error('Server failed to start', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Paşaoğlu Group ready on http://${hostname}:${port}`)
    })
})
