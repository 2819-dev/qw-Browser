import { WALLPAPER_META } from '../../types/customization'
import { useQwStore } from '../../store/qwStore'

function hostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function letter(url: string) {
  return hostLabel(url).charAt(0).toUpperCase()
}

const TILE_COLORS = ['#0A84FF', '#5E5CE6', '#BF5AF2', '#FF375F', '#FF9F0A', '#30D158', '#64D2FF', '#FF6482']

export function StartPage() {
  const settings = useQwStore((s) => s.settings)
  const navigate = useQwStore((s) => s.navigate)
  const wallpaper = WALLPAPER_META[settings.wallpaper]

  return (
    <div
      className="start-page"
      style={{
        background: wallpaper.css,
      }}
    >
      {settings.showQwWordmark && settings.startPageContent !== 'wallpaper-only' && (
        <div className="wordmark">qw</div>
      )}

      {settings.startPageContent === 'favorites' && (
        <div className="favorites">
          {settings.favoriteShortcuts.map((url, i) => (
            <button key={url} className="favorite" type="button" onClick={() => navigate(url)}>
              <div className="tile glass" style={{ background: TILE_COLORS[i % TILE_COLORS.length] }}>
                {letter(url)}
              </div>
              <span className="name">{hostLabel(url)}</span>
            </button>
          ))}
        </div>
      )}

      {settings.startPageContent === 'suggestions' && (
        <div style={{ width: 'min(100%, 340px)' }}>
          <div className="glass glass-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--qw-fg-secondary)', marginBottom: 10 }}>
              Suggestions
            </div>
            {['apple.com', 'news', 'weather', 'wikipedia'].map((q) => (
              <button
                key={q}
                type="button"
                className="settings-row"
                style={{ borderRadius: 12, marginBottom: 6 }}
                onClick={() => navigate(q)}
              >
                <strong style={{ fontSize: 15 }}>{q}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {settings.startPageContent === 'blank' && (
        <p className="empty-hint">Type above to search the web</p>
      )}
    </div>
  )
}

export function LoadingOverlay() {
  const loading = useQwStore((s) => s.activeTab().loading)
  const icon = useQwStore((s) => s.settings.loadingIcon)
  if (!loading) return null

  return (
    <div className="loading-overlay" aria-hidden>
      {icon === 'qw' && <div className="loader-qw" />}
      {icon === 'spinner' && <div className="loader-spinner" />}
      {icon === 'dots' && (
        <div className="loader-dots">
          <i />
          <i />
          <i />
        </div>
      )}
      {icon === 'pulse' && <div className="loader-pulse" />}
      {icon === 'ring' && <div className="loader-ring" />}
      {icon === 'bars' && (
        <div className="loader-bars">
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  )
}
