import { useEffect } from 'react'
import { ACCENT_COLORS, resolveIconSrc } from './types/customization'
import { useQwStore } from './store/qwStore'
import { BrowserChrome } from './components/chrome/BrowserChrome'
import { BrowserView } from './components/chrome/BrowserView'
import { Onboarding } from './components/onboarding/Onboarding'
import { SettingsSheet, TabsSheet } from './components/settings/SettingsSheet'
import { FullCustomizationGuide } from './components/settings/FullCustomizationGuide'
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
        meta.setAttribute('content', resolved === 'dark' ? '#000000' : '#f5f5f7')
      }
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

  const settings = useQwStore((s) => s.settings)
  const showOnboarding = useQwStore((s) => s.showOnboarding)
  const showSettings = useQwStore((s) => s.showSettings)
  const showTabs = useQwStore((s) => s.showTabs)
  const showFullGuide = useQwStore((s) => s.showFullGuide)

  useEffect(() => {
    const accent = ACCENT_COLORS[settings.accent]
    document.documentElement.style.setProperty('--qw-accent', accent)
    document.documentElement.style.setProperty(
      '--qw-accent-soft',
      `color-mix(in srgb, ${accent} 22%, transparent)`,
    )
    document.documentElement.dataset.glass = settings.glassIntensity
  }, [settings.accent, settings.glassIntensity])

  return (
    <div className="qw-app">
      <div className="phone-frame" data-layout={settings.chromeLayout}>
        <div className="browser-shell">
          <div className="glass-atmosphere" aria-hidden />
          <BrowserView />
          <BrowserChrome />
          {showSettings && <SettingsSheet />}
          {showTabs && <TabsSheet />}
          {showFullGuide && <FullCustomizationGuide />}
          {showOnboarding && <Onboarding />}
        </div>
      </div>
    </div>
  )
}
