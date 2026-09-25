import { useCallback, useEffect, useRef, type RefObject } from 'react'
import {
  BLOCK_EDGE_INSET,
  BLOCK_SIZE,
  BUG_H,
  BUG_W,
  BUMP_VELOCITY,
  CAMERA_ANCHOR,
  CAMERA_LERP,
  COFFEE_DURATION,
  COFFEE_SPEED_MULT,
  COIN_PICK_RADIUS,
  COIN_SIZE,
  COYOTE_TIME,
  DINO_RIDE_OFFSET,
  GRAVITY,
  HIT_STOP,
  HURT_KNOCKBACK_X,
  HURT_KNOCKBACK_Y,
  INVULN_TIME,
  JUMP_BUFFER,
  JUMP_VELOCITY,
  MAX_FALL_SPEED,
  MIN_JUMP_VELOCITY,
  MOUNTED_H,
  MOUNTED_JUMP_MULT,
  MOUNTED_SPEED_MULT,
  MOVE_SPEED,
  PLAYER_H,
  PLAYER_START_X,
  PLAYER_W,
  POWERUP_POP_VELOCITY,
  POWERUP_SIZE,
  SHAKE_MAGNITUDE,
  SHAKE_TIME,
  SPIN_FALL_SPEED,
  SPIN_TIME,
  SPIN_TURNS,
  STOMP_BOUNCE,
  STOMP_TOLERANCE,
} from './constants'
import type { Level, PowerUpKind } from './level'
import { BUG_FRAMES, DINO_FRAMES, FRAMES, type FrameName } from './sprite'
import { sfx } from './audio'
import type { InputState } from './useInput'

const LAND_SQUASH_TIME = 0.16
const RUN_DUST_INTERVAL = 0.24
const BUG_DEATH_TIME = 0.7

export interface ActiveEffects {
  coffee: boolean
  shield: boolean
  dino: boolean
}

export interface EnemyElements {
  root: HTMLElement
  sprite: HTMLElement
}

export interface EngineRefs {
  stage: RefObject<HTMLDivElement | null>
  player: RefObject<HTMLDivElement | null>
  sprite: RefObject<HTMLDivElement | null>
  spriteWrap: RefObject<HTMLDivElement | null>
  dino: RefObject<HTMLDivElement | null>
  dinoSprite: RefObject<HTMLDivElement | null>
  shield: RefObject<HTMLDivElement | null>
  blocks: RefObject<Map<number, HTMLElement>>
  enemies: RefObject<Map<number, EnemyElements>>
  powerUps: RefObject<Map<number, HTMLElement>>
}

interface EngineOptions {
  level: Level
  input: RefObject<InputState>
  refs: EngineRefs
  active: boolean
  onBlockHit: (index: number) => void
  onCoin: (index: number) => void
  onStomp: (index: number, x: number, y: number) => void
  onHurt: (x: number, y: number) => void
  onDust: (x: number, y: number) => void
  onPowerUp: (kind: PowerUpKind, x: number, y: number) => void
  onEffects: (effects: ActiveEffects) => void
  onFinish: () => void
}

interface EnemyRuntime {
  x: number
  dir: 1 | -1
  alive: boolean
  dying: number
  anim: number
}

interface PowerUpRuntime {
  x: number
  y: number
  vx: number
  vy: number
  released: boolean
  landed: boolean
  taken: boolean
}

// Empurra o item para fora do bloco em vez de deixa-lo cair por dentro dele.
const POWERUP_DRIFT = 110

interface Body {
  x: number
  y: number
  vy: number
  knockback: number
  facing: 1 | -1
  onGround: boolean
  coyote: number
  buffer: number
  animTime: number
  dustTimer: number
  landSquash: number
  invuln: number
  hitStop: number
  shake: number
  spin: number
  spinUsed: boolean
  mounted: boolean
  coffee: number
  shield: boolean
  camX: number
  frame: FrameName
  finished: boolean
}

