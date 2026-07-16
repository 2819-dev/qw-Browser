import { useEffect } from 'react'
import clsx from 'clsx'
import { useQwStore } from '../../store/qwStore'
import {
  EXTENSION_CATALOG,
  type ExtensionId,
} from '../../types/customization'

/** Offline extension store — chrome-level features, no network */
export function ExtensionsPage() {
  const settings = useQwStore((s) => s.settings)
  const toggleExtension = useQwStore((s) => s.toggleExtension)
  const unlockAchievement = useQwStore((s) => s.unlockAchievement)
  const installed = new Set(settings.installedExtensions)

  useEffect(() => {
    unlockAchievement('store-visited')
  }, [unlockAchievement])

  return (
    <div className="ext-page">
      <header className="games-hero games-hero-compact">
        <p className="games-kicker">qw://extensions</p>
        <h1>Extensions</h1>
        <p>Offline store · {installed.size} installed</p>
      </header>

      <div className="ext-list">
        {EXTENSION_CATALOG.map((ext) => {
          const on = installed.has(ext.id)
          return (
            <div key={ext.id} className={clsx('ext-card glass glass-card', on && 'on')}>
              <div className="ext-icon" aria-hidden>
                {ext.glyph}
              </div>
              <div className="ext-copy">
                <strong>{ext.title}</strong>
                <span>{ext.description}</span>
              </div>
              <button
                type="button"
                className={clsx('ext-toggle', on && 'on')}
                onClick={() => toggleExtension(ext.id as ExtensionId)}
                aria-pressed={on}
              >
                {on ? 'On' : 'Get'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
