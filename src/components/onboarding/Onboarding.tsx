import { useState } from 'react'
import clsx from 'clsx'
import { QwAppIcon, QwAppIconPair } from '../glass/QwAppIcon'
import { LayoutPicker } from '../chrome/LayoutPicker'
import { useQwStore } from '../../store/qwStore'
import {
  ACCENT_COLORS,
  ICON_FAMILIES,
  type AccentName,
  type ThemeMode,
  type IconVariant,
} from '../../types/customization'

const STEPS = ['Welcome', 'Layout', 'Look', 'Done'] as const
const ICON_OPTIONS = Object.keys(ICON_FAMILIES) as IconVariant[]

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
            <h1>Meet qw.</h1>
            <p>Extremely customizable. Still minimal. Make it yours — quietly.</p>
          </div>
          <div className="onboarding-step-title">App icon</div>
          <div className="icon-family-grid">
            {ICON_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                className={clsx('icon-family-card', settings.appIcon === v && 'selected')}
                onClick={() => setAppIcon(v)}
                aria-label={ICON_FAMILIES[v].title}
              >
                <QwAppIconPair variant={v} size={44} />
                <strong>
                  {ICON_FAMILIES[v].title}
                  {ICON_FAMILIES[v].pro ? <span className="pro-badge">PRO</span> : null}
                </strong>
                <span>{ICON_FAMILIES[v].subtitle}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--qw-fg-secondary)', marginTop: 10 }}>
            Each style includes light + dark — it switches with your theme.
          </p>
        </>
      )}

      {step === 1 && (
        <>
          <div className="onboarding-hero tight">
            <h1>Where should things go?</h1>
            <p>Scroll the options. The preview shows exactly how qw will look.</p>
          </div>
          <LayoutPicker value={settings.chromeLayout} onChange={setChromeLayout} />
        </>
      )}

      {step === 2 && (
        <>
          <div className="onboarding-hero">
            <h1>Set the vibe</h1>
            <p>Light, dark, or system. Keep it soft — or pick an accent.</p>
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
              Want every detail? Open Settings → Full Customization Guide anytime —
              buttons, wallpaper, loaders, and more.
            </p>
          </div>
          <div className="glass glass-card" style={{ padding: 16 }}>
            <strong style={{ display: 'block', marginBottom: 6 }}>Tip</strong>
            <span style={{ color: 'var(--qw-fg-secondary)', fontSize: 14, lineHeight: 1.45 }}>
              Your home screen starts clean. Add shortcuts later if you want them.
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
