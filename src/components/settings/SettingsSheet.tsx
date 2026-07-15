import clsx from 'clsx'
import { ChevronRight, X, Sparkles } from 'lucide-react'
import { Glass } from '../glass/Glass'
import { Toggle } from '../glass/Glass'
import { QwAppIcon, QwAppIconPair } from '../glass/QwAppIcon'
import { LayoutPicker } from '../chrome/LayoutPicker'
import { useQwStore } from '../../store/qwStore'
import {
  ACCENT_COLORS,
  WALLPAPER_META,
  ICON_FAMILIES,
  VISUAL_STYLES,
  type AccentName,
  type WallpaperId,
  type LoadingIcon,
  type SearchBarStyle,
  type GlassIntensity,
  type StartPageContent,
  type ThemeMode,
  type IconVariant,
  type VisualStyle,
} from '../../types/customization'

function SheetShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <Glass
        className="sheet glass-strong"
        strong
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <div className="sheet-handle" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>{title}</h2>
          <button type="button" className="glass-btn" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </Glass>
    </div>
  )
}

export function SettingsSheet() {
  const settings = useQwStore((s) => s.settings)
  const theme = useQwStore((s) => s.resolvedTheme)
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const setShowFullGuide = useQwStore((s) => s.setShowFullGuide)
  const setChromeLayout = useQwStore((s) => s.setChromeLayout)
  const setAccent = useQwStore((s) => s.setAccent)
  const setWallpaper = useQwStore((s) => s.setWallpaper)
  const setThemeMode = useQwStore((s) => s.setThemeMode)
  const setSearchBarStyle = useQwStore((s) => s.setSearchBarStyle)
  const setGlassIntensity = useQwStore((s) => s.setGlassIntensity)
  const setLoadingIcon = useQwStore((s) => s.setLoadingIcon)
  const setAppIcon = useQwStore((s) => s.setAppIcon)
  const setVisualStyle = useQwStore((s) => s.setVisualStyle)
  const setStartPageContent = useQwStore((s) => s.setStartPageContent)
  const setControl = useQwStore((s) => s.setControl)
  const setSetting = useQwStore((s) => s.setSetting)
  const resetSettings = useQwStore((s) => s.resetSettings)

  return (
    <SheetShell title="Settings" onClose={() => setShowSettings(false)}>
      <button
        type="button"
        className="glass glass-card"
        style={{
          width: '100%',
          marginTop: 12,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          textAlign: 'left',
          background: 'linear-gradient(135deg, var(--qw-accent-soft), transparent)',
          border: '1px solid color-mix(in srgb, var(--qw-accent) 35%, transparent)',
        }}
        onClick={() => {
          setShowSettings(false)
          setShowFullGuide(true)
        }}
      >
        <Sparkles size={22} color="var(--qw-accent)" />
        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', fontSize: 16, letterSpacing: '-0.02em' }}>
            Full Customization Guide
          </strong>
          <span style={{ fontSize: 13, color: 'var(--qw-fg-secondary)' }}>
            Walk through every option — icons to loaders
          </span>
        </div>
        <ChevronRight size={18} color="var(--qw-fg-tertiary)" />
      </button>

      <div className="section-label">Bars & buttons</div>
      <LayoutPicker
        value={settings.chromeLayout}
        onChange={setChromeLayout}
        compact
      />

      <div className="section-label">Visual style</div>
      <div className="style-pick-list">
        {(Object.keys(VISUAL_STYLES) as VisualStyle[]).map((key) => (
          <button
            key={key}
            type="button"
            className={clsx(
              'style-pick-card',
              `preview-${key}`,
              settings.visualStyle === key && 'selected',
            )}
            onClick={() => setVisualStyle(key)}
          >
            <div className="style-pick-swatch" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="style-pick-copy">
              <strong>{VISUAL_STYLES[key].title}</strong>
              <span>{VISUAL_STYLES[key].subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="section-label">Search bar</div>
      <div className="chip-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {(['capsule', 'pill', 'rounded', 'square'] as SearchBarStyle[]).map((s) => (
          <button
            key={s}
            type="button"
            className={clsx('choice-card', settings.searchBarStyle === s && 'selected')}
            style={{ minHeight: 56 }}
            onClick={() => setSearchBarStyle(s)}
          >
            <strong style={{ textTransform: 'capitalize', fontSize: 13 }}>{s}</strong>
          </button>
        ))}
      </div>

      <div className="section-label">Buttons</div>
      <div className="settings-group">
        {(Object.keys(settings.controls) as (keyof typeof settings.controls)[]).map((key) => (
          <div key={key} className="settings-row">
            <div className="label">
              <strong style={{ textTransform: 'capitalize' }}>{key}</strong>
            </div>
            <Toggle on={settings.controls[key]} onChange={(v) => setControl(key, v)} label={key} />
          </div>
        ))}
      </div>

      <div className="section-label">Appearance</div>
      <div className="settings-group">
        <div className="settings-row">
          <div className="label">
            <strong>Theme</strong>
            <span>System follows your device</span>
          </div>
          <select
            value={settings.themeMode}
            onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
            style={{
              background: 'transparent',
              border: '1px solid var(--qw-hairline)',
              borderRadius: 10,
              padding: '6px 8px',
              color: 'var(--qw-fg)',
            }}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="label">
            <strong>Glass</strong>
            <span>Blur intensity</span>
          </div>
          <select
            value={settings.glassIntensity}
            onChange={(e) => setGlassIntensity(e.target.value as GlassIntensity)}
            style={{
              background: 'transparent',
              border: '1px solid var(--qw-hairline)',
              borderRadius: 10,
              padding: '6px 8px',
              color: 'var(--qw-fg)',
            }}
          >
            <option value="subtle">Subtle</option>
            <option value="medium">Medium</option>
            <option value="strong">Strong</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
        {(Object.keys(ACCENT_COLORS) as AccentName[]).map((a) => (
          <button
            key={a}
            type="button"
            className={clsx('accent-swatch', settings.accent === a && 'selected')}
            style={{ background: ACCENT_COLORS[a] }}
            aria-label={a}
            onClick={() => setAccent(a)}
          />
        ))}
      </div>

      <div className="section-label">App icon</div>
      <p style={{ fontSize: 12, color: 'var(--qw-fg-secondary)', margin: '0 0 10px' }}>
        Changes the icon inside qw right away. Light/dark swap with theme.
      </p>
      <div className="icon-family-grid">
        {(Object.keys(ICON_FAMILIES) as IconVariant[]).map((v) => (
          <button
            key={v}
            type="button"
            className={clsx('icon-family-card', settings.appIcon === v && 'selected')}
            onClick={() => setAppIcon(v)}
            aria-label={ICON_FAMILIES[v].title}
            title={ICON_FAMILIES[v].title}
          >
            <QwAppIconPair variant={v} size={40} />
            <strong>
              {ICON_FAMILIES[v].title}
              {ICON_FAMILIES[v].pro ? <span className="pro-badge">PRO</span> : null}
            </strong>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <QwAppIcon variant={settings.appIcon} theme={theme} size={64} />
        <div>
          <strong style={{ display: 'block', fontSize: 14 }}>
            {ICON_FAMILIES[settings.appIcon].title}
          </strong>
          <p className="icon-apply-note">
            Used on the start page, search bar, and tab icon. Home Screen icons update after you
            remove & Add to Home Screen again.
          </p>
        </div>
      </div>

      <div className="section-label">Start page</div>
      <div className="chip-grid">
        {(['blank', 'favorites', 'suggestions', 'wallpaper-only'] as StartPageContent[]).map(
          (c) => (
            <button
              key={c}
              type="button"
              className={clsx('choice-card', settings.startPageContent === c && 'selected')}
              style={{ minHeight: 64 }}
              onClick={() => setStartPageContent(c)}
            >
              <strong style={{ textTransform: 'capitalize' }}>{c.replace('-', ' ')}</strong>
            </button>
          ),
        )}
      </div>

      <div className="section-label">Wallpaper</div>
      <div className="chip-grid three">
        {(Object.keys(WALLPAPER_META) as WallpaperId[]).map((w) => (
          <button
            key={w}
            type="button"
            className={clsx('wallpaper-swatch', settings.wallpaper === w && 'selected')}
            style={{ background: WALLPAPER_META[w].css }}
            aria-label={WALLPAPER_META[w].title}
            onClick={() => setWallpaper(w)}
          />
        ))}
      </div>

      <div className="section-label">Loading</div>
      <div className="chip-grid three">
        {(['qw', 'spinner', 'dots', 'pulse', 'ring', 'bars'] as LoadingIcon[]).map((icon) => (
          <button
            key={icon}
            type="button"
            className={clsx('choice-card', settings.loadingIcon === icon && 'selected')}
            style={{ minHeight: 64 }}
            onClick={() => setLoadingIcon(icon)}
          >
            <strong style={{ textTransform: 'capitalize' }}>{icon}</strong>
          </button>
        ))}
      </div>

      <div className="section-label">Search & behavior</div>
      <div className="settings-group">
        <div className="settings-row">
          <div className="label">
            <strong>Search engine</strong>
          </div>
          <select
            value={settings.searchEngine}
            onChange={(e) =>
              setSetting('searchEngine', e.target.value as typeof settings.searchEngine)
            }
            style={{
              background: 'transparent',
              border: '1px solid var(--qw-hairline)',
              borderRadius: 10,
              padding: '6px 8px',
              color: 'var(--qw-fg)',
            }}
          >
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="google">Google</option>
            <option value="bing">Bing</option>
            <option value="ecosia">Ecosia</option>
            <option value="brave">Brave</option>
          </select>
        </div>
        <div className="settings-row">
          <div className="label">
            <strong>Show HTTPS badge</strong>
          </div>
          <Toggle
            on={settings.showHttpsBadge}
            onChange={(v) => setSetting('showHttpsBadge', v)}
          />
        </div>
        <div className="settings-row">
          <div className="label">
            <strong>Show app icon</strong>
            <span>Big icon on the start page</span>
          </div>
          <Toggle
            on={settings.showQwWordmark}
            onChange={(v) => setSetting('showQwWordmark', v)}
          />
        </div>
        <div className="settings-row">
          <div className="label">
            <strong>Haptics</strong>
            <span>When available on device</span>
          </div>
          <Toggle on={settings.haptics} onChange={(v) => setSetting('haptics', v)} />
        </div>
        <div className="settings-row">
          <div className="label">
            <strong>Reduce motion</strong>
            <span>Turn off animations</span>
          </div>
          <Toggle
            on={settings.reduceMotion}
            onChange={(v) => setSetting('reduceMotion', v)}
          />
        </div>
      </div>

      <div className="section-label">Reset</div>
      <div className="settings-group">
        <button type="button" className="settings-row" onClick={resetSettings}>
          <div className="label">
            <strong>Reset customization</strong>
            <span>Keeps you signed in to qw prefs defaults</span>
          </div>
          <ChevronRight size={16} color="var(--qw-fg-tertiary)" />
        </button>
      </div>
    </SheetShell>
  )
}

export function TabsSheet() {
  const tabs = useQwStore((s) => s.tabs)
  const activeTabId = useQwStore((s) => s.activeTabId)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const setActiveTab = useQwStore((s) => s.setActiveTab)
  const closeTab = useQwStore((s) => s.closeTab)
  const createTab = useQwStore((s) => s.createTab)

  return (
    <SheetShell title="Tabs" onClose={() => setShowTabs(false)}>
      <div className="tabs-grid" style={{ marginTop: 12 }}>
        {tabs.map((t) => (
          <div
            key={t.id}
            className={clsx('tab-card', t.id === activeTabId && 'active')}
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab(t.id)}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab(t.id)}
          >
            <div className="preview" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="meta" style={{ flex: 1 }}>
                {t.title}
              </div>
              <button
                type="button"
                className="glass-btn"
                aria-label="Close tab"
                style={{ minWidth: 28, minHeight: 28 }}
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(t.id)
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="glass-btn accent"
        style={{ width: '100%', marginTop: 16, height: 48, borderRadius: 14 }}
        onClick={() => createTab()}
      >
        New Tab
      </button>
    </SheetShell>
  )
}
