export type ThemeMode = 'system' | 'light' | 'dark'

export type ChromeLayout =
  | 'safari' // search top, controls bottom
  | 'quiche-bottom' // search + controls unified blob at bottom
  | 'quiche-top' // search + controls unified blob at top
  | 'inverted' // controls top, search bottom
  | 'controls-top' // controls only on top, search bottom separate
  | 'search-only' // just a search bar, no controls chrome
  | 'minimal' // floating search, gesture-first / no chrome chrome bar

export type SearchBarStyle = 'pill' | 'rounded' | 'square' | 'capsule'

export type GlassIntensity = 'subtle' | 'medium' | 'strong'

/** Overall UI look */
export type VisualStyle = 'liquid-glass' | 'classic' | 'cyber'

export const VISUAL_STYLES: Record<
  VisualStyle,
  { title: string; subtitle: string }
> = {
  'liquid-glass': {
    title: 'Liquid Glass',
    subtitle: 'Frosted, soft, Apple-like blur',
  },
  classic: {
    title: 'Classic',
    subtitle: 'Clean solids. Simple and clear',
  },
  cyber: {
    title: 'Cyber',
    subtitle: 'Neon, glow, gamer energy',
  },
}

export type AccentName =
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'teal'
  | 'green'
  | 'mono'

export type WallpaperId =
  | 'none'
  | 'aurora'
  | 'mesh'
  | 'orb'
  | 'mist'
  | 'dawn'
  | 'night'
  | 'coral'
  | 'solid'

export type LoadingIcon =
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'ring'
  | 'bars'
  | 'qw'

export type StartPageContent = 'favorites' | 'blank' | 'suggestions' | 'wallpaper-only'

/** Icon style family — each has light + dark assets that swap with theme */
export type IconVariant =
  | 'classic'
  | 'gradient-blue'
  | 'sunset'
  | 'sky'
  | 'gold'
  | 'pro-mono'

export const ICON_FAMILIES: Record<
  IconVariant,
  { title: string; subtitle: string; pro?: boolean }
> = {
  classic: { title: 'Classic', subtitle: 'Black / white qw.' },
  'gradient-blue': {
    title: 'Gradient Blue',
    subtitle: 'Deep navy → electric blue',
    pro: true,
  },
  sunset: { title: 'Sunset', subtitle: 'Rose → gold → yellow', pro: true },
  sky: { title: 'Sky Blue', subtitle: 'Soft periwinkle glass' },
  gold: { title: 'Gold', subtitle: 'Metallic sheen' },
  'pro-mono': {
    title: 'Mono Glass',
    subtitle: 'White / dark with depth',
    pro: true,
  },
}

export function resolveIconSrc(
  family: IconVariant,
  theme: 'light' | 'dark',
): string {
  return `/icons/${family}-${theme}.png`
}

/** Migrate older placeholder icon ids */
export function normalizeIconVariant(value: unknown): IconVariant {
  const legacy: Record<string, IconVariant> = {
    auto: 'classic',
    light: 'classic',
    dark: 'classic',
    glass: 'sky',
    mono: 'pro-mono',
  }
  if (typeof value === 'string' && value in ICON_FAMILIES) return value as IconVariant
  if (typeof value === 'string' && value in legacy) return legacy[value]
  return 'classic'
}

export type ControlSet = {
  back: boolean
  forward: boolean
  reload: boolean
  tabs: boolean
  share: boolean
  bookmarks: boolean
  settings: boolean
  home: boolean
}

export type QwSettings = {
  // Meta
  onboardingComplete: boolean
  fullGuideComplete: boolean

  // Appearance
  themeMode: ThemeMode
  visualStyle: VisualStyle
  accent: AccentName
  glassIntensity: GlassIntensity
  reduceMotion: boolean
  appIcon: IconVariant

  // Chrome layout
  chromeLayout: ChromeLayout
  searchBarStyle: SearchBarStyle
  showStatusHints: boolean
  urlAlwaysExpanded: boolean
  controls: ControlSet

  // Start page
  startPageUrl: string
  startPageContent: StartPageContent
  wallpaper: WallpaperId
  showQwWordmark: boolean
  favoriteShortcuts: string[]

  // Behavior
  searchEngine: 'duckduckgo' | 'google' | 'bing' | 'ecosia' | 'brave'
  loadingIcon: LoadingIcon
  openLinksInNewTab: boolean
  confirmCloseTab: boolean
  haptics: boolean

  // Privacy-ish prefs (UI level)
  clearOnExit: boolean
  showHttpsBadge: boolean
}

