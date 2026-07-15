import { useState } from 'react'
import clsx from 'clsx'
import { QwAppIconPair } from '../glass/QwAppIcon'
import { LayoutPicker } from '../chrome/LayoutPicker'
import { useQwStore } from '../../store/qwStore'
import {
  ACCENT_COLORS,
  WALLPAPER_META,
  ICON_FAMILIES,
  type AccentName,
  type WallpaperId,
  type LoadingIcon,
  type SearchBarStyle,
  type GlassIntensity,
  type StartPageContent,
  type ThemeMode,
  type IconVariant,
} from '../../types/customization'

const GUIDE_STEPS = [
  { id: 'icon', title: 'App icon', blurb: 'Pick a style — light and dark versions swap with your theme.' },
  { id: 'theme', title: 'Theme & glass', blurb: 'Appearance mode and blur intensity.' },
  { id: 'accent', title: 'Accent color', blurb: 'Tint buttons, badges, and highlights.' },
  { id: 'layout', title: 'Where things go', blurb: 'Scroll options and preview the real layout.' },
  { id: 'searchbar', title: 'Search bar shape', blurb: 'Capsule, pill, rounded, or square.' },
  { id: 'controls', title: 'Visible buttons', blurb: 'Show only the buttons you use.' },
  { id: 'wallpaper', title: 'Start wallpaper', blurb: 'Backdrop for your start page.' },
  { id: 'start', title: 'Start page', blurb: 'Favorites, suggestions, blank, or art.' },
  { id: 'loader', title: 'Loading icon', blurb: 'How qw feels while pages load.' },
  { id: 'engine', title: 'Search engine', blurb: 'Default engine for queries.' },
] as const

