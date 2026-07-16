import { WALLPAPER_META, type WallpaperId } from '../../types/customization'
import { useQwStore } from '../../store/qwStore'
import { hasExtensionEffect } from '../../lib/extensionCatalog'
import { QwAppIcon } from '../glass/QwAppIcon'

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
  const catalog = useQwStore((s) => s.extensionCatalog)
  const theme = useQwStore((s) => s.resolvedTheme)
  const navigate = useQwStore((s) => s.navigate)
  const wallpaper = WALLPAPER_META[settings.wallpaper]
  const onDarkArt =
    DARK_WALLPAPERS.has(settings.wallpaper) ||
    ((settings.wallpaper === 'none' || settings.wallpaper === 'solid') && theme === 'dark')

  const favorites = settings.favoriteShortcuts
  const showIcon =
    settings.showQwWordmark &&
    !hasExtensionEffect(settings.installedExtensions, catalog, 'quiet-start')
  const content =
    hasExtensionEffect(settings.installedExtensions, catalog, 'speed-dial') &&
    settings.startPageContent === 'blank'
      ? 'favorites'
      : settings.startPageContent

  return (
    <div
      className="start-page clean"
      data-on-dark={onDarkArt ? 'true' : 'false'}
      style={{
        background: settings.wallpaper === 'none' ? undefined : wallpaper.css,
      }}
    >
      {showIcon && content !== 'wallpaper-only' && (
        <div className="brand-mark">
          <QwAppIcon
            variant={settings.appIcon}
            theme={theme}
            size={64}
            className="brand-app-icon"
            alt="qw"
          />
        </div>
      )}

      {content === 'favorites' && (
        <div className="favorites">
          {favorites.length === 0 ? (
            <p className="empty-hint quiet">Bookmarks appear here</p>
          ) : (
            favorites.map((url) => (
              <button
                key={url}
                className="favorite"
                type="button"
                onClick={() => {
                  if (settings.openLinksInNewTab) {
                    useQwStore.getState().createTab(url)
                  } else {
                    navigate(url)
                  }
                }}
              >
                <div className="tile clean-tile">{letter(url)}</div>
                <span className="name">{hostLabel(url)}</span>
              </button>
            ))
          )}
        </div>
      )}

      {content === 'suggestions' && <p className="empty-hint quiet">Start typing to search</p>}

      <div className="start-links">
        <button type="button" className="games-entry" onClick={() => navigate('qw://games')}>
          games
        </button>
        <button type="button" className="games-entry" onClick={() => navigate('qw://extensions')}>
          extensions
        </button>
      </div>
    </div>
  )
}

export function LoadingOverlay() {
  const loading = useQwStore((s) => s.activeTab().loading)
  const icon = useQwStore((s) => s.settings.loadingIcon)
  const appIcon = useQwStore((s) => s.settings.appIcon)
  const theme = useQwStore((s) => s.resolvedTheme)
  if (!loading) return null

  return (
    <div className="loading-overlay" aria-hidden>
      {icon === 'qw' && (
        <div className="loader-app-icon">
          <QwAppIcon variant={appIcon} theme={theme} size={36} alt="" />
        </div>
      )}
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
