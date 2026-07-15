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
      if (meta) meta.setAttribute('content', resolved === 'dark' ? '#000000' : '#f2f2f7')
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
    const href = resolveIconSrc(appIcon, theme)
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.type = 'image/png'
    link.href = href

    let apple = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']")
    if (!apple) {
      apple = document.createElement('link')
      apple.rel = 'apple-touch-icon'
      document.head.appendChild(apple)
    }
    apple.href = href
  }, [appIcon, theme])
}

export default function App() {
  useResolvedTheme()
  useDynamicFavicon()

  const settings = useQwStore((s) => s.settings)
  const showOnboarding = useQwStore((s) => s.showOnboarding)
  const showSettings = useQwStore((s) => s.showSettings)
  const showTabs = useQwStore((s) => s.showTabs)
  const showFullGuide = useQwStore((s) => s.showFullGuide)

  useEffect(() => {
    document.documentElement.style.setProperty('--qw-accent', ACCENT_COLORS[settings.accent])
    document.documentElement.dataset.glass = settings.glassIntensity
  }, [settings.accent, settings.glassIntensity])

  return (
    <div className="qw-app">
      <div className="phone-frame" data-layout={settings.chromeLayout}>
        <div className="browser-shell">
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
