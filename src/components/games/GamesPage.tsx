import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useQwStore } from '../../store/qwStore'
import { gamePowerUps } from '../../types/customization'

type Screen = 'hub' | 'reflex' | 'memory' | 'pulse'

const PAIRS = ['◆', '●', '▲', '■', '★', '✚']

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Offline games — no network required */
export function GamesPage() {
  const [screen, setScreen] = useState<Screen>('hub')
  const settings = useQwStore((s) => s.settings)
  const unlockAchievement = useQwStore((s) => s.unlockAchievement)
  const power = useMemo(
    () => gamePowerUps(settings.xp, settings.unlockedAchievements),
    [settings.xp, settings.unlockedAchievements],
  )

  useEffect(() => {
    unlockAchievement('gamer')
  }, [unlockAchievement])

  if (screen === 'reflex') return <ReflexGame power={power} onBack={() => setScreen('hub')} />
  if (screen === 'memory') return <MemoryGame power={power} onBack={() => setScreen('hub')} />
  if (screen === 'pulse') return <PulseGame power={power} onBack={() => setScreen('hub')} />

  return (
    <div className="games-page">
      <header className="games-hero games-hero-compact">
        <p className="games-kicker">qw://games</p>
        <h1>Games</h1>
        <p>
          Offline · Level {power.level} · {settings.xp} XP
        </p>
      </header>

      <div className="games-grid">
        <button type="button" className="game-tile glass glass-card" onClick={() => setScreen('reflex')}>
          <strong>Reflex</strong>
          <span>Tap when it flashes</span>
        </button>
        <button type="button" className="game-tile glass glass-card" onClick={() => setScreen('memory')}>
          <strong>Memory</strong>
          <span>Match the pairs</span>
        </button>
        <button type="button" className="game-tile glass glass-card" onClick={() => setScreen('pulse')}>
          <strong>Pulse</strong>
          <span>Keep the ring alive</span>
        </button>
      </div>

      <div className="games-preview-stage games-preview-mini" aria-hidden>
        <div className="games-preview-scene">
          <div className="gp-sky" />
          <div className="gp-floor" />
          <div className="gp-orb" />
          <div className="gp-ship" />
        </div>
        <div className="games-preview-veil">
          <span>Soon</span>
          <strong>3D Worlds</strong>
        </div>
        <div className="games-hex-badge">
          <span>Preview</span>
        </div>
      </div>
    </div>
  )
}

function GameShell({
  title,
  onBack,
  children,
  footer,
}: {
  title: string
  onBack: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="games-page game-play">
      <div className="game-top">
        <button type="button" className="ghost-link" onClick={onBack}>
          ← Games
        </button>
        <h2>{title}</h2>
      </div>
      {children}
      {footer}
    </div>
  )
}

function ReflexGame({
  power,
  onBack,
}: {
  power: ReturnType<typeof gamePowerUps>
  onBack: () => void
}) {
  const unlockAchievement = useQwStore((s) => s.unlockAchievement)
  const [phase, setPhase] = useState<'wait' | 'go' | 'miss' | 'hit'>('wait')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)

  useEffect(() => {
    if (phase !== 'wait') return
    const t = window.setTimeout(() => setPhase('go'), 700 + Math.random() * 1600)
    return () => window.clearTimeout(t)
  }, [phase, score])

  useEffect(() => {
    if (phase !== 'go') return
    const t = window.setTimeout(() => {
      setPhase('miss')
      setScore(0)
    }, power.reflexWindowMs)
    return () => window.clearTimeout(t)
  }, [phase, power.reflexWindowMs])

  useEffect(() => {
    if (phase !== 'miss' && phase !== 'hit') return
    const t = window.setTimeout(() => setPhase('wait'), 600)
    return () => window.clearTimeout(t)
  }, [phase])

  const tap = () => {
    if (phase === 'go') {
      const next = score + 1 + power.scoreBonus
      setScore(next)
      setBest((b) => Math.max(b, next))
      setPhase('hit')
      if (next >= 8) unlockAchievement('reflex-pro')
    } else if (phase === 'wait') {
      setPhase('miss')
      setScore(0)
    }
  }

  return (
    <GameShell
      title="Reflex"
      onBack={onBack}
      footer={
        <p className="games-meta">
          {score} · best {best} · {power.reflexWindowMs}ms
        </p>
      }
    >
      <button type="button" className={clsx('reflex-pad glass glass-card', phase)} onClick={tap}>
        {phase === 'wait' && 'Wait…'}
        {phase === 'go' && 'TAP'}
        {phase === 'hit' && 'Nice'}
        {phase === 'miss' && 'Miss'}
      </button>
    </GameShell>
  )
}

