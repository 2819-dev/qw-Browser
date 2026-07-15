import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQwStore } from '../../store/qwStore'

type Hole = { top: number; left: number; width: number; height: number }

type Panel = 'none' | 'tabs' | 'settings'

type TourStep = {
  id: string
  target?: string
  title: string
  body: string
  /** Must tap the highlighted control */
  requireClick?: boolean
  /** Must navigate to an http(s) page */
  requireNavigate?: boolean
  /** Must return to start page */
  requireHome?: boolean
  /** Which sheet should stay open */
  panel?: Panel
  /** Optional CTA label instead of Continue */
  primaryLabel?: string
  /** Special: open full guide and finish tour into it */
  offerFullGuide?: boolean
}

const STEPS: TourStep[] = [
  {
    id: 'search',
    target: 'tour-search',
    title: 'Search',
    body: 'Type a site — try example.com — then press Go on the keyboard.',
    requireNavigate: true,
  },
  {
    id: 'page',
    target: 'tour-search',
    title: 'On a website',
    body: 'The bar shows where you are. Edit it anytime to jump somewhere else.',
  },
  {
    id: 'back',
    target: 'tour-back',
    title: 'Back',
    body: 'Tap Back to return to the previous page in this tab.',
    requireClick: true,
  },
  {
    id: 'reload',
    target: 'tour-reload',
    title: 'Reload',
    body: 'Tap Reload if a page looks stuck or unfinished.',
    requireClick: true,
  },
  {
    id: 'tabs-open',
    target: 'tour-tabs',
    title: 'Tabs',
    body: 'Open the tabs switcher to manage pages.',
    requireClick: true,
    panel: 'tabs',
  },
  {
    id: 'tabs-new',
    target: 'tour-new-tab',
    title: 'New tab',
    body: 'Tap New Tab. Each tab has its own history.',
    requireClick: true,
    panel: 'tabs',
  },
  {
    id: 'tabs-pick',
    target: 'tour-tab-card',
    title: 'Switch tabs',
    body: 'Tap a tab card to open it. Close ones you don’t need with ×.',
    requireClick: true,
    panel: 'tabs',
  },
  {
    id: 'settings-open',
    target: 'tour-settings',
    title: 'Settings',
    body: 'Tap Settings — layout, look, icons, and more live here.',
    requireClick: true,
    panel: 'settings',
  },
  {
    id: 'settings-style',
    target: 'tour-settings-styles',
    title: 'Looks',
    body: 'Liquid Glass and Classic stay quiet black & white. Cyber goes full neon.',
    panel: 'settings',
  },
  {
    id: 'full-guide',
    target: 'tour-full-guide',
    title: 'Go deeper?',
    body: 'Optional: tap Full Customization Guide for fonts, loaders, engines — everything. Or Skip.',
    requireClick: true,
    panel: 'settings',
    offerFullGuide: true,
  },
  {
    id: 'done',
    title: 'You’re ready',
    body: 'That’s browsing in qw. Finish to claim your Welcome badge.',
  },
]

export function FeatureTour() {
  const [step, setStep] = useState(0)
  const [hole, setHole] = useState<Hole | null>(null)
  const completeTour = useQwStore((s) => s.completeTour)
  const setShowTabs = useQwStore((s) => s.setShowTabs)
  const setShowSettings = useQwStore((s) => s.setShowSettings)
  const navigate = useQwStore((s) => s.navigate)
  const goHome = useQwStore((s) => s.goHome)
  const tabUrl = useQwStore((s) => s.activeTab().url)
  const startUrl = useRef(tabUrl)
  const current = STEPS[step]

  const advance = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))

  useEffect(() => {
    if (current.id === 'search') {
      startUrl.current = useQwStore.getState().activeTab().url
    }
  }, [current.id])

  // Keep the right panel open for this step
  useEffect(() => {
    const panel = current.panel ?? 'none'
    if (panel === 'tabs') {
      setShowSettings(false)
      setShowTabs(true)
    } else if (panel === 'settings') {
      setShowTabs(false)
      setShowSettings(true)
    } else {
      setShowTabs(false)
      setShowSettings(false)
    }
  }, [step, current.panel, setShowTabs, setShowSettings])

  // Ensure we’re on a real page when teaching page chrome
  useEffect(() => {
    if (current.id === 'page' || current.id === 'back' || current.id === 'reload') {
      if (!tabUrl.startsWith('http')) {
        navigate('https://example.com')
      }
    }
  }, [current.id, tabUrl, navigate])

  useLayoutEffect(() => {
    const measureStep = () => {
      if (!current.target) {
        setHole(null)
        return
      }
      const root = document.querySelector<HTMLElement>('.tour-root')
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
      if (!root || !el) {
        setHole(null)
        return
      }
      const rr = root.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      const pad = 8
      setHole({
        top: Math.max(4, er.top - rr.top - pad),
        left: Math.max(4, er.left - rr.left - pad),
        width: er.width + pad * 2,
        height: er.height + pad * 2,
      })
    }
    measureStep()
    window.addEventListener('resize', measureStep)
    const id = window.setInterval(measureStep, 280)
    return () => {
      window.removeEventListener('resize', measureStep)
      window.clearInterval(id)
    }
  }, [step, current.target, current.panel])

  // Require click on target
  useEffect(() => {
    if (!current.requireClick || !current.target) return
    const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`)
    if (!el) return
    const onClick = () => {
      window.setTimeout(advance, 220)
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [step, current])

  // Require navigation
  useEffect(() => {
    if (!current.requireNavigate) return
    if (tabUrl.startsWith('http') && tabUrl !== startUrl.current) {
      advance()
    }
  }, [tabUrl, current.requireNavigate, step])

  useEffect(() => {
    if (!current.requireHome) return
    if (tabUrl === 'qw://start') advance()
  }, [tabUrl, current.requireHome, step])

  const onPrimary = () => {
    if (step < STEPS.length - 1) {
      advance()
      return
    }
    setShowTabs(false)
    setShowSettings(false)
    completeTour()
  }

  const tipBottomPrefer =
    current.panel === 'settings'
      ? false
      : current.panel === 'tabs'
        ? true
        : hole
          ? hole.top > 220
          : true

  const tryExample = () => {
    navigate('https://example.com')
  }

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
        {(current.requireClick || current.requireNavigate) && (
          <span className="tour-hint">
            {current.requireNavigate
              ? 'Search or open a site to continue'
              : current.offerFullGuide
                ? 'Tap the guide — or Skip'
                : 'Tap the highlighted control'}
          </span>
        )}
        <div className="tour-actions">
          {step > 0 && (
            <button
              type="button"
              className="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </button>
          )}
          {current.requireNavigate && (
            <button type="button" className="ghost" onClick={tryExample}>
              Use example.com
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="primary" onClick={onPrimary}>
              {current.requireClick || current.requireNavigate
                ? current.offerFullGuide
                  ? 'Skip'
                  : 'Skip'
                : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              className="primary"
              onClick={() => {
                setShowTabs(false)
                setShowSettings(false)
                goHome()
                completeTour()
              }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
