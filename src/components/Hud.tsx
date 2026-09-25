import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../data/career'
import { useI18n } from '../i18n/locale'
import type { ActiveEffects } from '../game/useGameEngine'
import { LanguageToggle } from './LanguageToggle'

interface Props {
  total: number
  discovered: number
  coins: number
  bugs: number
  effects: ActiveEffects
  muted: boolean
  onToggleMute: () => void
}

function EffectChip({ color, label }: { color: string; label: string }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0.6, opacity: 0, y: -6 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 460, damping: 26 }}
      className="glass flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{ borderColor: `${color}66` }}
    >
      <span
        className="size-2.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      <span className="font-pixel text-[8px]" style={{ color }}>
        {label}
      </span>
    </motion.span>
  )
}

export function Hud({ total, discovered, coins, bugs, effects, muted, onToggleMute }: Props) {
  const { t, L } = useI18n()
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-5">
      <div className="flex flex-col items-start gap-2">
        <div className="pointer-events-auto glass flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="grid size-9 place-items-center rounded-md border-2 border-void bg-gradient-to-br from-neon to-grape">
            <span className="font-pixel text-[9px] text-void">{initials}</span>
          </div>
          <div className="leading-tight">
            <p className="font-pixel text-[9px] text-neon">{profile.name}</p>
            <p className="text-xs text-grape/80">{L(profile.title)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {effects.dino && <EffectChip key="dino" color="#22c55e" label={t('boostDino')} />}
            {effects.coffee && <EffectChip key="coffee" color="#fbbf24" label={t('boostSpeed')} />}
            {effects.shield && <EffectChip key="shield" color="#34d399" label={t('boostShield')} />}
          </AnimatePresence>
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <div className="glass flex items-center gap-2 rounded-lg px-3 py-2" title={t('coins')}>
            <span className="size-3.5 rounded-full border-2 border-void bg-gradient-to-b from-amber-200 to-amber-600" />
            <motion.span
              key={coins}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="font-pixel text-[10px] text-gold"
            >
              {String(coins).padStart(2, '0')}
            </motion.span>
          </div>

          <div className="glass flex items-center gap-2 rounded-lg px-3 py-2" title={t('bugsSquashed')}>
            <span className="size-3.5 rounded-sm border-2 border-void bg-gradient-to-b from-red-400 to-red-700" />
            <motion.span
              key={bugs}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="font-pixel text-[10px] text-red-400"
            >
              {String(bugs).padStart(2, '0')}
            </motion.span>
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={`${t('sound')}: ${muted ? 'off' : 'on'}`}
            aria-pressed={!muted}
            className={`btn-ghost h-10 rounded-lg px-3 font-pixel text-[8px] ${
              muted ? 'text-grape/60' : 'text-mint'
            }`}
          >
            {muted ? 'OFF' : 'ON'}
          </button>
          <LanguageToggle />
        </div>

        <div className="glass flex items-center gap-2 rounded-lg px-3 py-2">
          <span className="font-pixel text-[8px] text-grape/80">{t('progress')}</span>
          <div className="flex gap-1">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 w-3 border transition-colors duration-300 ${
                  i < discovered
                    ? 'border-neon bg-neon shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                    : 'border-grape/40 bg-void/60'
                }`}
              />
            ))}
          </div>
          <span className="font-pixel text-[8px] text-neon">
            {discovered}/{total}
          </span>
        </div>
      </div>
    </div>
  )
}
