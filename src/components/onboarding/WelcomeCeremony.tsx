import { useRef } from 'react'
import { QwAppIcon } from '../glass/QwAppIcon'
import { useQwStore } from '../../store/qwStore'
import { levelFromXp } from '../../types/customization'

export function WelcomeCeremony() {
  const theme = useQwStore((s) => s.resolvedTheme)
  const settings = useQwStore((s) => s.settings)
  const completeWelcome = useQwStore((s) => s.completeWelcome)
  const badgeRef = useRef<HTMLDivElement>(null)

  const saveBadge = async () => {
    const node = badgeRef.current
    if (!node) return
    // Simple canvas badge export without extra deps
    const canvas = document.createElement('canvas')
    canvas.width = 840
    canvas.height = 840
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const grad = ctx.createLinearGradient(0, 0, 840, 840)
    grad.addColorStop(0, '#111113')
    grad.addColorStop(1, '#2c2c2e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 840, 840)

    ctx.fillStyle = 'rgba(255,255,255,0.96)'
    ctx.beginPath()
    ctx.roundRect(90, 90, 660, 660, 72)
    ctx.fill()

    ctx.fillStyle = '#0b0b0f'
    ctx.font = '700 96px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('qw.', 420, 360)

    ctx.fillStyle = '#1c1c1e'
    ctx.font = '600 42px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillText('Welcome badge', 420, 450)

    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.font = '500 28px -apple-system, BlinkMacSystemFont, sans-serif'
    ctx.fillText(`Level ${levelFromXp(settings.xp + 50)}`, 420, 520)

    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qw-welcome-badge.png'
    a.click()

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(url)).blob()
        const file = new File([blob], 'qw-welcome-badge.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Welcome to qw' })
        }
      } catch {
        /* ignore cancel */
      }
    }
  }

  return (
    <div className="welcome-root" role="dialog" aria-label="Welcome to qw">
      <div className="welcome-burst" aria-hidden />
      <div className="welcome-panel">
        <div className="welcome-badge glass glass-card" ref={badgeRef}>
          <QwAppIcon variant={settings.appIcon} theme={theme} size={88} />
          <h2>Welcome to qw</h2>
          <p>Your first badge. Save it — more unlock as you explore.</p>
          <div className="welcome-meta">
            <span>+50 XP</span>
            <span>Level {levelFromXp(settings.xp + 50)}</span>
          </div>
        </div>
        <div className="welcome-actions">
          <button type="button" className="ghost" onClick={() => void saveBadge()}>
            Save badge
          </button>
          <button type="button" className="primary" onClick={completeWelcome}>
            Start browsing
          </button>
        </div>
        <p className="welcome-foot">
          Play offline at qw://games · extend qw at qw://extensions
        </p>
      </div>
    </div>
  )
}
