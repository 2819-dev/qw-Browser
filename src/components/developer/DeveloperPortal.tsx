import { useCallback, useEffect, useState } from 'react'

type ExtRecord = {
  id: string
  title: string
  description: string
  glyph: string
  author: string
  email?: string
  effect: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewNote?: string
}

const EFFECTS = [
  { id: 'none', label: 'None (listing only)' },
  { id: 'focus-mode', label: 'Focus — hide share/bookmarks' },
  { id: 'night-tint', label: 'Night Tint — warm page wash' },
  { id: 'compact-bar', label: 'Compact Bar — tighter chrome' },
  { id: 'speed-dial', label: 'Speed Dial — favorites on start' },
  { id: 'privacy-lock', label: 'Privacy Lock — always HTTPS badge' },
  { id: 'quiet-start', label: 'Quiet Start — hide start icon' },
]

const ADMIN_KEY_STORAGE = 'qw-dev-admin-key'

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data
}

export function DeveloperPortal() {
  const [tab, setTab] = useState<'submit' | 'status' | 'review'>('submit')
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.ok)
      .then(setOnline)
      .catch(() => setOnline(false))
  }, [])

  return (
    <div className="dev-portal">
      <header className="dev-header">
        <div>
          <p className="dev-kicker">qw Developer Portal</p>
          <h1>Extensions</h1>
          <p className="dev-sub">
            Submit on a computer. Reviewers approve before it appears in qw://extensions.
          </p>
        </div>
        <div className="dev-status-pill" data-on={online ? '1' : '0'}>
          {online === null ? 'Checking…' : online ? 'API online' : 'API offline — run npm run server'}
        </div>
      </header>

      <nav className="dev-tabs">
        <button type="button" className={tab === 'submit' ? 'on' : ''} onClick={() => setTab('submit')}>
          Submit
        </button>
        <button type="button" className={tab === 'status' ? 'on' : ''} onClick={() => setTab('status')}>
          My submissions
        </button>
        <button type="button" className={tab === 'review' ? 'on' : ''} onClick={() => setTab('review')}>
          Review
        </button>
      </nav>

      <main className="dev-main">
        {tab === 'submit' && <SubmitForm online={!!online} />}
        {tab === 'status' && <StatusPanel online={!!online} />}
        {tab === 'review' && <ReviewPanel online={!!online} />}
      </main>

      <footer className="dev-foot">
        <a href="/">← Back to qw</a>
        <span>Desktop only · Approval required</span>
      </footer>
    </div>
  )
}

function SubmitForm({ online }: { online: boolean }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [glyph, setGlyph] = useState('◆')
  const [author, setAuthor] = useState('')
  const [email, setEmail] = useState('')
  const [effect, setEffect] = useState('none')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setErr(null)
    if (!online) {
      setErr('API is offline. Start the server first.')
      return
    }
    setBusy(true)
    try {
      const data = await api('/api/extensions/submit', {
        method: 'POST',
        body: JSON.stringify({ title, description, glyph, author, email, effect }),
      })
      setMsg(`Submitted. ID ${data.id} — status: pending review.`)
      setTitle('')
      setDescription('')
      setGlyph('◆')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="dev-card" onSubmit={submit}>
      <h2>Submit an extension</h2>
      <p className="dev-hint">Your listing stays pending until a reviewer approves it.</p>

      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={48} />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          maxLength={240}
        />
      </label>
      <div className="dev-row">
        <label>
          Glyph
          <input value={glyph} onChange={(e) => setGlyph(e.target.value)} maxLength={2} />
        </label>
        <label>
          Effect hook
          <select value={effect} onChange={(e) => setEffect(e.target.value)}>
            {EFFECTS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="dev-row">
        <label>
          Author
          <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>
      </div>

      {msg && <p className="dev-ok">{msg}</p>}
      {err && <p className="dev-err">{err}</p>}

      <button type="submit" className="dev-primary" disabled={busy || !online}>
        {busy ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  )
}

function StatusPanel({ online }: { online: boolean }) {
  const [email, setEmail] = useState('')
  const [list, setList] = useState<ExtRecord[]>([])
  const [err, setErr] = useState<string | null>(null)

  const load = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!online) {
      setErr('API offline')
      return
    }
    try {
      const data = await api(`/api/extensions/mine?email=${encodeURIComponent(email)}`)
      setList(data.extensions || [])
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Failed')
    }
  }

  return (
    <div className="dev-card">
      <h2>My submissions</h2>
      <form className="dev-row" onSubmit={load}>
        <label style={{ flex: 1 }}>
          Email used at submit
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit" className="dev-primary" style={{ alignSelf: 'end' }} disabled={!online}>
          Check
        </button>
      </form>
      {err && <p className="dev-err">{err}</p>}
      <div className="dev-list">
        {list.length === 0 ? (
          <p className="dev-hint">No submissions for this email yet.</p>
        ) : (
          list.map((ext) => (
            <div key={ext.id} className="dev-list-row">
              <span className="dev-glyph">{ext.glyph}</span>
              <div>
                <strong>{ext.title}</strong>
                <p>{ext.description}</p>
              </div>
              <span className={`dev-badge ${ext.status}`}>{ext.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ReviewPanel({ online }: { online: boolean }) {
  const [key, setKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || '')
  const [pending, setPending] = useState<ExtRecord[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setErr(null)
    if (!online) {
      setErr('API offline')
      return
    }
    try {
      localStorage.setItem(ADMIN_KEY_STORAGE, key)
      const data = await api('/api/admin/extensions?status=pending', {
        headers: { 'X-Admin-Key': key },
      })
      setPending(data.extensions || [])
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Failed')
      setPending([])
    }
  }, [key, online])

  useEffect(() => {
    if (key && online) void load()
  }, [key, online, load])

  const act = async (id: string, action: 'approve' | 'reject') => {
    setMsg(null)
    setErr(null)
    try {
      await api(`/api/admin/extensions/${id}/${action}`, {
        method: 'POST',
        headers: { 'X-Admin-Key': key },
        body: JSON.stringify({}),
      })
      setMsg(action === 'approve' ? 'Approved — live in store' : 'Rejected')
      await load()
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Action failed')
    }
  }

  return (
    <div className="dev-card">
      <h2>Review queue</h2>
      <p className="dev-hint">Approve listings before they appear in qw://extensions.</p>
      <div className="dev-row">
        <label style={{ flex: 1 }}>
          Admin key
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="qw-dev"
          />
        </label>
        <button type="button" className="dev-primary" style={{ alignSelf: 'end' }} onClick={() => void load()}>
          Refresh
        </button>
      </div>
      {msg && <p className="dev-ok">{msg}</p>}
      {err && <p className="dev-err">{err}</p>}
      <div className="dev-list">
        {pending.length === 0 ? (
          <p className="dev-hint">No pending submissions.</p>
        ) : (
          pending.map((ext) => (
            <div key={ext.id} className="dev-list-row review">
              <span className="dev-glyph">{ext.glyph}</span>
              <div>
                <strong>{ext.title}</strong>
                <p>{ext.description}</p>
                <p className="dev-meta">
                  {ext.author} · {ext.email} · effect:{ext.effect}
                </p>
              </div>
              <div className="dev-actions">
                <button type="button" className="dev-approve" onClick={() => void act(ext.id, 'approve')}>
                  Approve
                </button>
                <button type="button" className="dev-reject" onClick={() => void act(ext.id, 'reject')}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
