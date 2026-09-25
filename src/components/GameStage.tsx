import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { timeline } from '../data/career'
import { useI18n } from '../i18n/locale'
import { buildLevel, type PowerUpKind } from '../game/level'
import { useInput } from '../game/useInput'
import { useGameEngine, type ActiveEffects, type EnemyElements } from '../game/useGameEngine'
import { primeAudio, setMuted as setAudioMuted, sfx } from '../game/audio'
import { BLOCK_SIZE } from '../game/constants'
import { Background } from './Background'
import { Ground } from './Ground'
import { QuestionBlock } from './QuestionBlock'
import { Coin } from './Coin'
import { Enemy } from './Enemy'
import { PowerUp } from './PowerUp'
import { Flag } from './Flag'
import { Player } from './Player'
import { ParticleLayer, type ParticleHandle } from './ParticleLayer'
import { Hud } from './Hud'
import { ExperienceCard } from './ExperienceCard'
import { StartScreen } from './StartScreen'
import { EndScreen } from './EndScreen'
import { TouchControls } from './TouchControls'

const MUTE_KEY = 'career-quest:muted'
const NO_EFFECTS: ActiveEffects = { coffee: false, shield: false, dino: false }

const POWERUP_COLOR: Record<PowerUpKind, string> = {
  coffee: '#fbbf24',
  shield: '#34d399',
  dino: '#22c55e',
}

type Phase = 'intro' | 'playing' | 'finished'