function initialBody(): Body {
  return {
    x: PLAYER_START_X,
    y: 0,
    vy: 0,
    knockback: 0,
    facing: 1,
    onGround: true,
    coyote: COYOTE_TIME,
    buffer: 0,
    animTime: 0,
    dustTimer: 0,
    landSquash: 0,
    invuln: 0,
    hitStop: 0,
    shake: 0,
    spin: 0,
    spinUsed: false,
    mounted: false,
    coffee: 0,
    shield: false,
    camX: 0,
    frame: 'idle',
    finished: false,
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function useGameEngine({
  level,
  input,
  refs,
  active,
  onBlockHit,
  onCoin,
  onStomp,
  onHurt,
  onDust,
  onPowerUp,
  onEffects,
  onFinish,
}: EngineOptions) {
  const body = useRef<Body>(initialBody())
  const taken = useRef<Set<number>>(new Set())
  const opened = useRef<Set<number>>(new Set())
  const enemyState = useRef<Map<number, EnemyRuntime>>(new Map())
  const powerUpState = useRef<Map<number, PowerUpRuntime>>(new Map())
  const effects = useRef<ActiveEffects>({ coffee: false, shield: false, dino: false })
  const viewWidth = useRef(1280)
  const levelRef = useRef(level)
  const activeRef = useRef(active)
  const handlers = useRef({ onBlockHit, onCoin, onStomp, onHurt, onDust, onPowerUp, onEffects, onFinish })

  levelRef.current = level
  activeRef.current = active
  handlers.current = { onBlockHit, onCoin, onStomp, onHurt, onDust, onPowerUp, onEffects, onFinish }

  const seedEntities = useCallback(() => {
    const bugs = new Map<number, EnemyRuntime>()
    for (const enemy of levelRef.current.enemies) {
      bugs.set(enemy.index, { x: enemy.from, dir: 1, alive: true, dying: 0, anim: 0 })
    }
    enemyState.current = bugs

    const items = new Map<number, PowerUpRuntime>()
    for (const item of levelRef.current.powerUps) {
      items.set(item.index, {
        x: item.x,
        y: item.y,
        vx: 0,
        vy: 0,
        released: false,
        landed: false,
        taken: false,
      })
    }
    powerUpState.current = items
  }, [])

  const paint = useCallback(() => {
    const s = body.current
    const stage = refs.stage.current
    if (stage) {
      stage.style.setProperty('--cam', `${s.camX}px`)
      if (s.shake > 0) {
        const k = (s.shake / SHAKE_TIME) * SHAKE_MAGNITUDE
        stage.style.setProperty('--shake-x', `${(Math.random() * 2 - 1) * k}px`)
        stage.style.setProperty('--shake-y', `${(Math.random() * 2 - 1) * k}px`)
      } else {
        stage.style.setProperty('--shake-x', '0px')
        stage.style.setProperty('--shake-y', '0px')
      }
    }

    const player = refs.player.current
    if (player) {
      player.style.transform = `translate3d(${Math.round(s.x)}px, ${-Math.round(s.y)}px, 0)`
      player.style.opacity = s.invuln > 0 && Math.floor(s.invuln * 14) % 2 === 0 ? '0.35' : '1'
    }

    if (refs.spriteWrap.current) {
      refs.spriteWrap.current.style.bottom = s.mounted ? `${DINO_RIDE_OFFSET}px` : '0px'
    }
    if (refs.dino.current) refs.dino.current.style.display = s.mounted ? 'block' : 'none'
    if (refs.shield.current) refs.shield.current.style.opacity = s.shield ? '1' : '0'

    if (s.mounted && refs.dinoSprite.current) {
      const moving = Math.abs(s.animTime) > 0 && s.frame !== 'idle'
      refs.dinoSprite.current.style.boxShadow =
        moving && Math.floor(s.animTime * 9) % 2 === 0 ? DINO_FRAMES.walk : DINO_FRAMES.idle
      refs.dinoSprite.current.style.transform = `scaleX(${s.facing})`
    }

    const sprite = refs.sprite.current
    if (sprite) {
      sprite.style.boxShadow = FRAMES[s.frame]
      let sx = 1
      let sy = 1
      if (s.landSquash > 0) {
        const k = s.landSquash / LAND_SQUASH_TIME
        sx = 1 + 0.3 * k
        sy = 1 - 0.28 * k
      } else if (!s.onGround) {
        const t = Math.abs(clamp(s.vy / JUMP_VELOCITY, -1, 1))
        sx = 1 - 0.1 * t
        sy = 1 + 0.13 * t
      }
      sprite.style.transform =
        s.spin > 0
          ? `rotateY(${(1 - s.spin / SPIN_TIME) * SPIN_TURNS}deg) scaleY(${sy})`
          : `scaleX(${s.facing * sx}) scaleY(${sy})`
    }

    for (const [index, runtime] of enemyState.current) {
      const el = refs.enemies.current.get(index)
      if (!el) continue
      el.root.style.transform = `translate3d(${Math.round(runtime.x)}px, 0, 0)`
      if (!runtime.alive) {
        el.sprite.style.boxShadow = BUG_FRAMES.squashed
        el.root.style.opacity = String(Math.max(0, runtime.dying / BUG_DEATH_TIME))
        continue
      }
      el.sprite.style.boxShadow = Math.floor(runtime.anim * 7) % 2 === 0 ? BUG_FRAMES.walkA : BUG_FRAMES.walkB
      el.sprite.style.transform = `scaleX(${runtime.dir})`
    }

    for (const [index, runtime] of powerUpState.current) {
      const el = refs.powerUps.current.get(index)
      if (!el) continue
      el.style.opacity = runtime.released && !runtime.taken ? '1' : '0'
      el.style.transform = `translate3d(${Math.round(runtime.x)}px, ${-Math.round(runtime.y)}px, 0)`
    }
  }, [refs])

  const reset = useCallback(() => {
    body.current = initialBody()
    taken.current.clear()
    opened.current.clear()
    effects.current = { coffee: false, shield: false, dino: false }
    seedEntities()
    for (const el of refs.enemies.current.values()) el.root.style.opacity = '1'
    handlers.current.onEffects(effects.current)
    paint()
  }, [paint, refs, seedEntities])

  const bumpBlock = useCallback(
    (index: number) => {
      const el = refs.blocks.current.get(index)
      if (!el) return
      el.classList.remove('is-bumping')
      void el.offsetWidth
      el.classList.add('is-bumping')
      window.setTimeout(() => el.classList.remove('is-bumping'), 320)
    },
    [refs],
  )

  useEffect(() => {
    seedEntities()
  }, [seedEntities])

  useEffect(() => {
    const stage = refs.stage.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      viewWidth.current = entry.contentRect.width
    })
    observer.observe(stage)
    viewWidth.current = stage.clientWidth
    return () => observer.disconnect()
  }, [refs])

  useEffect(() => {
    let frameId = 0
    let last = performance.now()

    const step = (now: number) => {
      frameId = requestAnimationFrame(step)
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      if (!activeRef.current) return

      const s = body.current
      const lvl = levelRef.current
      const keys = input.current

      if (s.shake > 0) s.shake = Math.max(0, s.shake - dt)

      if (s.hitStop > 0) {
        s.hitStop -= dt
        paint()
        return
      }

      const height = s.mounted ? MOUNTED_H : PLAYER_H
      const speed = MOVE_SPEED * (s.coffee > 0 ? COFFEE_SPEED_MULT : 1) * (s.mounted ? MOUNTED_SPEED_MULT : 1)
      const jumpBoost = s.mounted ? MOUNTED_JUMP_MULT : 1

      const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
      if (dir !== 0 && s.knockback <= 0) s.facing = dir > 0 ? 1 : -1

      let vx = dir * speed
      if (s.knockback > 0) {
        s.knockback = Math.max(0, s.knockback - dt)
        vx = -s.facing * HURT_KNOCKBACK_X
      }
      s.x = clamp(s.x + vx * dt, 0, lvl.width - PLAYER_W)

      if (keys.jumpQueued) {
        keys.jumpQueued = false
        if (s.coyote > 0) s.buffer = JUMP_BUFFER
        else if (!s.spinUsed && s.spin <= 0) {
          s.spin = SPIN_TIME
          s.spinUsed = true
          sfx.spin()
        } else s.buffer = JUMP_BUFFER
      }

      s.buffer = Math.max(0, s.buffer - dt)
      s.coyote = Math.max(0, s.coyote - dt)
      s.invuln = Math.max(0, s.invuln - dt)
      s.landSquash = Math.max(0, s.landSquash - dt)
      s.spin = Math.max(0, s.spin - dt)
      s.coffee = Math.max(0, s.coffee - dt)

      if (s.buffer > 0 && s.coyote > 0 && s.knockback <= 0) {
        s.vy = JUMP_VELOCITY * jumpBoost
        s.buffer = 0
        s.coyote = 0
        s.onGround = false
        sfx.jump()
      }

      const minJump = MIN_JUMP_VELOCITY * jumpBoost
      if (!keys.jumpHeld && s.vy > minJump) s.vy = minJump
      s.vy = Math.max(s.vy - GRAVITY * dt, -MAX_FALL_SPEED)
      if (s.spin > 0 && s.vy < SPIN_FALL_SPEED) s.vy = SPIN_FALL_SPEED

      const prevY = s.y
      const wasAirborne = !s.onGround
      s.y += s.vy * dt
      s.onGround = false

      if (s.y <= 0) {
        s.y = 0
        if (wasAirborne) {
          s.landSquash = LAND_SQUASH_TIME
          handlers.current.onDust(s.x + PLAYER_W / 2, 0)
        }
        s.vy = 0
        s.onGround = true
        s.spinUsed = false
      }

      for (const block of lvl.blocks) {
        const overlapX =
          s.x + PLAYER_W > block.x + BLOCK_EDGE_INSET && s.x < block.x + BLOCK_SIZE - BLOCK_EDGE_INSET
        if (!overlapX) continue

        const blockBottom = block.y
        const blockTop = block.y + BLOCK_SIZE

        if (s.vy > 0 && prevY + height <= blockBottom && s.y + height > blockBottom) {
          s.y = blockBottom - height
          s.vy = BUMP_VELOCITY
          s.hitStop = HIT_STOP
          s.shake = SHAKE_TIME
          bumpBlock(block.index)
          sfx.bump()

          if (!opened.current.has(block.index)) {
            opened.current.add(block.index)
            const drop = lvl.powerUps.find((item) => item.blockIndex === block.index)
            const runtime = drop && powerUpState.current.get(drop.index)
            if (drop && runtime && !runtime.released) {
              runtime.released = true
              runtime.vy = POWERUP_POP_VELOCITY
              runtime.vx = POWERUP_DRIFT * s.facing
            }
          }

          handlers.current.onBlockHit(block.index)
        } else if (s.vy <= 0 && prevY >= blockTop && s.y < blockTop) {
          s.y = blockTop
          s.vy = 0
          s.onGround = true
          s.spinUsed = false
        }
      }

      if (s.onGround) s.coyote = COYOTE_TIME

      if (s.onGround && dir !== 0) {
        s.dustTimer += dt
        if (s.dustTimer >= RUN_DUST_INTERVAL) {
          s.dustTimer = 0
          handlers.current.onDust(s.x + PLAYER_W / 2, 0)
        }
      } else {
        s.dustTimer = RUN_DUST_INTERVAL
      }

      for (const enemy of lvl.enemies) {
        const runtime = enemyState.current.get(enemy.index)
        if (!runtime) continue

        if (!runtime.alive) {
          if (runtime.dying > 0) runtime.dying = Math.max(0, runtime.dying - dt)
          continue
        }

        runtime.anim += dt
        runtime.x += runtime.dir * enemy.speed * dt
        if (runtime.x <= enemy.from) {
          runtime.x = enemy.from
          runtime.dir = 1
        } else if (runtime.x >= enemy.to) {
          runtime.x = enemy.to
          runtime.dir = -1
        }

        const overlapX = s.x + PLAYER_W > runtime.x && s.x < runtime.x + BUG_W
        const overlapY = s.y < BUG_H && s.y + height > 0
        if (!overlapX || !overlapY) continue

        const kill = (bounce: number) => {
          runtime.alive = false
          runtime.dying = BUG_DEATH_TIME
          if (bounce > 0) {
            s.vy = bounce
            s.y = BUG_H
          }
          s.hitStop = HIT_STOP
          s.shake = SHAKE_TIME
          sfx.bump()
          handlers.current.onStomp(enemy.index, runtime.x + BUG_W / 2, BUG_H / 2)
        }

        if (s.mounted) kill(0)
        else if (s.spin > 0) kill(STOMP_BOUNCE * 0.65)
        else if (s.vy < 0 && prevY >= BUG_H - STOMP_TOLERANCE) kill(STOMP_BOUNCE)
        else if (s.shield) {
          s.shield = false
          s.invuln = INVULN_TIME
          s.shake = SHAKE_TIME
          sfx.bump()
        } else if (s.invuln <= 0) {
          s.invuln = INVULN_TIME
          s.knockback = 0.22
          s.vy = HURT_KNOCKBACK_Y
          s.shake = SHAKE_TIME
          sfx.bump()
          handlers.current.onHurt(s.x + PLAYER_W / 2, s.y + height / 2)
        }
      }

      for (const item of lvl.powerUps) {
        const runtime = powerUpState.current.get(item.index)
        if (!runtime || !runtime.released || runtime.taken) continue

        if (!runtime.landed) {
          runtime.vy -= GRAVITY * dt
          runtime.y += runtime.vy * dt
          runtime.x = clamp(runtime.x + runtime.vx * dt, 0, lvl.width - POWERUP_SIZE)
          if (runtime.y <= 0) {
            runtime.y = 0
            runtime.vy = 0
            runtime.vx = 0
            runtime.landed = true
          }
        }

        const hit =
          s.x + PLAYER_W > runtime.x &&
          s.x < runtime.x + POWERUP_SIZE &&
          s.y < runtime.y + POWERUP_SIZE &&
          s.y + height > runtime.y
        if (!hit) continue

        runtime.taken = true
        if (item.kind === 'coffee') {
          s.coffee = COFFEE_DURATION
          sfx.powerUp()
        } else if (item.kind === 'shield') {
          s.shield = true
          sfx.powerUp()
        } else {
          s.mounted = true
          sfx.mount()
        }
        handlers.current.onPowerUp(item.kind, runtime.x + POWERUP_SIZE / 2, runtime.y + POWERUP_SIZE / 2)
      }

      const nextEffects: ActiveEffects = { coffee: s.coffee > 0, shield: s.shield, dino: s.mounted }
      const current = effects.current
      if (
        nextEffects.coffee !== current.coffee ||
        nextEffects.shield !== current.shield ||
        nextEffects.dino !== current.dino
      ) {
        effects.current = nextEffects
        handlers.current.onEffects(nextEffects)
      }

      const px = s.x + PLAYER_W / 2
      const py = s.y + height / 2
      for (const coin of lvl.coins) {
        if (taken.current.has(coin.index)) continue
        const dx = px - (coin.x + COIN_SIZE / 2)
        const dy = py - (coin.y + COIN_SIZE / 2)
        if (Math.abs(dx) < COIN_PICK_RADIUS && Math.abs(dy) < COIN_PICK_RADIUS + 12) {
          taken.current.add(coin.index)
          sfx.coin()
          handlers.current.onCoin(coin.index)
        }
      }

      if (!s.finished && s.x + PLAYER_W >= lvl.flagX) {
        s.finished = true
        handlers.current.onFinish()
      }

      if (!s.onGround) s.frame = s.vy > 0 ? 'jump' : 'fall'
      else if (dir !== 0) {
        s.animTime += dt
        s.frame = Math.floor(s.animTime * 9) % 2 === 0 ? 'runA' : 'runB'
      } else {
        s.animTime = 0
        s.frame = 'idle'
      }

      const target = clamp(s.x - viewWidth.current * CAMERA_ANCHOR, 0, Math.max(0, lvl.width - viewWidth.current))
      s.camX += (target - s.camX) * Math.min(1, dt * CAMERA_LERP)

      paint()
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [bumpBlock, input, paint])

  useEffect(() => {
    paint()
  }, [paint])

  return { reset }
}
