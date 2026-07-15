import type { IconVariant } from '../../types/customization'
import { resolveIconSrc } from '../../types/customization'

type QwAppIconProps = {
  variant: IconVariant
  theme: 'light' | 'dark'
  size?: number
  className?: string
  /** Force a specific theme asset (e.g. show both light+dark in a picker) */
  forceTheme?: 'light' | 'dark'
  alt?: string
}

export function QwAppIcon({
  variant,
  theme,
  size = 64,
  className,
  forceTheme,
  alt = 'qw',
}: QwAppIconProps) {
  const resolvedTheme = forceTheme ?? theme
  const src = resolveIconSrc(variant, resolvedTheme)

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={className}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: Math.round(size * 0.22),
        display: 'block',
        background: resolvedTheme === 'dark' ? '#1a1d21' : '#ffffff',
      }}
    />
  )
}

/** Preview both light & dark of a family stacked / side by side */
export function QwAppIconPair({
  variant,
  size = 56,
}: {
  variant: IconVariant
  size?: number
}) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <QwAppIcon variant={variant} theme="light" forceTheme="light" size={size} />
      <QwAppIcon variant={variant} theme="dark" forceTheme="dark" size={size} />
    </div>
  )
}
