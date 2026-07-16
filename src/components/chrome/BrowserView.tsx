import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { StartPage, LoadingOverlay } from '../startpage/StartPage'
import { GamesPage } from '../games/GamesPage'
import { ExtensionsPage } from '../extensions/ExtensionsPage'
import { useQwStore } from '../../store/qwStore'
import { chromeClearance } from '../chrome/BrowserChrome'
import { isQwInternal } from '../../types/customization'

export function BrowserView() {
  const tab = useQwStore((s) => s.activeTab())
  const layout = useQwStore((s) => s.settings.chromeLayout)
  const setTabLoading = useQwStore((s) => s.setTabLoading)
  const setTabTitle = useQwStore((s) => s.setTabTitle)
  const clearance = chromeClearance(layout)
  const [reloadNonce, setReloadNonce] = useState(0)

  useEffect(() => {
    if (tab.loading && !isQwInternal(tab.url)) {
      setReloadNonce((n) => n + 1)
    }
  }, [tab.loading, tab.url])

  const isStart = tab.url === 'qw://start'
  const isGames = tab.url === 'qw://games'
  const isExtensions = tab.url === 'qw://extensions'
  const isInternal = isQwInternal(tab.url)
  const isKnownInternal = isStart || isGames || isExtensions

  const iframeSrc = useMemo(() => {
    if (isInternal) return null
    return tab.url
  }, [isInternal, tab.url, reloadNonce])

  return (
    <div
      className="browser-content"
      style={
        {
          '--qw-clear-top': clearance.top,
          '--qw-clear-bottom': clearance.bottom,
        } as CSSProperties
      }
    >
      <div className="browser-page">
        {isStart ? (
          <StartPage />
        ) : isGames ? (
          <GamesPage />
        ) : isExtensions ? (
          <ExtensionsPage />
        ) : isInternal && !isKnownInternal ? (
          <div className="qw-not-found">
            <p className="games-kicker">{tab.url}</p>
            <h1>Not found</h1>
            <p>Try qw://start, qw://games, or qw://extensions</p>
          </div>
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
    </div>
  )
}