function MemoryGame({
  power,
  onBack,
}: {
  power: ReturnType<typeof gamePowerUps>
  onBack: () => void
}) {
  const unlockAchievement = useQwStore((s) => s.unlockAchievement)
  const deck = useMemo(() => shuffle([...PAIRS, ...PAIRS]), [])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [lock, setLock] = useState(false)
  const [moves, setMoves] = useState(0)
  const [peeking, setPeeking] = useState(true)

  useEffect(() => {
    setPeeking(true)
    const t = window.setTimeout(() => setPeeking(false), power.memoryPeekMs)
    return () => window.clearTimeout(t)
  }, [power.memoryPeekMs])

  useEffect(() => {
    if (matched.length === deck.length && deck.length > 0 && moves <= 40) {
      unlockAchievement('memory-master')
    }
  }, [matched, deck.length, moves, unlockAchievement])

  const flip = (i: number) => {
    if (peeking || lock || flipped.includes(i) || matched.includes(i)) return
    const next = [...flipped, i]
    setFlipped(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      setLock(true)
      const [a, b] = next
      if (deck[a] === deck[b]) {
        setMatched((m) => [...m, a, b])
        setFlipped([])
        setLock(false)
      } else {
        window.setTimeout(() => {
          setFlipped([])
          setLock(false)
        }, 480)
      }
    }
  }

  return (
    <GameShell
      title="Memory"
      onBack={onBack}
      footer={
        <p className="games-meta">
          Moves {moves}
          {matched.length === deck.length ? ' · Cleared' : ''}
        </p>
      }
    >
      <div className="memory-grid">
        {deck.map((sym, i) => {
          const open = peeking || flipped.includes(i) || matched.includes(i)
          return (
            <button
              key={`${sym}-${i}`}
              type="button"
              className={clsx('memory-card glass', open && 'open', matched.includes(i) && 'matched')}
              onClick={() => flip(i)}
            >
              {open ? sym : ''}
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}

function PulseGame({
  power,
  onBack,
}: {
  power: ReturnType<typeof gamePowerUps>
  onBack: () => void
}) {
  const [alive, setAlive] = useState(true)
  const [energy, setEnergy] = useState(100)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!alive) return
    const id = window.setInterval(() => {
      setEnergy((e) => {
        const next = e - (2.2 - Math.min(1.2, power.level * 0.08))
        if (next <= 0) {
          setAlive(false)
          return 0
        }
        return next
      })
    }, 80)
    return () => window.clearInterval(id)
  }, [alive, power.level])

  const pulse = () => {
    if (!alive) {
      setAlive(true)
      setEnergy(100)
      setScore(0)
      return
    }
    setEnergy((e) => Math.min(100, e + 14 + power.scoreBonus))
    setScore((s) => s + 1 + power.scoreBonus)
  }

  return (
    <GameShell
      title="Pulse"
      onBack={onBack}
      footer={<p className="games-meta">Score {score}</p>}
    >
      <button
        type="button"
        className={clsx('pulse-ring glass glass-card', !alive && 'dead')}
        onClick={pulse}
      >
        <i style={{ transform: `scale(${0.35 + (energy / 100) * 0.65})` }} />
        <span>{alive ? 'Tap' : 'Restart'}</span>
      </button>
      <div className="energy-bar">
        <i style={{ width: `${energy}%` }} />
      </div>
    </GameShell>
  )
}
