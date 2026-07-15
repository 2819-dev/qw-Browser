import { useEffect, useLayoutEffect, useState } from 'react'
import { useQwStore } from '../../store/qwStore'

type Hole = { top: number; left: number; width: number; height: number }

type TourStep = {
  id: string
  target: string
  title: string
  body: string
  /** User must tap the highlighted control to continue */
  requireClick?: boolean
}

const STEPS: TourStep[] = [
  {
    id: 'search',
    target: 'tour-search',
    title: 'Search',
    body: 'Type a site or anything you want to look up, then press Go on the keyboard.',
  },
  {
    id: 'tabs',
    target: 'tour-tabs',
    title: 'Tabs',
    body: 'Keep several pages open. Tap Tabs to open the switcher.',
    requireClick: true,
  },
  {
    id: 'settings',
    target: 'tour-settings',
    title: 'Settings',
    body: 'Layout, Liquid Glass, Classic, icons — everything lives here. Tap Settings.',
    requireClick: true,
  },
  {
    id: 'done',
    target: 'tour-search',
    title: 'You’re ready',
    body: 'That’s the core of qw. Finish to claim your Welcome badge.',
  },
]

export function FeatureTour() {
  const [step, setStep] = useState(0)
  const [hole, setHole] = useState<Hole | null>(null)
  const completeTour = useQwStore((s) => s.completeTour)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const current = STEPS[step]

  useLayoutEffect(() => {
    const measureStep = () => {
      const root = document.querySelector<HTMLElement>('.tour-root')
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
      if (!root || !el) {
        setHole(null)
        return
      }
      const rr = root.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      const pad = 10
      setHole({
        top: Math.max(4, er.top - rr.top - pad),
        left: Math.max(4, er.left - rr.left - pad),
        width: er.width + pad * 2,
        height: er.height + pad * 2,
      })
    }
    measureStep()
    window.addEventListener('resize', measureStep)
    const id = window.setInterval(measureStep, 350)
    return () => {
      window.removeEventListener('resize', measureStep)
      window.clearInterval(id)
    }
  }, [step, current.target])

  useEffect(() => {
    if (!current.requireClick) return
    const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
    if (!el) return
    const onClick = () => {
      window.setTimeout(() => {
        setShowTabs(false)
        setShowSettings(false)
        setStep((s) => Math.min(s + 1, STEPS.length - 1))
      }, 320)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [step, current, setShowTabs, setShowSettings])

  const tipBottomPrefer = hole ? hole.top > 200 : true

  return (
    <div className="tour-root" aria-modal="true" role="dialog" aria-label="Feature guide">
      <div className="tour-dim" />
      {hole && (
        <div
          className="tour-hole"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
          }}
        />
      )}

      <div
        className={`tour-card glass glass-card ${tipBottomPrefer ? 'tour-card-bottom' : 'tour-card-top'}`}
      >
        <div className="tour-progress">
          {STEPS.map((s, i) => (
            <i key={s.id} className={i <= step ? 'on' : ''} />
          ))}
        </div>
        <h3>{current.title}</h3>
        <p>{current.body}</p>
        {current.requireClick && <span className="tour-hint">Tap the highlighted control</span>}
        <div className="tour-actions">
          {step > 0 && (
            <button type="button" className="ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="primary"
              onClick={() => {
                setShowTabs(false)
                setShowSettings(false)
                setStep((s) => s + 1)
              }}
            >
              {current.requireClick ? 'Skip' : 'Continue'}
            </button>
          ) : (
            <button type="button" className="primary" onClick={completeTour}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
