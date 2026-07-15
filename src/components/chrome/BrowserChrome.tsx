import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Share,
  Bookmark,
  Settings,
  Home,
  Lock,
  X,
  Layers,
} from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import clsx from 'clsx'
import { Glass, GlassButton } from '../glass/Glass'
import { useQwStore } from '../../store/qwStore'
import type { ChromeLayout, SearchBarStyle } from '../../types/customization'

function displayUrl(url: string) {
  if (url === 'qw://start') return ''
  try {
    const u = new URL(url)
    return u.host + (u.pathname === '/' ? '' : u.pathname) + u.search
  } catch {
    return url
  }
}

export function SearchBar({
  style,
  compact,
  inBlob,
}: {
  style: SearchBarStyle
  compact?: boolean
  inBlob?: boolean
}) {
  const tab = useQwStore((s) => s.activeTab())
  const navigate = useQwStore((s) => s.navigate)
  const settings = useQwStore((s) => s.settings)
  const [value, setValue] = useState(displayUrl(tab.url))

  useEffect(() => {
    setValue(displayUrl(tab.url))
  }, [tab.url, tab.id])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate(value || 'qw://start')
  }

  return (
    <form
      className={clsx(
        'search-bar',
        !inBlob && 'glass glass-pill',
        `style-${style}`,
        compact && 'compact',
      )}
      onSubmit={onSubmit}
    >
      {settings.showHttpsBadge && tab.url.startsWith('https') && (
        <Lock size={13} strokeWidth={2.4} color="var(--qw-accent)" />
      )}
      {tab.url === 'qw://start' && !value && (
        <span className="https-badge" style={{ marginRight: 2 }}>
          qw
        </span>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search or enter address"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Address bar"
      />
      {value && (
        <GlassButton
          type="button"
          aria-label="Clear"
          onClick={() => setValue('')}
          style={{ minWidth: 28, minHeight: 28 }}
        >
          <X size={14} />
        </GlassButton>
      )}
    </form>
  )
}

export function ControlsBar({
  inBlob,
  hideSearchAdjacent,
}: {
  inBlob?: boolean
  hideSearchAdjacent?: boolean
}) {
  const tab = useQwStore((s) => s.activeTab())
  const settings = useQwStore((s) => s.settings)
  const c = settings.controls
  const goBack = useQwStore((s) => s.goBack)
  const goForward = useQwStore((s) => s.goForward)
  const reload = useQwStore((s) => s.reload)
  const goHome = useQwStore((s) => s.goHome)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const tabs = useQwStore((s) => s.tabs)

  void hideSearchAdjacent

  return (
    <div className={clsx('controls-row', !inBlob && 'glass glass-blob')} style={inBlob ? undefined : { padding: '6px 8px' }}>
      {c.back && (
        <GlassButton aria-label="Back" disabled={!tab.canGoBack} onClick={goBack}>
          <ArrowLeft size={20} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.forward && (
        <GlassButton aria-label="Forward" disabled={!tab.canGoForward} onClick={goForward}>
          <ArrowRight size={20} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.reload && (
        <GlassButton aria-label="Reload" onClick={reload}>
          <RotateCw size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.home && (
        <GlassButton aria-label="Home" onClick={goHome}>
          <Home size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      <div className="spacer" />
      {c.bookmarks && (
        <GlassButton aria-label="Bookmarks">
          <Bookmark size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.share && (
        <GlassButton aria-label="Share">
          <Share size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.tabs && (
        <GlassButton aria-label="Tabs" onClick={() => setShowTabs(true)}>
          <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center' }}>
            <Layers size={18} strokeWidth={2.1} />
            <span
              style={{
                position: 'absolute',
                fontSize: 9,
                fontWeight: 700,
                bottom: -1,
                right: -4,
              }}
            >
              {tabs.length}
            </span>
          </span>
        </GlassButton>
      )}
      {c.settings && (
        <GlassButton aria-label="Settings" onClick={() => setShowSettings(true)}>
          <Settings size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
    </div>
  )
}

function UnifiedBlob({ position }: { position: 'top' | 'bottom' }) {
  const style = useQwStore((s) => s.settings.searchBarStyle)
  return (
    <div className={`chrome-layer chrome-${position}`}>
      <Glass className="glass-blob unified-blob" strong>
        {position === 'top' ? (
          <>
            <SearchBar style={style} inBlob />
            <ControlsBar inBlob />
          </>
        ) : (
          <>
            <SearchBar style={style} inBlob />
            <ControlsBar inBlob />
          </>
        )}
      </Glass>
    </div>
  )
}

/** Floating access for layouts without a controls row */
function QuietAccess() {
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const tabs = useQwStore((s) => s.tabs)
  return (
    <div
      className="chrome-layer chrome-top"
      style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
    >
      <Glass className="glass-pill" style={{ display: 'flex', padding: 4, gap: 2 }}>
        <GlassButton aria-label="Tabs" onClick={() => setShowTabs(true)}>
          <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center' }}>
            <Layers size={18} strokeWidth={2.1} />
            <span style={{ position: 'absolute', fontSize: 9, fontWeight: 700, bottom: -1, right: -4 }}>
              {tabs.length}
            </span>
          </span>
        </GlassButton>
        <GlassButton aria-label="Settings" onClick={() => setShowSettings(true)}>
          <Settings size={18} strokeWidth={2.1} />
        </GlassButton>
      </Glass>
    </div>
  )
}

export function BrowserChrome() {
  const layout = useQwStore((s) => s.settings.chromeLayout) as ChromeLayout
  const style = useQwStore((s) => s.settings.searchBarStyle)

  switch (layout) {
    case 'safari':
      return (
        <>
          <div className="chrome-layer chrome-top">
            <SearchBar style={style} />
          </div>
          <div className="chrome-layer chrome-bottom">
            <ControlsBar />
          </div>
        </>
      )
    case 'quiche-bottom':
      return <UnifiedBlob position="bottom" />
    case 'quiche-top':
      return <UnifiedBlob position="top" />
    case 'inverted':
      return (
        <>
          <div className="chrome-layer chrome-top">
            <ControlsBar />
          </div>
          <div className="chrome-layer chrome-bottom">
            <SearchBar style={style} />
          </div>
        </>
      )
    case 'controls-top':
      return (
        <>
          <div className="chrome-layer chrome-top">
            <ControlsBar />
          </div>
          <div className="chrome-layer chrome-bottom">
            <SearchBar style={style} />
          </div>
        </>
      )
    case 'search-only':
      return (
        <>
          <QuietAccess />
          <div className="chrome-layer chrome-bottom">
            <SearchBar style={style} />
          </div>
        </>
      )
    case 'minimal':
      return (
        <>
          <QuietAccess />
          <div className="chrome-layer chrome-bottom" style={{ paddingLeft: 28, paddingRight: 28 }}>
            <SearchBar style={style} compact />
          </div>
        </>
      )
    default:
      return <UnifiedBlob position="bottom" />
  }
}

/** Content padding so pages aren't hidden under chrome */
export function useChromeInsets(layout: ChromeLayout) {
  switch (layout) {
    case 'safari':
      return { top: 72, bottom: 72 }
    case 'quiche-bottom':
      return { top: 12, bottom: 128 }
    case 'quiche-top':
      return { top: 128, bottom: 12 }
    case 'inverted':
    case 'controls-top':
      return { top: 72, bottom: 72 }
    case 'search-only':
      return { top: 12, bottom: 72 }
    case 'minimal':
      return { top: 12, bottom: 72 }
    default:
      return { top: 12, bottom: 128 }
  }
}
