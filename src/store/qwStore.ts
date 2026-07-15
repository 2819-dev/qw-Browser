import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_SETTINGS,
  normalizeIconVariant,
  type QwSettings,
  type ChromeLayout,
  type AccentName,
  type WallpaperId,
  type LoadingIcon,
  type ThemeMode,
  type SearchBarStyle,
  type GlassIntensity,
  type IconVariant,
  type VisualStyle,
  type StartPageContent,
  type ControlSet,
} from '../types/customization'

type Tab = {
  id: string
  title: string
  url: string
  favicon?: string
  loading: boolean
  canGoBack: boolean
  canGoForward: boolean
  history: string[]
  historyIndex: number
}

type BrowserState = {
  settings: QwSettings
  tabs: Tab[]
  activeTabId: string
  showSettings: boolean
  showTabs: boolean
  showFullGuide: boolean
  showOnboarding: boolean
  resolvedTheme: 'light' | 'dark'

  // settings mutators
  setSetting: <K extends keyof QwSettings>(key: K, value: QwSettings[K]) => void
  patchSettings: (patch: Partial<QwSettings>) => void
  resetSettings: () => void
  setChromeLayout: (layout: ChromeLayout) => void
  setAccent: (accent: AccentName) => void
  setWallpaper: (wallpaper: WallpaperId) => void
  setLoadingIcon: (icon: LoadingIcon) => void
  setThemeMode: (mode: ThemeMode) => void
  setSearchBarStyle: (style: SearchBarStyle) => void
  setGlassIntensity: (intensity: GlassIntensity) => void
  setVisualStyle: (style: VisualStyle) => void
  setAppIcon: (variant: IconVariant) => void
  setStartPageContent: (content: StartPageContent) => void
  setControl: (key: keyof ControlSet, value: boolean) => void
  completeOnboarding: () => void

  // ui
  setShowSettings: (v: boolean) => void
  setShowTabs: (v: boolean) => void
  setShowFullGuide: (v: boolean) => void
  setResolvedTheme: (t: 'light' | 'dark') => void

  // tabs
  activeTab: () => Tab
  createTab: (url?: string) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  navigate: (url: string) => void
  goBack: () => void
  goForward: () => void
  reload: () => void
  goHome: () => void
  setTabLoading: (loading: boolean) => void
  setTabTitle: (title: string) => void
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function makeTab(url = 'qw://start'): Tab {
  return {
    id: uid(),
    title: url === 'qw://start' ? 'Start' : 'New Tab',
    url,
    loading: false,
    canGoBack: false,
    canGoForward: false,
    history: [url],
    historyIndex: 0,
  }
}

function normalizeUrl(input: string, engine: QwSettings['searchEngine']): string {
  const trimmed = input.trim()
  if (!trimmed) return 'qw://start'
  if (trimmed === 'qw://start' || trimmed.startsWith('qw://')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (/^[\w.-]+\.[a-z]{2,}([/:].*)?$/i.test(trimmed)) return `https://${trimmed}`
  const engines = {
    duckduckgo: 'https://duckduckgo.com/?q=',
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    ecosia: 'https://www.ecosia.org/search?q=',
    brave: 'https://search.brave.com/search?q=',
  }
  return `${engines[engine]}${encodeURIComponent(trimmed)}`
}

const initialTab = makeTab()

export const useQwStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      settings: { ...DEFAULT_SETTINGS },
      tabs: [initialTab],
      activeTabId: initialTab.id,
      showSettings: false,
      showTabs: false,
      showFullGuide: false,
      showOnboarding: !DEFAULT_SETTINGS.onboardingComplete,
      resolvedTheme: 'dark',

      setSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),

      patchSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetSettings: () =>
        set({
          settings: { ...DEFAULT_SETTINGS, onboardingComplete: true },
          showOnboarding: false,
        }),

      setChromeLayout: (chromeLayout) =>
        set((s) => ({ settings: { ...s.settings, chromeLayout } })),

      setAccent: (accent) => set((s) => ({ settings: { ...s.settings, accent } })),

      setWallpaper: (wallpaper) =>
        set((s) => ({ settings: { ...s.settings, wallpaper } })),

      setLoadingIcon: (loadingIcon) =>
        set((s) => ({ settings: { ...s.settings, loadingIcon } })),

      setThemeMode: (themeMode) =>
        set((s) => ({ settings: { ...s.settings, themeMode } })),

      setSearchBarStyle: (searchBarStyle) =>
        set((s) => ({ settings: { ...s.settings, searchBarStyle } })),

      setGlassIntensity: (glassIntensity) =>
        set((s) => ({ settings: { ...s.settings, glassIntensity } })),

      setVisualStyle: (visualStyle) =>
        set((s) => ({ settings: { ...s.settings, visualStyle } })),

      setAppIcon: (appIcon) => set((s) => ({ settings: { ...s.settings, appIcon } })),

      setStartPageContent: (startPageContent) =>
        set((s) => ({ settings: { ...s.settings, startPageContent } })),

      setControl: (key, value) =>
        set((s) => ({
          settings: {
            ...s.settings,
            controls: { ...s.settings.controls, [key]: value },
          },
        })),

      completeOnboarding: () =>
        set((s) => ({
          settings: { ...s.settings, onboardingComplete: true },
          showOnboarding: false,
        })),

      setShowSettings: (showSettings) => set({ showSettings }),
      setShowTabs: (showTabs) => set({ showTabs }),
      setShowFullGuide: (showFullGuide) => set({ showFullGuide }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),

      activeTab: () => {
        const { tabs, activeTabId } = get()
        return tabs.find((t) => t.id === activeTabId) ?? tabs[0]
      },

      createTab: (url = 'qw://start') => {
        const tab = makeTab(url)
        set((s) => ({
          tabs: [...s.tabs, tab],
          activeTabId: tab.id,
          showTabs: false,
        }))
      },

      closeTab: (id) => {
        const { tabs, activeTabId } = get()
        if (tabs.length === 1) {
          const tab = makeTab()
          set({ tabs: [tab], activeTabId: tab.id, showTabs: false })
          return
        }
        const next = tabs.filter((t) => t.id !== id)
        const nextActive =
          activeTabId === id ? next[Math.max(0, tabs.findIndex((t) => t.id === id) - 1)].id : activeTabId
        set({ tabs: next, activeTabId: nextActive })
      },

      setActiveTab: (activeTabId) => set({ activeTabId, showTabs: false }),

      navigate: (input) => {
        const { settings, activeTabId, tabs } = get()
        const url = normalizeUrl(input, settings.searchEngine)
        set({
          tabs: tabs.map((t) => {
            if (t.id !== activeTabId) return t
            const history = [...t.history.slice(0, t.historyIndex + 1), url]
            return {
              ...t,
              url,
              title: url === 'qw://start' ? 'Start' : new URL(url.startsWith('http') ? url : 'https://example.com').hostname,
              loading: url !== 'qw://start',
              history,
              historyIndex: history.length - 1,
              canGoBack: history.length > 1,
              canGoForward: false,
            }
          }),
        })
      },

      goBack: () => {
        const { activeTabId, tabs } = get()
        set({
          tabs: tabs.map((t) => {
            if (t.id !== activeTabId || t.historyIndex <= 0) return t
            const historyIndex = t.historyIndex - 1
            const url = t.history[historyIndex]
            return {
              ...t,
              url,
              historyIndex,
              canGoBack: historyIndex > 0,
              canGoForward: true,
              loading: url !== 'qw://start',
              title: url === 'qw://start' ? 'Start' : t.title,
            }
          }),
        })
      },

      goForward: () => {
        const { activeTabId, tabs } = get()
        set({
          tabs: tabs.map((t) => {
            if (t.id !== activeTabId || t.historyIndex >= t.history.length - 1) return t
            const historyIndex = t.historyIndex + 1
            const url = t.history[historyIndex]
            return {
              ...t,
              url,
              historyIndex,
              canGoBack: true,
              canGoForward: historyIndex < t.history.length - 1,
              loading: url !== 'qw://start',
            }
          }),
        })
      },

      reload: () => {
        const { activeTabId, tabs } = get()
        set({
          tabs: tabs.map((t) =>
            t.id === activeTabId && t.url !== 'qw://start' ? { ...t, loading: true } : t,
          ),
        })
        // Force iframe remount via tiny query bounce handled in BrowserView
        setTimeout(() => {
          const state = get()
          set({
            tabs: state.tabs.map((t) =>
              t.id === state.activeTabId ? { ...t, loading: false } : t,
            ),
          })
        }, 600)
      },

      goHome: () => get().navigate(get().settings.startPageUrl || 'qw://start'),

      setTabLoading: (loading) => {
        const { activeTabId, tabs } = get()
        set({
          tabs: tabs.map((t) => (t.id === activeTabId ? { ...t, loading } : t)),
        })
      },

      setTabTitle: (title) => {
        const { activeTabId, tabs } = get()
        set({
          tabs: tabs.map((t) => (t.id === activeTabId ? { ...t, title } : t)),
        })
      },
    }),
    {
      name: 'qw-browser-v3',
      partialize: (s) => ({
        settings: s.settings,
        // keep last tab url lightly — but tabs reset soft for demo safety
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.settings.appIcon = normalizeIconVariant(state.settings.appIcon)
          if (!state.settings.visualStyle) {
            state.settings.visualStyle = 'liquid-glass'
          }
          state.showOnboarding = !state.settings.onboardingComplete
        }
      },
    },
  ),
)

export { normalizeUrl }
