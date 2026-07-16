import { useEffect } from 'react'
import { useQwStore } from '../../store/qwStore'

/** Coming-soon advertisement surface for qw://games */
export function GamesPage() {
  const unlockAchievement = useQwStore((s) => s.unlockAchievement)
  const xp = useQwStore((s) => s.settings.xp)
  const sites = useQwStore((s) => s.settings.sitesVisited)

  useEffect(() => {
    unlockAchievement('gamer')
  }, [unlockAchievement])

  return (
    <div className="games-page games-coming-soon">
      <header className="games-hero games-hero-compact">
        <p className="games-kicker">qw://games</p>
        <h1>Coming soon</h1>
        <p>Explore the web. Earn power. Play only on qw.</p>
      </header>

      <div className="games-preview-stage" aria-hidden>
        <div className="games-preview-scene">
          <div className="gp-sky" />
          <div className="gp-floor" />
          <div className="gp-pillar gp-a" />
          <div className="gp-pillar gp-b" />
          <div className="gp-pillar gp-c" />
          <div className="gp-orb" />
          <div className="gp-ship" />
          <div className="gp-glow" />
        </div>
        <div className="games-preview-veil">
          <span>3D Worlds</span>
          <strong>Built for qw</strong>
        </div>
        <div className="games-hex-badge" title="Preview">
          <span>Preview</span>
        </div>
      </div>

      <div className="games-teaser glass glass-card">
        <strong>Your progress carries over</strong>
        <p>
          {xp} XP · {sites} sites visited — achievements unlock in-game power-ups when Games
          launches.
        </p>
      </div>
    </div>
  )
}
