import { useEffect, useMemo, useState } from 'react'
import { StartPage, LoadingOverlay } from '../startpage/StartPage'
import { useQwStore } from '../../store/qwStore'
import { useChromeInsets } from '../chrome/BrowserChrome'

export function BrowserView() {
  const tab = useQwStore((s) => s.activeTab())
  const layout = useQwStore((s) => s.settings.chromeLayout)
  const setTabLoading = useQwStore((s) => s.setTabLoading)
  const setTabTitle = useQwStore((s) => s.setTabTitle)
  const insets = useChromeInsets(layout)
  const [reloadNonce, setReloadNonce] = useState(0)

  // Detect reload pulses (loading flipped true on same url)
  useEffect(() => {
    if (tab.loading && tab.url !== 'qw://start') {
      setReloadNonce((n) => n + 1)
    }
  }, [tab.loading, tab.url])

  const isStart = tab.url === 'qw://start'

  const iframeSrc = useMemo(() => {
    if (isStart) return null
    // Some sites block iframe embedding; we still navigate and show chrome.
    return tab.url
  }, [isStart, tab.url, reloadNonce])

  return (
    <div
      className="browser-content"
      style={{
        paddingTop: `calc(${insets.top}px + var(--qw-safe-top))`,
        paddingBottom: `calc(${insets.bottom}px + var(--qw-safe-bottom))`,
      }}
    >
      {isStart ? (
        <StartPage />
      ) : (
        <>
          {iframeSrc && (
            <iframe
              key={`${tab.id}-${reloadNonce}`}
              src={iframeSrc}
              title={tab.title}
              className="page-frame"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => {
                setTabLoading(false)
                try {
                  const host = new URL(tab.url).hostname.replace(/^www\./, '')
                  setTabTitle(host)
                } catch {
                  /* ignore */
                }
              }}
              onError={() => setTabLoading(false)}
            />
          )}
          <noscript>Enable JavaScript to browse.</noscript>
        </>
      )}
      <LoadingOverlay />
    </div>
  )
}
