import { motion } from 'motion/react'
import { profile, skillGroups, timeline } from '../data/career'
import { useI18n } from '../i18n/locale'

interface Props {
  discovered: number
  coins: number
  totalCoins: number
  bugs: number
  onRestart: () => void
}

export function EndScreen({ discovered, coins, totalCoins, bugs, onRestart }: Props) {
  const { t, L } = useI18n()
  const perfect = discovered === timeline.length

  return (
    <motion.div
      className="absolute inset-0 z-50 grid place-items-center overflow-y-auto bg-void/80 p-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass w-full max-w-2xl rounded-2xl p-6 md:p-8"
        initial={{ y: 40, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="text-center">
          <p className="font-pixel text-[8px] uppercase tracking-[0.3em] text-gold">{t('gameComplete')}</p>
          <h2 className="mt-4 font-pixel text-lg leading-relaxed text-white md:text-2xl">
            {perfect ? t('allFound') : t('missedBlocks')}
          </h2>
          <p className="mt-3 text-sm text-grape">{t('thanksForPlaying')}</p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-neon/25 bg-neon/5 p-4 text-center">
            <p className="font-pixel text-lg text-neon">
              {discovered}/{timeline.length}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-grape/80">{t('blocks')}</p>
          </div>
          <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-center">
            <p className="font-pixel text-lg text-gold">
              {coins}/{totalCoins}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wider text-grape/80">{t('coins')}</p>
          </div>
          <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4 text-center">
            <p className="font-pixel text-lg text-red-400">{bugs}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-grape/80">{t('bugsSquashed')}</p>
          </div>
        </div>

        <section className="mt-7">
          <h3 className="font-pixel text-[9px] uppercase tracking-wider text-neon">{t('skills')}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.label.en} className="rounded-lg border border-grape/20 bg-void/40 p-3">
                <p className="text-xs font-semibold text-grape">{L(group.label)}</p>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <li key={item} className="text-xs text-white/65">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h3 className="font-pixel text-[9px] uppercase tracking-wider text-neon">{t('contact')}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost rounded-lg px-4 py-2.5 text-sm"
              >
                <span className="font-pixel text-[9px] text-neon">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <button type="button" onClick={onRestart} className="btn-pixel mt-8 w-full rounded-none">
          {t('playAgain')}
        </button>
      </motion.div>
    </motion.div>
  )
}
