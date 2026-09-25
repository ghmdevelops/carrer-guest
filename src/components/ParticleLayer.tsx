import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { GROUND_H } from '../game/constants'

type ParticleKind = 'shard' | 'dust' | 'text'

interface Particle {
  id: number
  kind: ParticleKind
  x: number
  y: number
  dx: number
  dy: number
  size: number
  color: string
  text?: string
}

export interface ParticleHandle {
  burst: (x: number, y: number, color: string, count?: number) => void
  dust: (x: number, y: number) => void
  text: (x: number, y: number, value: string, color: string) => void
}

const SHARD_TTL = 780
const DUST_TTL = 560
const TEXT_TTL = 950

export function ParticleLayer({ api }: { api: RefObject<ParticleHandle | null> }) {
  const [items, setItems] = useState<Particle[]>([])
  const nextId = useRef(0)

  const push = useCallback((created: Particle[], ttl: number) => {
    setItems((prev) => [...prev, ...created])
    window.setTimeout(() => {
      const ids = new Set(created.map((p) => p.id))
      setItems((prev) => prev.filter((p) => !ids.has(p.id)))
    }, ttl)
  }, [])

  const burst = useCallback<ParticleHandle['burst']>(
    (x, y, color, count = 11) => {
      const created = Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * (i + 0.5)) / count
        const power = 70 + Math.random() * 70
        return {
          id: nextId.current++,
          kind: 'shard' as const,
          x,
          y,
          dx: Math.cos(angle) * power,
          dy: -Math.sin(angle) * power,
          size: 4 + Math.round(Math.random() * 4),
          color,
        }
      })
      push(created, SHARD_TTL)
    },
    [push],
  )

  const dust = useCallback<ParticleHandle['dust']>(
    (x, y) => {
      const created = [-1, 1].map((side) => ({
        id: nextId.current++,
        kind: 'dust' as const,
        x,
        y,
        dx: side * (12 + Math.random() * 16),
        dy: 0,
        size: 8 + Math.round(Math.random() * 5),
        color: 'rgba(196, 181, 253, 0.5)',
      }))
      push(created, DUST_TTL)
    },
    [push],
  )

  const text = useCallback<ParticleHandle['text']>(
    (x, y, value, color) => {
      push(
        [{ id: nextId.current++, kind: 'text', x, y, dx: 0, dy: 0, size: 0, color, text: value }],
        TEXT_TTL,
      )
    },
    [push],
  )

  useEffect(() => {
    api.current = { burst, dust, text }
    return () => {
      api.current = null
    }
  }, [api, burst, dust, text])

  return (
    <>
      {items.map((particle) => {
        const base = {
          left: particle.x,
          bottom: GROUND_H + particle.y,
          '--dx': `${particle.dx}px`,
          '--dy': `${particle.dy}px`,
        } as CSSProperties

        if (particle.kind === 'text') {
          return (
            <span
              key={particle.id}
              className="particle-text font-pixel"
              style={{ ...base, color: particle.color }}
            >
              {particle.text}
            </span>
          )
        }

        return (
          <span
            key={particle.id}
            className={particle.kind === 'dust' ? 'particle-dust' : 'particle-shard'}
            style={{
              ...base,
              width: particle.size,
              height: particle.size,
              background: particle.color,
            }}
          />
        )
      })}
    </>
  )
}
