import { useEffect } from 'react'
import { resolveAccent, resolveIconSrc, UI_FONTS } from './types/customization'
import { useQwStore } from './store/qwStore'
import { hasExtensionEffect, fetchApprovedExtensions, BUILTIN_EXTENSIONS } from './lib/extensionCatalog'
import { BrowserChrome } from './components/chrome/BrowserChrome'
import { BrowserView } from './components/chrome/BrowserView'
import { Onboarding } from './components/onboarding/Onboarding'
import { FeatureTour } from './components/onboarding/FeatureTour'
import { WelcomeCeremony } from './components/onboarding/WelcomeCeremony'
import { SettingsSheet, TabsSheet } from './components/settings/SettingsSheet'
import { FullCustomizationGuide } from './components/settings/FullCustomizationGuide'
import { setStatusBar, hideSplash } from './lib/native'
import './styles/qw.css'

function useResolvedTheme() {
  const themeMode = useQwStore((s) => s.settings.themeMode)
  const setResolvedTheme = useQwStore((s) => s.setResolvedTheme)
  const reduceMotion = useQwStore((s) => s.settings.reduceMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const resolved =
        themeMode === 'system' ? (mq.matches ? 'dark' : 'light') : themeMode
      setResolvedTheme(resolved)
      document.documentElement.dataset.theme = resolved
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        meta.setAttribute('content', resolved === 'dark' ? '#000000' : '#f2f2f7')
      }
      // On native (iOS/Android) mirror the resolved theme onto the status bar.
      // status-bar's Style.Light = dark content on light background, so we
      // pass the semantic theme name and let native.ts translate.
      void setStatusBar(resolved === 'dark' ? 'dark' : 'light')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [themeMode, setResolvedTheme])

  useEffect(() => {
    document.documentElement.dataset.motion = reduceMotion ? 'reduce' : 'full'
  }, [reduceMotion])
}

function useDynamicFavicon() {
  const appIcon = useQwStore((s) => s.settings.appIcon)
  const theme = useQwStore((s) => s.resolvedTheme)

  useEffect(() => {
    const href = `${resolveIconSrc(appIcon, theme)}?v=${appIcon}-${theme}`
    const ensure = (rel: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel='${rel}']`)
      if (!link) {
        link = document.createElement('link')
        link.rel = rel
        document.head.appendChild(link)
      }
      link.type = 'image/png'
      link.href = href
      return link
    }
    ensure('icon')
    ensure('apple-touch-icon')
    document
      .querySelectorAll("link[rel='apple-touch-icon'][media]")
      .forEach((el) => el.remove())
  }, [appIcon, theme])
}

function useFullscreenShell() {
  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in navigator &&
          Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
      root.dataset.standalone = standalone ? 'true' : 'false'
      root.style.setProperty('--qw-vh', `${window.innerHeight}px`)
    }
    sync()
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)
    return () => {
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [])
}

export default function App() {
  useResolvedTheme()
  useDynamicFavicon()
  useFullscreenShell()

  useEffect(() => {
    void hideSplash()
  }, [])

  useEffect(() => {
    let remove: (() => void) | undefined
    let cancelled = false
    void (async () => {
      try {
        const { App } = await import('@capacitor/app')
        const handle = await App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) return
          const { settings } = useQwStore.getState()
          if (!settings.clearOnExit) return
          const id = Math.random().toString(36).slice(2, 10)
          useQwStore.setState({
            tabs: [
              {
                id,
                title: 'Start',
                url: 'qw://start',
                loading: false,
                canGoBack: false,
                canGoForward: false,
                history: ['qw://start'],
                historyIndex: 0,
              },
            ],
            activeTabId: id,
          })
        })
        if (cancelled) {
          void handle.remove()
          return
        }
        remove = () => {
          void handle.remove()
        }
      } catch {
        /* web preview — no native lifecycle */
      }
    })()
    return () => {
      cancelled = true
      remove?.()
    }
  }, [])

  const settings = useQwStore((s) => s.settings)
  const extensionCatalog = useQwStore((s) => s.extensionCatalog)
  const setExtensionCatalog = useQwStore((s) => s.setExtensionCatalog)
  const theme = useQwStore((s) => s.resolvedTheme)
  const showOnboarding = useQwStore((s) => s.showOnboarding)
  const showTour = useQwStore((s) => s.showTour)
  const showWelcome = useQwStore((s) => s.showWelcome)
  const showSettings = useQwStore((s) => s.showSettings)
  const showTabs = useQwStore((s) => s.showTabs)
  const showFullGuide = useQwStore((s) => s.showFullGuide)

  useEffect(() => {
    let cancelled = false
    fetchApprovedExtensions()
      .then(({ extensions }) => {
        if (!cancelled && extensions.length) setExtensionCatalog(extensions)
      })
      .catch(() => {
        if (!cancelled) setExtensionCatalog(BUILTIN_EXTENSIONS)
      })
    return () => {
      cancelled = true
    }
  }, [setExtensionCatalog])

  useEffect(() => {
    const accent = resolveAccent(settings.accent, settings.visualStyle, theme)
    document.documentElement.style.setProperty('--qw-accent', accent)
    document.documentElement.style.setProperty(
      '--qw-accent-soft',
      `color-mix(in srgb, ${accent} 14%, transparent)`,
    )
    document.documentElement.dataset.glass = settings.glassIntensity
    document.documentElement.dataset.style = settings.visualStyle
    document.documentElement.dataset.font = settings.uiFont
    document.documentElement.style.setProperty(
      '--qw-font',
      UI_FONTS[settings.uiFont]?.stack ?? UI_FONTS.system.stack,
    )
    document.documentElement.dataset.extNight = hasExtensionEffect(
      settings.installedExtensions,
      extensionCatalog,
      'night-tint',
    )
      ? '1'
      : '0'
    document.documentElement.dataset.extCompact = hasExtensionEffect(
      settings.installedExtensions,
      extensionCatalog,
      'compact-bar',
    )
      ? '1'
      : '0'
  }, [
    settings.accent,
    settings.glassIntensity,
    settings.visualStyle,
    settings.uiFont,
    settings.installedExtensions,
    extensionCatalog,
    theme,
  ])

  return (
    <div className="qw-app">
      <div className="phone-frame" data-layout={settings.chromeLayout}>
        <div className="browser-shell">
          <div className="glass-atmosphere" aria-hidden />
          <BrowserView />
          <BrowserChrome />
          {hasExtensionEffect(settings.installedExtensions, extensionCatalog, 'night-tint') && (
            <div className="night-tint-overlay" aria-hidden />
          )}
          {showSettings && <SettingsSheet />}
          {showTabs && <TabsSheet />}
          {showFullGuide && <FullCustomizationGuide />}
          {showOnboarding && <Onboarding />}
          {showTour && !showOnboarding && !showFullGuide && <FeatureTour />}
          {showWelcome && <WelcomeCeremony />}
        </div>
      </div>
    </div>
  )
}