export function FullCustomizationGuide() {
  const [step, setStep] = useState(0)
  const settings = useQwStore((s) => s.settings)
  const setShowFullGuide = useQwStore((s) => s.setShowFullGuide)
  const patchSettings = useQwStore((s) => s.patchSettings)
  const setChromeLayout = useQwStore((s) => s.setChromeLayout)
  const setAccent = useQwStore((s) => s.setAccent)
  const setWallpaper = useQwStore((s) => s.setWallpaper)
  const setThemeMode = useQwStore((s) => s.setThemeMode)
  const setSearchBarStyle = useQwStore((s) => s.setSearchBarStyle)
  const setGlassIntensity = useQwStore((s) => s.setGlassIntensity)
  const setLoadingIcon = useQwStore((s) => s.setLoadingIcon)
  const setAppIcon = useQwStore((s) => s.setAppIcon)
  const setStartPageContent = useQwStore((s) => s.setStartPageContent)
  const setControl = useQwStore((s) => s.setControl)
  const setSetting = useQwStore((s) => s.setSetting)

  const current = GUIDE_STEPS[step]
  const progress = ((step + 1) / GUIDE_STEPS.length) * 100

  const finish = () => {
    patchSettings({ fullGuideComplete: true })
    setShowFullGuide(false)
  }

  return (
    <div className="onboarding" style={{ zIndex: 60 }}>
      <div className="guide-progress">
        <i style={{ width: `${progress}%` }} />
      </div>

      <div className="onboarding-hero tight">
        <div
          style={{
            fontSize: 12,
            fontWeight: 650,
            color: 'var(--qw-accent)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Full Customization Guide · {step + 1}/{GUIDE_STEPS.length}
        </div>
        <h1>{current.title}</h1>
        <p>{current.blurb}</p>
      </div>

      {current.id === 'icon' && (
        <div className="icon-family-grid">
          {(Object.keys(ICON_FAMILIES) as IconVariant[]).map((v) => (
            <button
              key={v}
              type="button"
              className={clsx('icon-family-card', settings.appIcon === v && 'selected')}
              onClick={() => setAppIcon(v)}
            >
              <QwAppIconPair variant={v} size={48} />
              <strong>
                {ICON_FAMILIES[v].title}
                {ICON_FAMILIES[v].pro ? <span className="pro-badge">PRO</span> : null}
              </strong>
              <span>{ICON_FAMILIES[v].subtitle}</span>
            </button>
          ))}
        </div>
      )}

      {current.id === 'theme' && (
        <>
          <div className="chip-grid three" style={{ marginBottom: 16 }}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={clsx('choice-card', settings.themeMode === m && 'selected')}
                style={{ minHeight: 64 }}
                onClick={() => setThemeMode(m)}
              >
                <strong style={{ textTransform: 'capitalize' }}>{m}</strong>
              </button>
            ))}
          </div>
          <div className="onboarding-step-title">Glass intensity</div>
          <div className="chip-grid three">
            {(['subtle', 'medium', 'strong'] as GlassIntensity[]).map((g) => (
              <button
                key={g}
                type="button"
                className={clsx('choice-card', settings.glassIntensity === g && 'selected')}
                style={{ minHeight: 64 }}
                onClick={() => setGlassIntensity(g)}
              >
                <strong style={{ textTransform: 'capitalize' }}>{g}</strong>
              </button>
            ))}
          </div>
        </>
      )}

      {current.id === 'accent' && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(Object.keys(ACCENT_COLORS) as AccentName[]).map((a) => (
            <button
              key={a}
              type="button"
              className={clsx('accent-swatch', settings.accent === a && 'selected')}
              style={{ background: ACCENT_COLORS[a], width: 44, height: 44 }}
              onClick={() => setAccent(a)}
              aria-label={a}
            />
          ))}
        </div>
      )}

      {current.id === 'layout' && (
        <LayoutPicker value={settings.chromeLayout} onChange={setChromeLayout} />
      )}

      {current.id === 'searchbar' && (
        <div className="chip-grid">
          {(['capsule', 'pill', 'rounded', 'square'] as SearchBarStyle[]).map((s) => (
            <button
              key={s}
              type="button"
              className={clsx('choice-card', settings.searchBarStyle === s && 'selected')}
              onClick={() => setSearchBarStyle(s)}
            >
              <div
                className="glass"
                style={{
                  height: 28,
                  marginBottom: 10,
                  borderRadius:
                    s === 'capsule' ? 999 : s === 'pill' ? 18 : s === 'rounded' ? 12 : 6,
                }}
              />
              <strong style={{ textTransform: 'capitalize' }}>{s}</strong>
            </button>
          ))}
        </div>
      )}

      {current.id === 'controls' && (
        <div className="settings-group">
          {(Object.keys(settings.controls) as (keyof typeof settings.controls)[]).map((key) => (
            <button
              key={key}
              type="button"
              className="settings-row"
              onClick={() => setControl(key, !settings.controls[key])}
            >
              <div className="label">
                <strong style={{ textTransform: 'capitalize' }}>{key}</strong>
              </div>
              <span style={{ color: 'var(--qw-accent)', fontWeight: 600, fontSize: 13 }}>
                {settings.controls[key] ? 'On' : 'Off'}
              </span>
            </button>
          ))}
        </div>
      )}

      {current.id === 'wallpaper' && (
        <div className="chip-grid three">
          {(Object.keys(WALLPAPER_META) as WallpaperId[]).map((w) => (
            <button
              key={w}
              type="button"
              className={clsx('wallpaper-swatch', settings.wallpaper === w && 'selected')}
              style={{
                background:
                  WALLPAPER_META[w].css === 'transparent' ? 'var(--qw-bg)' : WALLPAPER_META[w].css,
              }}
              onClick={() => setWallpaper(w)}
              aria-label={WALLPAPER_META[w].title}
            />
          ))}
        </div>
      )}

      {current.id === 'start' && (
        <div className="chip-grid">
          {(['blank', 'favorites', 'suggestions', 'wallpaper-only'] as StartPageContent[]).map(
            (c) => (
              <button
                key={c}
                type="button"
                className={clsx('choice-card', settings.startPageContent === c && 'selected')}
                onClick={() => setStartPageContent(c)}
              >
                <strong style={{ textTransform: 'capitalize' }}>{c.replace('-', ' ')}</strong>
              </button>
            ),
          )}
        </div>
      )}

      {current.id === 'loader' && (
        <div className="chip-grid three">
          {(['qw', 'spinner', 'dots', 'pulse', 'ring', 'bars'] as LoadingIcon[]).map((icon) => (
            <button
              key={icon}
              type="button"
              className={clsx('choice-card', settings.loadingIcon === icon && 'selected')}
              style={{ minHeight: 72 }}
              onClick={() => setLoadingIcon(icon)}
            >
              <strong style={{ textTransform: 'capitalize' }}>{icon}</strong>
            </button>
          ))}
        </div>
      )}

      {current.id === 'engine' && (
        <div className="chip-grid">
          {(['duckduckgo', 'google', 'bing', 'ecosia', 'brave'] as const).map((engine) => (
            <button
              key={engine}
              type="button"
              className={clsx('choice-card', settings.searchEngine === engine && 'selected')}
              style={{ minHeight: 64 }}
              onClick={() => setSetting('searchEngine', engine)}
            >
              <strong style={{ textTransform: 'capitalize' }}>{engine}</strong>
            </button>
          ))}
        </div>
      )}

      <div className="onboarding-actions">
        <button
          type="button"
          className="ghost"
          onClick={() => (step === 0 ? setShowFullGuide(false) : setStep((s) => s - 1))}
        >
          {step === 0 ? 'Close' : 'Back'}
        </button>
        {step < GUIDE_STEPS.length - 1 ? (
          <button type="button" className="primary" onClick={() => setStep((s) => s + 1)}>
            Next
          </button>
        ) : (
          <button type="button" className="primary" onClick={finish}>
            Done
          </button>
        )}
      </div>
    </div>
  )
}