export const DEFAULT_SETTINGS: QwSettings = {
  onboardingComplete: false,
  fullGuideComplete: false,

  themeMode: 'system',
  visualStyle: 'liquid-glass',
  accent: 'mono',
  glassIntensity: 'medium',
  reduceMotion: false,
  appIcon: 'classic',

  chromeLayout: 'quiche-bottom',
  searchBarStyle: 'capsule',
  showStatusHints: true,
  urlAlwaysExpanded: false,
  controls: {
    back: true,
    forward: true,
    reload: true,
    tabs: true,
    share: false,
    bookmarks: true,
    settings: true,
    home: false,
  },

  startPageUrl: 'qw://start',
  startPageContent: 'blank',
  wallpaper: 'none',
  showQwWordmark: true,
  favoriteShortcuts: [],

  searchEngine: 'duckduckgo',
  loadingIcon: 'qw',
  openLinksInNewTab: false,
  confirmCloseTab: false,
  haptics: true,

  clearOnExit: false,
  showHttpsBadge: true,
}

export const ACCENT_COLORS: Record<AccentName, string> = {
  blue: '#0A84FF',
  indigo: '#5E5CE6',
  purple: '#BF5AF2',
  pink: '#FF375F',
  orange: '#FF9F0A',
  teal: '#64D2FF',
  green: '#30D158',
  mono: '#8E8E93',
}

export const LAYOUT_META: Record<
  ChromeLayout,
  { title: string; subtitle: string; preview: string }
> = {
  'quiche-bottom': {
    title: 'Together',
    subtitle: 'Search and buttons in one bar at the bottom',
    preview: 'bottom together',
  },
  'quiche-top': {
    title: 'Together up top',
    subtitle: 'Search and buttons in one bar at the top',
    preview: 'top together',
  },
  safari: {
    title: 'Split',
    subtitle: 'Search above, buttons below',
    preview: 'split',
  },
  inverted: {
    title: 'Flipped',
    subtitle: 'Buttons above, search below',
    preview: 'flipped',
  },
  'controls-top': {
    title: 'Buttons up',
    subtitle: 'Buttons on top, search at the bottom',
    preview: 'buttons top',
  },
  'search-only': {
    title: 'Just search',
    subtitle: 'Only the search bar — clean and quiet',
    preview: 'search only',
  },
  minimal: {
    title: 'Floating',
    subtitle: 'A light search bar that nearly disappears',
    preview: 'floating',
  },
}

export const WALLPAPER_META: Record<WallpaperId, { title: string; css: string }> = {
  none: { title: 'None', css: 'transparent' },
  aurora: {
    title: 'Aurora',
    css: 'radial-gradient(ellipse at 20% 20%, #5e5ce6aa, transparent 50%), radial-gradient(ellipse at 80% 30%, #0a84ff88, transparent 45%), radial-gradient(ellipse at 40% 80%, #bf5af266, transparent 50%), linear-gradient(160deg, #0b0b12, #12141f)',
  },
  mesh: {
    title: 'Mesh',
    css: 'conic-gradient(from 180deg at 50% 50%, #0a84ff55, #bf5af255, #ff375f44, #30d15844, #0a84ff55)',
  },
  orb: {
    title: 'Orb',
    css: 'radial-gradient(circle at 50% 35%, #64d2ffaa 0%, #5e5ce688 25%, transparent 55%), linear-gradient(180deg, #0a0a0f, #1a1030)',
  },
  mist: {
    title: 'Mist',
    css: 'linear-gradient(135deg, #e8eef8 0%, #d5dee9 40%, #c8d4e6 100%)',
  },
  dawn: {
    title: 'Dawn',
    css: 'linear-gradient(160deg, #ffb199 0%, #ff7eb3 35%, #7b68ee 100%)',
  },
  night: {
    title: 'Night',
    css: 'radial-gradient(ellipse at top, #1c2a4a, #050508 70%)',
  },
  coral: {
    title: 'Coral',
    css: 'linear-gradient(145deg, #ff9a8b, #ff6a88 40%, #ff99ac)',
  },
  solid: {
    title: 'Solid',
    css: 'var(--qw-bg)',
  },
}

export const SEARCH_ENGINE_URLS: Record<QwSettings['searchEngine'], string> = {
  duckduckgo: 'https://duckduckgo.com/?q=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  ecosia: 'https://www.ecosia.org/search?q=',
  brave: 'https://search.brave.com/search?q=',
}
