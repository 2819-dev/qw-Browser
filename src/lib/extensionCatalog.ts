import type { ExtensionId } from '../types/customization'

export type CatalogExtension = {
  id: string
  title: string
  description: string
  glyph: string
  author: string
  effect: ExtensionId | 'none'
  status?: 'pending' | 'approved' | 'rejected'
  version?: string
}

/** Offline / fallback catalog when the API is unreachable. */
export const BUILTIN_EXTENSIONS: CatalogExtension[] = [
  {
    id: 'focus-mode',
    title: 'Focus',
    description: 'Hide share & bookmark buttons while browsing',
    glyph: '◎',
    author: 'qw',
    effect: 'focus-mode',
  },
  {
    id: 'night-tint',
    title: 'Night Tint',
    description: 'Warm amber wash over pages after dark',
    glyph: '☾',
    author: 'qw',
    effect: 'night-tint',
  },
  {
    id: 'compact-bar',
    title: 'Compact Bar',
    description: 'Tighter chrome padding on the bottom bar',
    glyph: '═',
    author: 'qw',
    effect: 'compact-bar',
  },
  {
    id: 'speed-dial',
    title: 'Speed Dial',
    description: 'Force favorites on the start page',
    glyph: '⌘',
    author: 'qw',
    effect: 'speed-dial',
  },
  {
    id: 'privacy-lock',
    title: 'Privacy Lock',
    description: 'Always show the HTTPS lock badge',
    glyph: '⌀',
    author: 'qw',
    effect: 'privacy-lock',
  },
  {
    id: 'quiet-start',
    title: 'Quiet Start',
    description: 'Hide the big app icon on start',
    glyph: '·',
    author: 'qw',
    effect: 'quiet-start',
  },
]

const EFFECT_IDS: ExtensionId[] = [
  'focus-mode',
  'night-tint',
  'compact-bar',
  'speed-dial',
  'privacy-lock',
  'quiet-start',
]

export function isEffectId(value: string): value is ExtensionId {
  return (EFFECT_IDS as string[]).includes(value)
}

/** Whether an installed catalog id applies the given chrome effect. */
export function hasExtensionEffect(
  installed: string[] | undefined,
  catalog: CatalogExtension[],
  effect: ExtensionId,
): boolean {
  const list = installed ?? []
  return list.some((id) => {
    if (id === effect) return true
    const entry = catalog.find((e) => e.id === id)
    return entry?.effect === effect
  })
}

export async function fetchApprovedExtensions(): Promise<{
  extensions: CatalogExtension[]
  online: boolean
}> {
  const res = await fetch('/api/extensions')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as {
    extensions?: CatalogExtension[]
    online?: boolean
  }
  return {
    extensions: data.extensions ?? [],
    online: data.online !== false,
  }
}
