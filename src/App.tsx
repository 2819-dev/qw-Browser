import { useEffect } from 'react'
import { ACCENT_COLORS } from './types/customization'
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
      // Sync theme-color / icon hint for PWA install
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

export default function App() {
  useResolvedTheme()

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
