import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useQwStore } from '../../store/qwStore'
import {
  BUILTIN_EXTENSIONS,
  fetchApprovedExtensions,
  type CatalogExtension,
} from '../../lib/extensionCatalog'

/** Online extension store — approved catalog from API, builtins offline. */
export function ExtensionsPage() {
  const settings = useQwStore((s) => s.settings)
  const extensionCatalog = useQwStore((s) => s.extensionCatalog)
  const setExtensionCatalog = useQwStore((s) => s.setExtensionCatalog)
  const toggleExtension = useQwStore((s) => s.toggleExtension)
  const unlockAchievement = useQwStore((s) => s.unlockAchievement)
  const installed = new Set(settings.installedExtensions)
  const [online, setOnline] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    unlockAchievement('store-visited')
  }, [unlockAchievement])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const { extensions, online: ok } = await fetchApprovedExtensions()
        if (cancelled) return
        setExtensionCatalog(extensions.length ? extensions : BUILTIN_EXTENSIONS)
        setOnline(ok)
      } catch {
        if (cancelled) return
        setExtensionCatalog(BUILTIN_EXTENSIONS)
        setOnline(false)
        setError('Offline — showing built-in extensions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setExtensionCatalog])

  const list: CatalogExtension[] =
    extensionCatalog.length > 0 ? extensionCatalog : BUILTIN_EXTENSIONS

  return (
    <div className="ext-page">
      <header className="games-hero games-hero-compact">
        <p className="games-kicker">qw://extensions</p>
        <h1>Extensions</h1>
        <p>
          {online === null
            ? 'Loading catalog…'
            : online
              ? `Online store · ${installed.size} installed`
              : `Offline catalog · ${installed.size} installed`}
        </p>
        {error && <p className="ext-status-hint">{error}</p>}
        {online && (
          <p className="ext-status-hint">
            Developers submit on a computer at /developer — listings appear after approval.
          </p>
        )}
      </header>

      {loading && list.length === 0 ? (
        <p className="ext-status-hint" style={{ padding: '0 4px' }}>
          Fetching approved extensions…
        </p>
      ) : (
        <div className="ext-list">
          {list.map((ext) => {
            const on = installed.has(ext.id)
            return (
              <div key={ext.id} className={clsx('ext-card glass glass-card', on && 'on')}>
                <div className="ext-icon" aria-hidden>
                  {ext.glyph}
                </div>
                <div className="ext-copy">
                  <strong>{ext.title}</strong>
                  <span>
                    {ext.description}
                    {ext.author && ext.author !== 'qw' ? ` · ${ext.author}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  className={clsx('ext-toggle', on && 'on')}
                  onClick={() => toggleExtension(ext.id)}
                  aria-pressed={on}
                >
                  {on ? 'On' : 'Get'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
