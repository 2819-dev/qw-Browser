/**
 * Safe native (Capacitor) wrappers.
 *
 * These wrappers are designed so the web build never crashes, even when
 * @capacitor/* is not installed or fails to load. All native calls are
 * wrapped in try/catch and fall back to sensible web behavior.
 *
 * Do not import this file at the top of any critical module without a
 * try/catch on the caller side — the imports themselves are safe (they use
 * dynamic `import()`), but the module still initializes state on load.
 */

type StatusBarTheme = 'light' | 'dark'

let cachedIsNative: boolean | null = null

async function loadCore() {
  try {
    const mod = await import('@capacitor/core')
    return mod
  } catch {
    return null
  }
}

/**
 * True when running inside a Capacitor native shell (iOS/Android).
 * Returns false on the web, or if @capacitor/core can't be loaded.
 *
 * NOTE: Capacitor.isNativePlatform() is synchronous once the module has
 * been resolved. We cache the result after the first call.
 */
export function isNative(): boolean {
  if (cachedIsNative !== null) return cachedIsNative
  try {
    const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }
    if (w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function') {
      cachedIsNative = !!w.Capacitor.isNativePlatform()
      return cachedIsNative
    }
  } catch {
    /* ignore */
  }
  cachedIsNative = false
  return false
}

/**
 * Trigger a light haptic tap. Uses Capacitor Haptics on native, and
 * falls back to navigator.vibrate on web when available. Silently
 * no-ops if neither is available.
 */
export async function hapticLight(): Promise<void> {
  if (isNative()) {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
      await Haptics.impact({ style: ImpactStyle.Light })
      return
    } catch {
      /* fall through to web vibrate */
    }
  }
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(10)
    }
  } catch {
    /* ignore */
  }
}

/**
 * Update the native status bar style. On web this is a no-op.
 *
 * @param theme 'light' → dark text on light background (Style.Light)
 *              'dark'  → light text on dark background (Style.Dark)
 */
export async function setStatusBar(theme: StatusBarTheme): Promise<void> {
  if (!isNative()) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({
      style: theme === 'dark' ? Style.Dark : Style.Light,
    })
  } catch {
    /* ignore — plugin not installed / not on native */
  }
}

/**
 * Hide the launch splash screen. Safe to call on web.
 */
export async function hideSplash(): Promise<void> {
  if (!isNative()) return
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide()
  } catch {
    /* ignore */
  }
}

// Pre-warm the isNative check so first call is synchronous-friendly.
void loadCore().then((mod) => {
  if (cachedIsNative !== null) return
  try {
    cachedIsNative = !!mod?.Capacitor?.isNativePlatform?.()
  } catch {
    cachedIsNative = false
  }
})
