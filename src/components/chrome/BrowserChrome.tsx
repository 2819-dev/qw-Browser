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
import { QwAppIcon } from '../glass/QwAppIcon'
import { useQwStore } from '../../store/qwStore'
import type { ChromeLayout, SearchBarStyle } from '../../types/customization'

function haptic() {
  const on = useQwStore.getState().settings.haptics
  if (!on) return
  try {
    navigator.vibrate?.(10)
  } catch {
    /* ignore */
  }
}

function displayUrl(url: string) {
  if (url === 'qw://start') return ''
  if (url.startsWith('qw://')) return url
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
  const theme = useQwStore((s) => s.resolvedTheme)
  const [value, setValue] = useState(displayUrl(tab.url))

  useEffect(() => {
    setValue(displayUrl(tab.url))
  }, [tab.url, tab.id])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    haptic()
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
      data-tour="tour-search"
      onSubmit={onSubmit}
    >
      {(settings.showHttpsBadge ||
        settings.installedExtensions.includes('privacy-lock')) &&
        tab.url.startsWith('https') && (
        <Lock size={13} strokeWidth={2.4} color="var(--qw-accent)" />
      )}
      {tab.url === 'qw://start' && !value && (
        <QwAppIcon
          variant={settings.appIcon}
          theme={theme}
          size={18}
          className="search-app-icon"
          alt=""
        />
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

export function ControlsBar({ inBlob }: { inBlob?: boolean }) {
  const tab = useQwStore((s) => s.activeTab())
  const settings = useQwStore((s) => s.settings)
  const showTour = useQwStore((s) => s.showTour)
  const c = settings.controls
  const focus = settings.installedExtensions.includes('focus-mode')
  const goBack = useQwStore((s) => s.goBack)
  const goForward = useQwStore((s) => s.goForward)
  const reload = useQwStore((s) => s.reload)
  const goHome = useQwStore((s) => s.goHome)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const tabs = useQwStore((s) => s.tabs)

  const press = (fn: () => void) => () => {
    haptic()
    fn()
  }

  return (
    <div
      className={clsx('controls-row', !inBlob && 'glass glass-blob')}
      style={inBlob ? undefined : { padding: '4px 6px' }}
    >
      {c.back && (
        <GlassButton
          aria-label="Back"
          data-tour="tour-back"
          disabled={!tab.canGoBack && !showTour}
          onClick={press(goBack)}
        >
          <ArrowLeft size={20} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.forward && (
        <GlassButton
          aria-label="Forward"
          data-tour="tour-forward"
          disabled={!tab.canGoForward}
          onClick={press(goForward)}
        >
          <ArrowRight size={20} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.reload && (
        <GlassButton aria-label="Reload" data-tour="tour-reload" onClick={press(reload)}>
          <RotateCw size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.home && (
        <GlassButton aria-label="Home" data-tour="tour-home" onClick={press(goHome)}>
          <Home size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      <div className="spacer" />
      {c.bookmarks && !focus && (
        <GlassButton
          aria-label="Bookmark"
          onClick={() => {
            haptic()
            useQwStore.getState().toggleBookmark()
          }}
          style={{
            color: settings.favoriteShortcuts.includes(tab.url)
              ? 'var(--qw-accent)'
              : undefined,
          }}
        >
          <Bookmark
            size={18}
            strokeWidth={2.1}
            fill={settings.favoriteShortcuts.includes(tab.url) ? 'currentColor' : 'none'}
          />
        </GlassButton>
      )}
      {c.share && !focus && (
        <GlassButton
          aria-label="Share"
          onClick={() => {
            haptic()
            if (navigator.share) {
              void navigator.share({ url: tab.url, title: tab.title }).catch(() => undefined)
            }
          }}
        >
          <Share size={18} strokeWidth={2.1} />
        </GlassButton>
      )}
      {c.tabs && (
        <GlassButton
          aria-label="Tabs"
          data-tour="tour-tabs"
          onClick={press(() => setShowTabs(true))}
        >
          <span className="tab-badge-wrap">
            <Layers size={18} strokeWidth={2.1} />
            <span className="tab-badge">{tabs.length}</span>
          </span>
        </GlassButton>
      )}
      <GlassButton
        aria-label="Settings"
        data-tour="tour-settings"
        onClick={press(() => setShowSettings(true))}
      >
        <Settings size={18} strokeWidth={2.1} />
      </GlassButton>
    </div>
  )
}

function UnifiedBlob({ position }: { position: 'top' | 'bottom' }) {
  const style = useQwStore((s) => s.settings.searchBarStyle)
  return (
    <div className={`chrome-layer chrome-${position}`}>
      <Glass className="glass-blob unified-blob" strong>
        <SearchBar style={style} inBlob />
        <ControlsBar inBlob />
      </Glass>
    </div>
  )
}

function QuietAccess() {
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const tabs = useQwStore((s) => s.tabs)
  const settings = useQwStore((s) => s.settings)
  const showTabs = settings.controls.tabs
  // Settings is always available
  return (
    <div className="chrome-layer chrome-top quiet-access">
      <Glass className="glass-pill quiet-pill">
        {showTabs && (
          <GlassButton
            aria-label="Tabs"
            data-tour="tour-tabs"
            onClick={() => {
              haptic()
              setShowTabs(true)
            }}
          >
            <span className="tab-badge-wrap">
              <Layers size={18} strokeWidth={2.1} />
              <span className="tab-badge">{tabs.length}</span>
            </span>
          </GlassButton>
        )}
        <GlassButton
          aria-label="Settings"
          data-tour="tour-settings"
          onClick={() => {
            haptic()
            setShowSettings(true)
          }}
        >
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
          <div className="chrome-layer chrome-bottom chrome-minimal">
            <SearchBar style={style} compact />
          </div>
        </>
      )
    default:
      return <UnifiedBlob position="bottom" />
  }
}

export function useChromeInsets(layout: ChromeLayout) {
  const c = chromeClearance(layout)
  // Legacy px helpers — prefer chromeClearance CSS lengths
  return {
    top: layout === 'quiche-bottom' || layout === 'minimal' || layout === 'search-only' ? 12 : 56,
    bottom: layout === 'quiche-top' ? 12 : 110,
    css: c,
  }
}

/**
 * Clearance for page content so it sits between chrome bars.
 * Safe-area is included once here (chrome layers also use safe-area for their own padding).
 * Values match actual chrome footprint — not double-counted.
 */
export function chromeClearance(layout: ChromeLayout): { top: string; bottom: string } {
  // Chrome body heights (edge + control surface), safe-area added once
  const bottomBlob = 'calc(112px + var(--qw-safe-bottom))'
  const topBlob = 'calc(112px + var(--qw-safe-top))'
  const singleBar = 'calc(56px + var(--qw-safe-bottom))'
  const singleBarTop = 'calc(56px + var(--qw-safe-top))'
  const statusOnly = 'calc(8px + var(--qw-safe-top))'
  const homeOnly = 'calc(8px + var(--qw-safe-bottom))'

  switch (layout) {
    case 'safari':
      return { top: singleBarTop, bottom: singleBar }
    case 'quiche-bottom':
      return { top: statusOnly, bottom: bottomBlob }
    case 'quiche-top':
      return { top: topBlob, bottom: homeOnly }
    case 'inverted':
    case 'controls-top':
      return { top: singleBarTop, bottom: singleBar }
    case 'search-only':
      return { top: 'calc(52px + var(--qw-safe-top))', bottom: singleBar }
    case 'minimal':
      return { top: 'calc(52px + var(--qw-safe-top))', bottom: 'calc(52px + var(--qw-safe-bottom))' }
    default:
      return { top: statusOnly, bottom: bottomBlob }
  }
}
