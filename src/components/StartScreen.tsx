import { useEffect } from 'react'
import { motion } from 'motion/react'
import { profile, timeline } from '../data/career'
import { useI18n } from '../i18n/locale'
import { LanguageToggle } from './LanguageToggle'

export function StartScreen({ onStart }: { onStart: () => void }) {
  const { t, L } = useI18n()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Enter' && event.code !== 'Space') return
      event.preventDefault()
      onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStart])

  return (
    <motion.div
      className="absolute inset-0 z-50 overflow-y-auto bg-void/72 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
    >
      <div className="absolute right-4 top-4 z-10">
        <LanguageToggle />
      </div>

      <div className="flex min-h-full items-center justify-center p-5">
        <motion.div
          className="glass sheen w-full max-w-2xl rounded-2xl p-6 md:p-9"
          initial={{ y: 30, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <div className="text-center">
            <h1 className="font-pixel text-2xl leading-[1.5] md:text-4xl md:leading-[1.4]">
              <span className="bg-gradient-to-r from-neon via-grape to-magenta bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
                CAREER
              </span>
              <br />
              <span className="bg-gradient-to-r from-gold via-magenta to-grape bg-clip-text text-transparent">
                QUEST
              </span>
            </h1>

            <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-neon to-transparent" />

            <p className="mt-5 font-pixel text-[11px] text-neon">{profile.name}</p>
            <p className="mt-2.5 text-sm font-medium text-grape">{L(profile.title)}</p>
            <p className="mt-1 text-xs text-grape/60">{L(profile.location)}</p>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/75">
              {L(profile.intro)}
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <section className="rounded-xl border border-neon/25 bg-neon/5 p-4 text-left">
              <h2 className="font-pixel text-[8px] uppercase tracking-wider text-neon">
                {t('aboutWhat')}
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-white/70">{L(profile.about.what)}</p>
            </section>

            <section className="rounded-xl border border-magenta/25 bg-magenta/5 p-4 text-left">
              <h2 className="font-pixel text-[8px] uppercase tracking-wider text-magenta">
                {t('aboutWhy')}
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-white/70">{L(profile.about.why)}</p>
            </section>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-grape/20 bg-void/40 p-4 text-left sm:grid-cols-4">
            <div>
              <p className="font-pixel text-[8px] uppercase text-grape/70">{t('move')}</p>
              <p className="mt-2 flex gap-1">
                <span className="key-cap">A</span>
                <span className="key-cap">D</span>
              </p>
            </div>
            <div>
              <p className="font-pixel text-[8px] uppercase text-grape/70">{t('jump')}</p>
              <p className="mt-2">
                <span className="key-cap">SPACE</span>
              </p>
            </div>
            <div>
              <p className="font-pixel text-[8px] uppercase text-grape/70">{t('spin')}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{t('spinHint')}</p>
            </div>
            <div>
              <p className="font-pixel text-[8px] uppercase text-grape/70">{t('goal')}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{t('hitBlocks')}</p>
            </div>
          </div>

          <button type="button" onClick={onStart} className="btn-pixel mt-6 w-full rounded-none">
            {t('start')}
          </button>

          <p className="mt-4 hidden text-center font-pixel text-[8px] text-grape/60 sm:block">
            {t('pressStart')}
          </p>

          <p className="mt-2 text-center font-pixel text-[8px] text-grape/60">
            {timeline.length} {t('blocksToFind')}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
