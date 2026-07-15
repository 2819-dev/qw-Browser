/** SVG app icon variants for qw — light / dark / glass / mono */
type IconProps = { size?: number; className?: string }

export function QwIconLight({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qwLightBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5F7FA" />
          <stop offset="100%" stopColor="#D9E2EC" />
        </linearGradient>
        <linearGradient id="qwLightMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A84FF" />
          <stop offset="100%" stopColor="#5E5CE6" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="url(#qwLightBg)" />
      <rect x="8" y="8" width="112" height="112" rx="24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fontFamily="-apple-system,SF Pro Display,Helvetica,Arial,sans-serif"
        fontSize="52"
        fontWeight="700"
        fill="url(#qwLightMark)"
        letterSpacing="-3"
      >
        qw
      </text>
    </svg>
  )
}

export function QwIconDark({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qwDarkBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1C1C1E" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="qwDarkMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64D2FF" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="url(#qwDarkBg)" />
      <rect x="8" y="8" width="112" height="112" rx="24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fontFamily="-apple-system,SF Pro Display,Helvetica,Arial,sans-serif"
        fontSize="52"
        fontWeight="700"
        fill="url(#qwDarkMark)"
        letterSpacing="-3"
      >
        qw
      </text>
    </svg>
  )
}

export function QwIconGlass({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qwGlassBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8C8FF" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#D4B8FF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7EB8FF" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="qwGlassShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="url(#qwGlassBg)" />
      <rect width="128" height="128" rx="28" fill="url(#qwGlassShine)" />
      <rect x="8" y="8" width="112" height="112" rx="24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fontFamily="-apple-system,SF Pro Display,Helvetica,Arial,sans-serif"
        fontSize="52"
        fontWeight="700"
        fill="#fff"
        letterSpacing="-3"
      >
        qw
      </text>
    </svg>
  )
}

export function QwIconMono({ size = 64, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="128" height="128" rx="28" fill="#111" />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fontFamily="-apple-system,SF Pro Display,Helvetica,Arial,sans-serif"
        fontSize="52"
        fontWeight="700"
        fill="#F5F5F7"
        letterSpacing="-3"
      >
        qw
      </text>
    </svg>
  )
}

export function QwAppIcon({
  variant,
  theme,
  size = 64,
}: {
  variant: 'auto' | 'light' | 'dark' | 'glass' | 'mono'
  theme: 'light' | 'dark'
  size?: number
}) {
  const resolved =
    variant === 'auto' ? (theme === 'dark' ? 'dark' : 'light') : variant
  switch (resolved) {
    case 'dark':
      return <QwIconDark size={size} />
    case 'glass':
      return <QwIconGlass size={size} />
    case 'mono':
      return <QwIconMono size={size} />
    default:
      return <QwIconLight size={size} />
  }
}
