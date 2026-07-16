import { createServer } from 'node:http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DATA_FILE = join(DATA_DIR, 'extensions.json')
const PORT = Number(process.env.QW_API_PORT || 8787)
const ADMIN_KEY = process.env.QW_ADMIN_KEY || 'qw-dev'

/** @typedef {{
 *  id: string
 *  title: string
 *  description: string
 *  glyph: string
 *  author: string
 *  email: string
 *  effect: string
 *  status: 'pending' | 'approved' | 'rejected'
 *  submittedAt: string
 *  reviewedAt?: string
 *  reviewNote?: string
 * }} ExtRecord */

const BUILTIN = [
  {
    id: 'focus-mode',
    title: 'Focus',
    description: 'Hide share & bookmark buttons while browsing',
    glyph: '◎',
    author: 'qw',
    email: 'team@qw.app',
    effect: 'focus-mode',
    status: 'approved',
    submittedAt: '2026-01-01T00:00:00.000Z',
    reviewedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'night-tint',
    title: 'Night Tint',
    description: 'Warm amber wash over pages after dark',
    glyph: '☾',
    author: 'qw',
    email: 'team@qw.app',
    effect: 'night-tint',
    status: 'approved',
    submittedAt: '2026-01-01T00:00:00.000Z',
    reviewedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'compact-bar',
    title: 'Compact Bar',
    description: 'Tighter chrome padding on the bottom bar',
    glyph: '═',
    author: 'qw',
    email: 'team@qw.app',
    effect: 'compact-bar',
    status: 'approved',
    submittedAt: '2026-01-01T00:00:00.000Z',
    reviewedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'speed-dial',
    title: 'Speed Dial',
    description: 'Force favorites on the start page',
    glyph: '⌘',
    author: 'qw',
    email: 'team@qw.app',
    effect: 'speed-dial',
    status: 'approved',
    submittedAt: '2026-01-01T00:00:00.000Z',
    reviewedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'privacy-lock',
    title: 'Privacy Lock',
    description: 'Always show the HTTPS lock badge',
    glyph: '⌀',
    author: 'qw',
    email: 'team@qw.app',
    effect: 'privacy-lock',
    status: 'approved',
    submittedAt: '2026-01-01T00:00:00.000Z',
    reviewedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'quiet-start',
    title: 'Quiet Start',
    description: 'Hide the big app icon on start',
    glyph: '·',
    author: 'qw',
    email: 'team@qw.app',
    effect: 'quiet-start',
    status: 'approved',
    submittedAt: '2026-01-01T00:00:00.000Z',
    reviewedAt: '2026-01-01T00:00:00.000Z',
  },
]

function ensureData() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify({ extensions: BUILTIN }, null, 2))
  }
}

function load() {
  ensureData()
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return { extensions: [...BUILTIN] }
  }
}

function save(data) {
  ensureData()
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

function json(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function isAdmin(req) {
  const key = req.headers['x-admin-key']
  return typeof key === 'string' && key === ADMIN_KEY
}

const EFFECTS = [
  'focus-mode',
  'night-tint',
  'compact-bar',
  'speed-dial',
  'privacy-lock',
  'quiet-start',
  'none',
]

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const path = url.pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    })
    res.end()
    return
  }

  try {
    // Public: approved catalog for the mobile store
    if (req.method === 'GET' && path === '/api/extensions') {
      const data = load()
      const approved = data.extensions
        .filter((e) => e.status === 'approved')
        .map(({ email: _e, ...rest }) => rest)
      json(res, 200, { extensions: approved, online: true })
      return
    }

    // Public: check submission status by email
    if (req.method === 'GET' && path === '/api/extensions/mine') {
      const email = (url.searchParams.get('email') || '').trim().toLowerCase()
      if (!email) {
        json(res, 400, { error: 'email required' })
        return
      }
      const data = load()
      const mine = data.extensions
        .filter((e) => e.email.toLowerCase() === email)
        .map(({ email: _e, ...rest }) => rest)
      json(res, 200, { extensions: mine })
      return
    }

    // Public: submit for review
    if (req.method === 'POST' && path === '/api/extensions/submit') {
      const body = await readBody(req)
      const title = String(body.title || '').trim()
      const description = String(body.description || '').trim()
      const glyph = String(body.glyph || '◆').trim().slice(0, 2) || '◆'
      const author = String(body.author || '').trim()
      const email = String(body.email || '').trim().toLowerCase()
      const effect = String(body.effect || 'none')

      if (!title || title.length < 2) {
        json(res, 400, { error: 'Title is required' })
        return
      }
      if (!description || description.length < 8) {
        json(res, 400, { error: 'Description must be at least 8 characters' })
        return
      }
      if (!author) {
        json(res, 400, { error: 'Author name is required' })
        return
      }
      if (!email || !email.includes('@')) {
        json(res, 400, { error: 'Valid email is required' })
        return
      }
      if (!EFFECTS.includes(effect)) {
        json(res, 400, { error: 'Invalid effect' })
        return
      }

      const data = load()
      const id = `${slugify(title) || 'ext'}-${randomBytes(3).toString('hex')}`
      /** @type {ExtRecord} */
      const record = {
        id,
        title,
        description,
        glyph,
        author,
        email,
        effect,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      }
      data.extensions.push(record)
      save(data)
      json(res, 201, {
        ok: true,
        id,
        status: 'pending',
        message: 'Submitted for review. Check status with your email.',
      })
      return
    }

    // Admin: list all / pending
    if (req.method === 'GET' && path === '/api/admin/extensions') {
      if (!isAdmin(req)) {
        json(res, 401, { error: 'Unauthorized' })
        return
      }
      const data = load()
      const status = url.searchParams.get('status')
      const list = status
        ? data.extensions.filter((e) => e.status === status)
        : data.extensions
      json(res, 200, { extensions: list })
      return
    }

    // Admin: approve / reject
    if (req.method === 'POST' && path.startsWith('/api/admin/extensions/')) {
      if (!isAdmin(req)) {
        json(res, 401, { error: 'Unauthorized' })
        return
      }
      const parts = path.split('/')
      const id = parts[4]
      const action = parts[5] // approve | reject
      if (!id || !['approve', 'reject'].includes(action)) {
        json(res, 404, { error: 'Not found' })
        return
      }
      const body = await readBody(req).catch(() => ({}))
      const data = load()
      const ext = data.extensions.find((e) => e.id === id)
      if (!ext) {
        json(res, 404, { error: 'Extension not found' })
        return
      }
      ext.status = action === 'approve' ? 'approved' : 'rejected'
      ext.reviewedAt = new Date().toISOString()
      if (body.note) ext.reviewNote = String(body.note).slice(0, 200)
      save(data)
      json(res, 200, { ok: true, extension: ext })
      return
    }

    if (req.method === 'GET' && path === '/api/health') {
      json(res, 200, { ok: true, adminHint: 'Set X-Admin-Key header' })
      return
    }

    json(res, 404, { error: 'Not found' })
  } catch (err) {
    console.error(err)
    json(res, 500, { error: 'Server error' })
  }
})

ensureData()
server.listen(PORT, () => {
  console.log(`qw extensions API on http://localhost:${PORT}`)
  console.log(`Admin key: ${ADMIN_KEY}`)
})
