import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { TimelineEntry } from '../data/career'
import { useI18n } from '../i18n/locale'

interface Props {
  entry: TimelineEntry | null
  order: number
  total: number
  onClose: () => void
}

export function ExperienceCard({ entry, order, total, onClose }: Props) {
  const { t, L, LL } = useI18n()
  const openedAt = useRef(0)

  useEffect(() => {
    if (!entry) return
    openedAt.current = performance.now()
    const onKey = (event: KeyboardEvent) => {
      const isDismiss = event.code === 'Escape' || event.code === 'Enter' || event.code === 'Space'
      if (!isDismiss) return
      event.preventDefault()
      if (performance.now() - openedAt.current < 350) return
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entry, onClose])

  const isBonus = entry?.kind === 'bonus'

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="absolute inset-0 z-40 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-void/75 backdrop-blur-[3px]"
          />

          <motion.article
            className="glass relative w-full max-w-2xl overflow-hidden rounded-2xl"
            initial={{ y: 46, scale: 0.92, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 22, scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            style={{ boxShadow: `0 30px 90px -20px ${entry.accent}55, 0 0 0 1px ${entry.accent}33` }}
          >
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(90deg, ${entry.accent}, transparent)` }}
            />

            <div className="scroll-overlay max-h-[78dvh] overflow-y-auto p-5 md:p-7">
              <header className="flex items-start gap-4">
                <div
                  className="grid size-14 shrink-0 place-items-center rounded-lg border-[3px] border-void"
                  style={{ background: `linear-gradient(180deg, ${entry.accent}, ${entry.accent}66)` }}
                >
                  <span className="font-pixel text-[10px] text-void">{entry.badge}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="font-pixel text-[8px] uppercase tracking-widest"
                    style={{ color: entry.accent }}
                  >
                    {isBonus ? t('newBonus') : t('newExperience')} {order}/{total}
                  </p>
                  <h2 className="mt-1.5 truncate font-pixel text-base text-white md:text-lg">
                    {entry.company}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-grape">{L(entry.role)}</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('close')}
                  className="btn-ghost size-8 shrink-0 rounded-md text-xs"
                >
                  X
                </button>
              </header>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-grape/30 bg-void/50 px-3 py-1 text-grape/90">
                  {L(entry.period)}
                </span>
                <span className="rounded-full border border-grape/30 bg-void/50 px-3 py-1 text-grape/90">
                  {L(entry.location)}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                {L(entry.summary)}
              </p>

              <section className="mt-6">
                <h3 className="font-pixel text-[9px] uppercase tracking-wider text-neon">
                  {isBonus ? t('whatIStudied') : t('whatIDid')}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {LL(entry.highlights).map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-white/75">
                      <span
                        className="mt-1.5 size-2 shrink-0 rotate-45"
                        style={{ background: entry.accent }}
                        aria-hidden
                      />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-6">
                <h3 className="font-pixel text-[9px] uppercase tracking-wider text-neon">{t('stack')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border px-2.5 py-1 text-xs font-medium"
                      style={{
                        borderColor: `${entry.accent}55`,
                        color: entry.accent,
                        background: `${entry.accent}14`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <footer className="mt-7 flex items-center justify-between gap-4">
                <p className="hidden items-center gap-2 text-xs text-grape/70 sm:flex">
                  <span className="key-cap">ESC</span>
                  {t('continue')}
                </p>
                <button type="button" onClick={onClose} className="btn-pixel w-full rounded-none sm:w-auto">
                  {t('continue')}
                </button>
              </footer>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
