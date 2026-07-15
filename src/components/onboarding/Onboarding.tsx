import { useState } from 'react'
import clsx from 'clsx'
import { QwAppIcon } from '../glass/QwAppIcon'
import { useQwStore } from '../../store/qwStore'
import {
  LAYOUT_META,
  ACCENT_COLORS,
  type ChromeLayout,
  type AccentName,
  type ThemeMode,
} from '../../types/customization'

function LayoutPreview({ layout }: { layout: ChromeLayout }) {
  return (
    <div className="layout-mini">
      {layout === 'safari' && (
        <>
          <div className="bar" style={{ top: 8 }} />
          <div className="dots" style={{ bottom: 8 }}>
            <i />
            <i />
            <i />
            <i />
          </div>
        </>
      )}
      {layout === 'quiche-bottom' && (
        <div
          className="bar"
          style={{ bottom: 6, height: 16, borderRadius: 8, left: 6, right: 6 }}
        />
      )}
      {layout === 'quiche-top' && (
        <div
          className="bar"
          style={{ top: 6, height: 16, borderRadius: 8, left: 6, right: 6 }}
        />
      )}
      {layout === 'inverted' && (
        <>
          <div className="dots" style={{ top: 8 }}>
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="bar" style={{ bottom: 8 }} />
        </>
      )}
      {layout === 'controls-top' && (
        <>
          <div className="dots" style={{ top: 8 }}>
            <i />
            <i />
            <i />
          </div>
          <div className="bar" style={{ bottom: 8 }} />
        </>
      )}
      {layout === 'search-only' && <div className="bar" style={{ bottom: 10 }} />}
      {layout === 'minimal' && (
        <div className="bar" style={{ bottom: 10, left: 18, right: 18, opacity: 0.55 }} />
      )}
    </div>
  )
}

const STEPS = ['Welcome', 'Layout', 'Look', 'Done'] as const

export function Onboarding() {
  const [step, setStep] = useState(0)
  const settings = useQwStore((s) => s.settings)
  const theme = useQwStore((s) => s.resolvedTheme)
  const setChromeLayout = useQwStore((s) => s.setChromeLayout)
  const setAccent = useQwStore((s) => s.setAccent)
  const setThemeMode = useQwStore((s) => s.setThemeMode)
  const setAppIcon = useQwStore((s) => s.setAppIcon)
  const completeOnboarding = useQwStore((s) => s.completeOnboarding)
  const patchSettings = useQwStore((s) => s.patchSettings)

  return (
    <div className="onboarding">
      <div className="guide-progress">
        <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      {step === 0 && (
        <>
          <div className="onboarding-hero">
            <div className="qw-mark">
              <QwAppIcon variant={settings.appIcon} theme={theme} size={72} />
            </div>
            <h1>Meet qw</h1>
            <p>
              Extremely customizable. Still minimal. Shape the chrome the way your
              hands like — Safari, Quiche, or something quieter.
            </p>
          </div>
          <div className="onboarding-step-title">App icon</div>
          <div className="icon-picker">
            {(['auto', 'light', 'dark', 'glass', 'mono'] as const).map((v) => (
              <button
                key={v}
                type="button"
                className={clsx('app-icon-preview', settings.appIcon === v && 'selected')}
                onClick={() => setAppIcon(v)}
                aria-label={v}
              >
                <QwAppIcon variant={v} theme={theme} size={64} />
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--qw-fg-secondary)', marginTop: 10 }}>
            Auto switches with light / dark mode.
          </p>
        </>
      )}

      {step === 1 && (
        <>
          <div className="onboarding-hero">
            <h1>Place your chrome</h1>
            <p>Search bar + controls. Pick a starting layout — you can change it anytime.</p>
          </div>
          <div className="onboarding-step-title">Layout</div>
          <div className="chip-grid">
            {(Object.keys(LAYOUT_META) as ChromeLayout[]).map((key) => (
              <button
                key={key}
                type="button"
                className={clsx('choice-card', settings.chromeLayout === key && 'selected')}
                onClick={() => setChromeLayout(key)}
              >
                <LayoutPreview layout={key} />
                <strong>{LAYOUT_META[key].title}</strong>
                <span>{LAYOUT_META[key].subtitle}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="onboarding-hero">
            <h1>Set the vibe</h1>
            <p>Light, dark, or system. Plus an accent that tints your glass.</p>
          </div>
          <div className="onboarding-step-title">Appearance</div>
          <div className="chip-grid three" style={{ marginBottom: 18 }}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                className={clsx('choice-card', settings.themeMode === m && 'selected')}
                onClick={() => setThemeMode(m)}
                style={{ minHeight: 64 }}
              >
                <strong style={{ textTransform: 'capitalize' }}>{m}</strong>
              </button>
            ))}
          </div>
          <div className="onboarding-step-title">Accent</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
        </>
      )}

      {step === 3 && (
        <>
          <div className="onboarding-hero">
            <h1>You're set</h1>
            <p>
              Want every knob? Open Settings → Full Customization Guide anytime —
              icons, wallpapers, loading animations, the works.
            </p>
          </div>
          <div className="glass glass-card" style={{ padding: 16 }}>
            <strong style={{ display: 'block', marginBottom: 6 }}>Tip</strong>
            <span style={{ color: 'var(--qw-fg-secondary)', fontSize: 14, lineHeight: 1.45 }}>
              Long-press the settings gear later for Quick Layout. Or dive deep with
              the full guide when you're ready to obsess (in a good way).
            </span>
          </div>
        </>
      )}

      <div className="onboarding-actions">
        {step > 0 && (
          <button type="button" className="ghost" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="primary" onClick={() => setStep((s) => s + 1)}>
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="primary"
            onClick={() => {
              patchSettings({ onboardingComplete: true })
              completeOnboarding()
            }}
          >
            Open qw
          </button>
        )}
      </div>
    </div>
  )
}

export { LayoutPreview }
