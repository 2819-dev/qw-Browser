import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEFAULT_SETTINGS,
  normalizeIconVariant,
  titleForQwUrl,
  isQwInternal,
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
  type AchievementId,
  type UiFont,
  ACHIEVEMENTS,
} from '../types/customization'
import {
  BUILTIN_EXTENSIONS,
  type CatalogExtension,
} from '../lib/extensionCatalog'

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
  showTour: boolean
  showWelcome: boolean
  resolvedTheme: 'light' | 'dark'
  /** Approved catalog from API (or builtins). Not persisted. */
  extensionCatalog: CatalogExtension[]

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
  setUiFont: (font: UiFont) => void
  setAppIcon: (variant: IconVariant) => void
  setStartPageContent: (content: StartPageContent) => void
  setControl: (key: keyof ControlSet, value: boolean) => void
  completeOnboarding: () => void
  completeTour: () => void
  completeWelcome: () => void
  unlockAchievement: (id: AchievementId) => void
  recordSiteVisit: (url: string) => void
  toggleBookmark: (url?: string) => void
  toggleExtension: (id: string) => void
  setExtensionCatalog: (catalog: CatalogExtension[]) => void
  restartTour: () => void

  // ui
  setShowSettings: (v: boolean) => void
  setShowTabs: (v: boolean) => void
  setShowFullGuide: (v: boolean) => void
  setShowTour: (v: boolean) => void
  setShowWelcome: (v: boolean) => void
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
    title: titleForQwUrl(url),
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
      showTour: false,
      showWelcome: false,
      resolvedTheme: 'dark',
      extensionCatalog: BUILTIN_EXTENSIONS,

      setSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),

      patchSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetSettings: () => {
        const tab = makeTab('qw://start')
        set({
          settings: {
            ...DEFAULT_SETTINGS,
            onboardingComplete: true,
            tourComplete: true,
            welcomeSeen: true,
            fullGuideComplete: get().settings.fullGuideComplete,
          },
          tabs: [tab],
          activeTabId: tab.id,
          showOnboarding: false,
          showTour: false,
          showWelcome: false,
          showSettings: false,
          showTabs: false,
          showFullGuide: false,
          extensionCatalog: BUILTIN_EXTENSIONS,
        })
      },

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
        set((s) => {
          let uiFont = s.settings.uiFont
          if (
            visualStyle === 'cyber' &&
            (uiFont === 'system' || uiFont === 'rounded')
          ) {
            uiFont = 'cyber'
          } else if (visualStyle !== 'cyber' && uiFont === 'cyber') {
            uiFont = 'system'
          }
          return { settings: { ...s.settings, visualStyle, uiFont } }
        }),

      setUiFont: (uiFont) => set((s) => ({ settings: { ...s.settings, uiFont } })),

      setAppIcon: (appIcon) => set((s) => ({ settings: { ...s.settings, appIcon } })),

      setStartPageContent: (startPageContent) =>
        set((s) => ({ settings: { ...s.settings, startPageContent } })),

      setControl: (key, value) => {
        // Settings must always stay available
        if (key === 'settings') return
        set((s) => ({
          settings: {
            ...s.settings,
            controls: { ...s.settings.controls, [key]: value },
          },
        }))
      },

      completeOnboarding: () =>
        set((s) => ({
          settings: { ...s.settings, onboardingComplete: true },
          showOnboarding: false,
          showTour: true,
        })),

      completeTour: () =>
        set((s) => ({
          settings: { ...s.settings, tourComplete: true },
          showTour: false,
          showWelcome: true,
          showSettings: false,
          showTabs: false,
        })),

      completeWelcome: () => {
        get().unlockAchievement('welcome')
        set((s) => ({
          settings: { ...s.settings, welcomeSeen: true },
          showWelcome: false,
        }))
      },

      unlockAchievement: (id) => {
        const { settings } = get()
        if (settings.unlockedAchievements.includes(id)) return
        const def = ACHIEVEMENTS.find((a) => a.id === id)
        const xp = settings.xp + (def?.xp ?? 0)
        set({
          settings: {
            ...settings,
            unlockedAchievements: [...settings.unlockedAchievements, id],
            xp,
          },
        })
      },

      recordSiteVisit: (url) => {
        if (!url.startsWith('http')) return
        const { settings } = get()
        const sitesVisited = settings.sitesVisited + 1
        const patch: Partial<typeof settings> = { sitesVisited }
        set({ settings: { ...settings, ...patch } })
        get().unlockAchievement('first-search')
        if (sitesVisited >= 10) get().unlockAchievement('explorer-10')
        if (sitesVisited >= 100) get().unlockAchievement('explorer-100')
      },

      toggleBookmark: (url?: string) => {
        const state = get()
        const target = url ?? state.activeTab().url
        if (!target.startsWith('http')) return
        const list = state.settings.favoriteShortcuts
        const exists = list.includes(target)
        const favoriteShortcuts = exists
          ? list.filter((u) => u !== target)
          : [...list, target]
        set({
          settings: {
            ...state.settings,
            favoriteShortcuts,
            startPageContent:
              !exists && state.settings.startPageContent === 'blank'
                ? 'favorites'
                : state.settings.startPageContent,
          },
        })
      },

      toggleExtension: (id) => {
        const { settings } = get()
        const list = settings.installedExtensions ?? []
        const on = list.includes(id)
        const installedExtensions = on ? list.filter((x) => x !== id) : [...list, id]
        set({ settings: { ...settings, installedExtensions } })
        if (!on) get().unlockAchievement('first-extension')
      },

      setExtensionCatalog: (extensionCatalog) => set({ extensionCatalog }),

      setShowSettings: (showSettings) => {
        set({ showSettings })
        if (showSettings) get().unlockAchievement('customizer')
      },
      setShowTabs: (showTabs) => set({ showTabs }),
      setShowFullGuide: (showFullGuide) => set({ showFullGuide }),
      setShowTour: (showTour) => set({ showTour }),
      setShowWelcome: (showWelcome) => set({ showWelcome }),
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
      restartTour: () =>
        set((s) => ({
          settings: {
            ...s.settings,
            tourComplete: false,
            welcomeSeen: false,
          },
          showTour: true,
          showWelcome: false,
          showSettings: false,
          showTabs: false,
          showOnboarding: false,
        })),

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
        if (get().tabs.length >= 3) get().unlockAchievement('tab-hopper')
      },

      closeTab: (id) => {
        const { tabs, activeTabId, settings } = get()
        if (settings.confirmCloseTab && tabs.length > 1) {
          const tab = tabs.find((t) => t.id === id)
          const ok = window.confirm(`Close “${tab?.title || 'tab'}”?`)
          if (!ok) return
        }
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
        const internal = isQwInternal(url)
        set({
          tabs: tabs.map((t) => {
            if (t.id !== activeTabId) return t
            const history = [...t.history.slice(0, t.historyIndex + 1), url]
            let title = t.title
            if (internal) title = titleForQwUrl(url)
            else if (url.startsWith('http')) {
              try {
                title = new URL(url).hostname.replace(/^www\./, '')
              } catch {
                title = 'Page'
              }
            }
            return {
              ...t,
              url,
              title,
              loading: !internal,
              history,
              historyIndex: history.length - 1,
              canGoBack: history.length > 1,
              canGoForward: false,
            }
          }),
        })
        if (url.startsWith('http')) get().recordSiteVisit(url)
        if (url === 'qw://games') get().unlockAchievement('gamer')
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
              loading: !isQwInternal(url),
              title: isQwInternal(url) ? titleForQwUrl(url) : t.title,
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
              loading: !isQwInternal(url),
              title: isQwInternal(url) ? titleForQwUrl(url) : t.title,
            }
          }),
        })
      },

      reload: () => {
        const { activeTabId, tabs } = get()
        set({
          tabs: tabs.map((t) =>
            t.id === activeTabId && !isQwInternal(t.url) ? { ...t, loading: true } : t,
          ),
        })
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
      name: 'qw-browser-v7',
      partialize: (s) => ({
        settings: s.settings,
        tabs: s.tabs.map((t) => ({
          ...t,
          loading: false,
        })),
        activeTabId: s.activeTabId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.settings.appIcon = normalizeIconVariant(state.settings.appIcon)
          if (!state.settings.visualStyle) {
            state.settings.visualStyle = 'liquid-glass'
          }
          if (!state.settings.uiFont) {
            state.settings.uiFont = 'system'
          }
          if (!state.settings.accent) {
            state.settings.accent = 'mono'
          }
          state.settings.unlockedAchievements ??= []
          state.settings.sitesVisited ??= 0
          state.settings.xp ??= 0
          state.settings.installedExtensions ??= []
          state.settings.tourComplete ??= false
          state.settings.welcomeSeen ??= false
          state.settings.controls = {
            ...state.settings.controls,
            settings: true,
          }
          if (!state.tabs?.length) {
            const tab = makeTab('qw://start')
            state.tabs = [tab]
            state.activeTabId = tab.id
          } else if (!state.tabs.some((t) => t.id === state.activeTabId)) {
            state.activeTabId = state.tabs[0].id
          }
          state.showOnboarding = !state.settings.onboardingComplete
          state.showTour =
            state.settings.onboardingComplete && !state.settings.tourComplete
          state.showWelcome =
            state.settings.tourComplete && !state.settings.welcomeSeen
        }
      },
    },
  ),
)

export { normalizeUrl }
