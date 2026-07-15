import { useState } from 'react'
import clsx from 'clsx'
import { QwAppIcon, QwAppIconPair } from '../glass/QwAppIcon'
import { LayoutPicker } from '../chrome/LayoutPicker'
import { useQwStore } from '../../store/qwStore'
import {
  ACCENT_COLORS,
  ICON_FAMILIES,
  VISUAL_STYLES,
  type AccentName,
  type ThemeMode,
  type IconVariant,
  type VisualStyle,
} from '../../types/customization'

const STEPS = ['Style', 'Icon', 'Layout', 'Look', 'Done'] as const
const ICON_OPTIONS = Object.keys(ICON_FAMILIES) as IconVariant[]
const STYLE_OPTIONS = Object.keys(VISUAL_STYLES) as VisualStyle[]

export function Onboarding() {
  const [step, setStep] = useState(0)
  const settings = useQwStore((s) => s.settings)
  const theme = useQwStore((s) => s.resolvedTheme)
  const setChromeLayout = useQwStore((s) => s.setChromeLayout)
  const setAccent = useQwStore((s) => s.setAccent)
  const setThemeMode = useQwStore((s) => s.setThemeMode)
  const setAppIcon = useQwStore((s) => s.setAppIcon)
  const setVisualStyle = useQwStore((s) => s.setVisualStyle)
  const completeOnboarding = useQwStore((s) => s.completeOnboarding)
  const patchSettings = useQwStore((s) => s.patchSettings)

  return (
    <div className="onboarding">
      <div className="guide-progress">
        <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="onboarding-scroll">
        {step === 0 && (
          <>
            <div className="onboarding-hero">
              <div className="qw-mark">
                <QwAppIcon variant={settings.appIcon} theme={theme} size={64} />
              </div>
              <h1>Meet qw.</h1>
              <p>Extremely customizable. Still minimal. Pick a look to start.</p>
            </div>
            <div className="onboarding-step-title">Visual style</div>
            <div className="style-pick-list">
              {STYLE_OPTIONS.map((key) => (
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
          </>
        )}

        {step === 1 && (
          <>
            <div className="onboarding-hero tight">
              <h1>App icon</h1>
              <p>Scroll sideways — each style has light and dark versions.</p>
            </div>
            <div className="icon-scroll">
              {ICON_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={clsx('icon-scroll-card', settings.appIcon === v && 'selected')}
                  onClick={() => setAppIcon(v)}
                  aria-label={ICON_FAMILIES[v].title}
                >
                  <QwAppIconPair variant={v} size={48} />
                  <strong>
                    {ICON_FAMILIES[v].title}
                    {ICON_FAMILIES[v].pro ? <span className="pro-badge">PRO</span> : null}
                  </strong>
                </button>
              ))}
            </div>
            <div className="icon-now-preview">
              <QwAppIcon variant={settings.appIcon} theme={theme} size={72} />
              <span>{ICON_FAMILIES[settings.appIcon].title}</span>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="onboarding-hero tight">
              <h1>Where should things go?</h1>
              <p>Scroll the options. Preview updates live.</p>
            </div>
            <LayoutPicker value={settings.chromeLayout} onChange={setChromeLayout} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="onboarding-hero tight">
              <h1>Set the vibe</h1>
              <p>Theme and accent. You can change these anytime.</p>
            </div>
            <div className="onboarding-step-title">Appearance</div>
            <div className="chip-grid three" style={{ marginBottom: 20 }}>
              {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={clsx('choice-card', settings.themeMode === m && 'selected')}
                  onClick={() => setThemeMode(m)}
                  style={{ minHeight: 58 }}
                >
                  <strong style={{ textTransform: 'capitalize' }}>{m}</strong>
                </button>
              ))}
            </div>
            <div className="onboarding-step-title">Accent</div>
            <div className="accent-row">
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

        {step === 4 && (
          <>
            <div className="onboarding-hero">
              <h1>You're set</h1>
              <p>
                Want every detail? Settings → Full Customization Guide covers buttons,
                wallpapers, loaders, and more.
              </p>
            </div>
            <div className="glass glass-card tip-card">
              <strong>Tip</strong>
              <span>
                Your start page begins clean. Switch Liquid Glass, Classic, or Cyber anytime in
                Settings.
              </span>
            </div>
          </>
        )}
      </div>

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
