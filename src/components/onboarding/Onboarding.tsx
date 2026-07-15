import { useState } from 'react'
import clsx from 'clsx'
import { QwAppIcon } from '../glass/QwAppIcon'
import { LayoutPicker } from '../chrome/LayoutPicker'
import { useQwStore } from '../../store/qwStore'
import { VISUAL_STYLES, type VisualStyle } from '../../types/customization'

const STEPS = ['Welcome', 'Look', 'Place', 'Guide'] as const
const STYLE_OPTIONS = Object.keys(VISUAL_STYLES) as VisualStyle[]

export function Onboarding() {
  const [step, setStep] = useState(0)
  const settings = useQwStore((s) => s.settings)
  const theme = useQwStore((s) => s.resolvedTheme)
  const setChromeLayout = useQwStore((s) => s.setChromeLayout)
  const setVisualStyle = useQwStore((s) => s.setVisualStyle)
  const completeOnboarding = useQwStore((s) => s.completeOnboarding)

  return (
    <div className="onboarding minimal-onboarding">
      <div className="guide-progress">
        <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="onboarding-scroll">
        {step === 0 && (
          <div className="onboarding-hero center-hero">
            <QwAppIcon variant={settings.appIcon} theme={theme} size={84} />
            <h1>qw.</h1>
            <p>Clean. Minimal. Yours.</p>
          </div>
        )}

        {step === 1 && (
          <>
            <div className="onboarding-hero tight">
              <h1>Choose a look</h1>
              <p>Liquid Glass frosts what’s behind it. Classic stays solid and sharp. Cyber is neon.</p>
            </div>
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

        {step === 2 && (
          <>
            <div className="onboarding-hero tight">
              <h1>Where should things go?</h1>
              <p>Scroll options. Preview updates live.</p>
            </div>
            <LayoutPicker value={settings.chromeLayout} onChange={setChromeLayout} />
          </>
        )}

        {step === 3 && (
          <div className="onboarding-hero center-hero">
            <h1>A quick guide</h1>
            <p>
              Next, qw highlights each control and asks you to try it. When you’re done, you’ll get a
              Welcome badge.
            </p>
          </div>
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
          <button type="button" className="primary" onClick={completeOnboarding}>
            Start guide
          </button>
        )}
      </div>
    </div>
  )
}
