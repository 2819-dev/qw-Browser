import clsx from 'clsx'
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Bookmark,
  Settings,
  Layers,
} from 'lucide-react'
import { LAYOUT_META, type ChromeLayout } from '../../types/customization'

const LAYOUT_ORDER: ChromeLayout[] = [
  'quiche-bottom',
  'quiche-top',
  'safari',
  'inverted',
  'controls-top',
  'search-only',
  'minimal',
]

function PreviewSearch({ compact }: { compact?: boolean }) {
  return (
    <div className={clsx('live-search', compact && 'compact')}>
      <span className="live-search-qw">qw.</span>
      <span className="live-search-ph">Search or enter address</span>
    </div>
  )
}

function PreviewControls() {
  return (
    <div className="live-controls">
      <ArrowLeft size={14} strokeWidth={2.2} />
      <ArrowRight size={14} strokeWidth={2.2} />
      <RotateCw size={13} strokeWidth={2.2} />
      <span className="live-spacer" />
      <Bookmark size={13} strokeWidth={2.2} />
      <Layers size={13} strokeWidth={2.2} />
      <Settings size={13} strokeWidth={2.2} />
    </div>
  )
}

function PreviewTogether({ top }: { top?: boolean }) {
  return (
    <div className={clsx('live-blob', top ? 'at-top' : 'at-bottom')}>
      <PreviewSearch />
      <PreviewControls />
    </div>
  )
}

/** Realistic mini phone preview of the selected layout */
export function LiveLayoutPreview({ layout }: { layout: ChromeLayout }) {
  return (
    <div className="live-phone" aria-hidden>
      <div className="live-phone-screen">
        <div className="live-start">
          <div className="live-wordmark">qw.</div>
        </div>

        {(layout === 'quiche-bottom' || layout === 'quiche-top') && (
          <PreviewTogether top={layout === 'quiche-top'} />
        )}

        {layout === 'safari' && (
          <>
            <div className="live-edge top">
              <PreviewSearch />
            </div>
            <div className="live-edge bottom">
              <div className="live-blob flat">
                <PreviewControls />
              </div>
            </div>
          </>
        )}

        {(layout === 'inverted' || layout === 'controls-top') && (
          <>
            <div className="live-edge top">
              <div className="live-blob flat">
                <PreviewControls />
              </div>
            </div>
            <div className="live-edge bottom">
              <PreviewSearch />
            </div>
          </>
        )}

        {layout === 'search-only' && (
          <div className="live-edge bottom">
            <PreviewSearch />
          </div>
        )}

        {layout === 'minimal' && (
          <div className="live-edge bottom padded">
            <PreviewSearch compact />
          </div>
        )}
      </div>
    </div>
  )
}

export function LayoutPicker({
  value,
  onChange,
  compact,
}: {
  value: ChromeLayout
  onChange: (layout: ChromeLayout) => void
  compact?: boolean
}) {
  const meta = LAYOUT_META[value]

  return (
    <div className={clsx('layout-picker', compact && 'compact')}>
      <div className="layout-scroll" role="listbox" aria-label="Bar placement">
        {LAYOUT_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            role="option"
            aria-selected={value === key}
            className={clsx('layout-chip', value === key && 'selected')}
            onClick={() => onChange(key)}
          >
            {LAYOUT_META[key].title}
          </button>
        ))}
      </div>

      <div className="layout-preview-panel">
        <LiveLayoutPreview layout={value} />
        <div className="layout-preview-caption">
          <strong>{meta.title}</strong>
          <span>{meta.subtitle}</span>
        </div>
      </div>
    </div>
  )
}

/** @deprecated kept only if something still imports the mini diagram */
export function LayoutPreview({ layout }: { layout: ChromeLayout }) {
  return <LiveLayoutPreview layout={layout} />
}
