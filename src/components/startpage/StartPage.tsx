import { WALLPAPER_META, type WallpaperId } from '../../types/customization'
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

const DARK_WALLPAPERS = new Set<WallpaperId>(['aurora', 'orb', 'night', 'mesh'])

export function StartPage() {
  const settings = useQwStore((s) => s.settings)
  const theme = useQwStore((s) => s.resolvedTheme)
  const navigate = useQwStore((s) => s.navigate)
  const wallpaper = WALLPAPER_META[settings.wallpaper]
  const onDarkArt =
    DARK_WALLPAPERS.has(settings.wallpaper) ||
    ((settings.wallpaper === 'none' || settings.wallpaper === 'solid') && theme === 'dark')

  const favorites = settings.favoriteShortcuts

  return (
    <div
      className="start-page clean"
      data-on-dark={onDarkArt ? 'true' : 'false'}
      style={{
        background:
          settings.wallpaper === 'none' ? 'var(--qw-bg)' : wallpaper.css,
      }}
    >
      {settings.showQwWordmark && settings.startPageContent !== 'wallpaper-only' && (
        <div className="wordmark">qw.</div>
      )}

      {settings.startPageContent === 'favorites' && (
        <div className="favorites">
          {favorites.length === 0 ? (
            <p className="empty-hint quiet">Your shortcuts will show up here</p>
          ) : (
            favorites.map((url) => (
              <button key={url} className="favorite" type="button" onClick={() => navigate(url)}>
                <div className="tile clean-tile">{letter(url)}</div>
                <span className="name">{hostLabel(url)}</span>
              </button>
            ))
          )}
        </div>
      )}

      {settings.startPageContent === 'suggestions' && (
        <p className="empty-hint quiet">Start typing to search</p>
      )}

      {settings.startPageContent === 'blank' && null}
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