export function GameStage() {
  const { t } = useI18n()
  const level = useMemo(() => buildLevel(timeline.map((entry) => entry.kind)), [])

  const [phase, setPhase] = useState<Phase>('intro')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [discovered, setDiscovered] = useState<ReadonlySet<number>>(() => new Set())
  const [collected, setCollected] = useState<ReadonlySet<number>>(() => new Set())
  const [bugs, setBugs] = useState(0)
  const [effects, setEffects] = useState<ActiveEffects>(NO_EFFECTS)
  const [muted, setMutedState] = useState(false)
  const [hurtAt, setHurtAt] = useState(0)

  const discoveredRef = useRef<Set<number>>(new Set())
  const collectedRef = useRef<Set<number>>(new Set())

  const stage = useRef<HTMLDivElement>(null)
  const player = useRef<HTMLDivElement>(null)
  const sprite = useRef<HTMLDivElement>(null)
  const spriteWrap = useRef<HTMLDivElement>(null)
  const dino = useRef<HTMLDivElement>(null)
  const dinoSprite = useRef<HTMLDivElement>(null)
  const shield = useRef<HTMLDivElement>(null)
  const blocks = useRef<Map<number, HTMLElement>>(new Map())
  const enemies = useRef<Map<number, EnemyElements>>(new Map())
  const powerUps = useRef<Map<number, HTMLElement>>(new Map())
  const particles = useRef<ParticleHandle | null>(null)
  const refs = useMemo(
    () => ({ stage, player, sprite, spriteWrap, dino, dinoSprite, shield, blocks, enemies, powerUps }),
    [],
  )

  const active = phase === 'playing' && activeIndex === null
  const input = useInput(active)

  useEffect(() => {
    const saved = window.localStorage.getItem(MUTE_KEY) === '1'
    setMutedState(saved)
    setAudioMuted(saved)
  }, [])

  useEffect(() => {
    setAudioMuted(muted)
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  }, [muted])

  const toggleMute = useCallback(() => setMutedState((prev) => !prev), [])

  const handleBlockHit = useCallback(
    (index: number) => {
      const entry = timeline[index]
      const block = level.blocks[index]
      particles.current?.burst(block.x + BLOCK_SIZE / 2, block.y, entry.accent)

      if (!discoveredRef.current.has(index)) {
        discoveredRef.current.add(index)
        setDiscovered(new Set(discoveredRef.current))
        particles.current?.text(block.x + BLOCK_SIZE / 2, block.y + BLOCK_SIZE, '+1', entry.accent)
        window.setTimeout(() => sfx.unlock(), 110)
      }
      setActiveIndex(index)
    },
    [level],
  )

  const handleCoin = useCallback((index: number) => {
    collectedRef.current.add(index)
    setCollected(new Set(collectedRef.current))
  }, [])

  const handleStomp = useCallback(
    (_index: number, x: number, y: number) => {
      setBugs((prev) => prev + 1)
      particles.current?.burst(x, y, '#ef4444', 9)
      particles.current?.text(x, y + 30, t('bugFixed'), '#f87171')
    },
    [t],
  )

  const handleHurt = useCallback((x: number, y: number) => {
    setHurtAt(Date.now())
    particles.current?.burst(x, y, '#ef4444', 6)
  }, [])

  const handleDust = useCallback((x: number, y: number) => {
    particles.current?.dust(x, y)
  }, [])

  const handlePowerUp = useCallback(
    (kind: PowerUpKind, x: number, y: number) => {
      const color = POWERUP_COLOR[kind]
      const label = kind === 'coffee' ? t('boostSpeed') : kind === 'shield' ? t('boostShield') : t('boostDino')
      particles.current?.burst(x, y, color, 12)
      particles.current?.text(x, y + 26, label, color)
    },
    [t],
  )

  const handleEffects = useCallback((next: ActiveEffects) => setEffects(next), [])

  const handleFinish = useCallback(() => {
    setPhase('finished')
    sfx.finish()
  }, [])

  const { reset } = useGameEngine({
    level,
    input,
    refs,
    active,
    onBlockHit: handleBlockHit,
    onCoin: handleCoin,
    onStomp: handleStomp,
    onHurt: handleHurt,
    onDust: handleDust,
    onPowerUp: handlePowerUp,
    onEffects: handleEffects,
    onFinish: handleFinish,
  })

  const start = useCallback(() => {
    primeAudio()
    sfx.ui()
    setPhase('playing')
  }, [])

  const restart = useCallback(() => {
    reset()
    discoveredRef.current = new Set()
    collectedRef.current = new Set()
    setDiscovered(new Set())
    setCollected(new Set())
    setBugs(0)
    setEffects(NO_EFFECTS)
    setActiveIndex(null)
    setPhase('playing')
    sfx.ui()
  }, [reset])

  const registerBlock = useCallback((index: number, el: HTMLElement | null) => {
    if (el) blocks.current.set(index, el)
    else blocks.current.delete(index)
  }, [])

  const registerEnemy = useCallback((index: number, elements: EnemyElements | null) => {
    if (elements) enemies.current.set(index, elements)
    else enemies.current.delete(index)
  }, [])

  const registerPowerUp = useCallback((index: number, el: HTMLElement | null) => {
    if (el) powerUps.current.set(index, el)
    else powerUps.current.delete(index)
  }, [])

  const closeCard = useCallback(() => setActiveIndex(null), [])

  return (
    <div ref={stage} className="stage">
      <Background />

      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform:
            'translate3d(calc(var(--cam, 0px) * -1 + var(--shake-x, 0px)), var(--shake-y, 0px), 0)',
        }}
      >
        <Ground width={level.width} props={level.props} />

        {level.coins.map((coin) => (
          <Coin key={coin.index} coin={coin} taken={collected.has(coin.index)} />
        ))}

        {level.blocks.map((block) => (
          <QuestionBlock
            key={block.index}
            block={block}
            entry={timeline[block.index]}
            discovered={discovered.has(block.index)}
            register={registerBlock}
          />
        ))}

        {level.powerUps.map((item) => (
          <PowerUp key={item.index} item={item} register={registerPowerUp} />
        ))}

        {level.enemies.map((enemy) => (
          <Enemy key={enemy.index} enemy={enemy} register={registerEnemy} />
        ))}

        <Flag x={level.flagX} reached={phase === 'finished'} />
        <Player
          rootRef={player}
          spriteRef={sprite}
          spriteWrapRef={spriteWrap}
          dinoRef={dino}
          dinoSpriteRef={dinoSprite}
          shieldRef={shield}
        />
        <ParticleLayer api={particles} />
      </div>

      <div className="scanlines" />
      <div className="vignette" />
      {hurtAt > 0 && <div key={hurtAt} className="hurt-flash" />}

      {phase !== 'intro' && (
        <Hud
          total={timeline.length}
          discovered={discovered.size}
          coins={collected.size}
          bugs={bugs}
          effects={effects}
          muted={muted}
          onToggleMute={toggleMute}
        />
      )}

      {active && discovered.size === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-32 z-20 flex justify-center px-4">
          <p className="glass rounded-full px-4 py-2 text-center font-pixel text-[8px] leading-relaxed text-neon">
            {t('scrollHint')} {'>>'}
          </p>
        </div>
      )}

      {active && discovered.size > 0 && bugs === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-32 z-20 flex justify-center px-4">
          <p className="glass rounded-full px-4 py-2 text-center font-pixel text-[8px] leading-relaxed text-magenta">
            {t('stompHint')}
          </p>
        </div>
      )}

      <ExperienceCard
        entry={activeIndex === null ? null : timeline[activeIndex]}
        order={(activeIndex ?? 0) + 1}
        total={timeline.length}
        onClose={closeCard}
      />

      {active && <TouchControls input={input} />}

      <AnimatePresence>
        {phase === 'intro' && <StartScreen key="start" onStart={start} />}
        {phase === 'finished' && (
          <EndScreen
            key="end"
            discovered={discovered.size}
            coins={collected.size}
            totalCoins={level.coins.length}
            bugs={bugs}
            onRestart={restart}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
