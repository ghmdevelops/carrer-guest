import type { PointerEvent, RefObject } from 'react'
import type { InputState } from '../game/useInput'
import { useI18n } from '../i18n/locale'

export function TouchControls({ input }: { input: RefObject<InputState> }) {
  const { t } = useI18n()

  const hold = (key: 'left' | 'right') => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      input.current[key] = true
    },
    onPointerUp: () => {
      input.current[key] = false
    },
    onPointerCancel: () => {
      input.current[key] = false
    },
    onLostPointerCapture: () => {
      input.current[key] = false
    },
  })

  return (
    <div className="touch-controls pointer-events-none absolute inset-x-0 bottom-0 z-30 items-end justify-between p-4">
      <div className="pointer-events-auto flex gap-3">
        <button type="button" aria-label={`${t('move')} <`} className="dpad-btn size-16 rounded-xl text-2xl" {...hold('left')}>
          {'<'}
        </button>
        <button type="button" aria-label={`${t('move')} >`} className="dpad-btn size-16 rounded-xl text-2xl" {...hold('right')}>
          {'>'}
        </button>
      </div>

      <button
        type="button"
        aria-label={t('jump')}
        className="dpad-btn pointer-events-auto size-20 rounded-full font-pixel text-[9px]"
        onPointerDown={(event) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
          if (!input.current.jumpHeld) input.current.jumpQueued = true
          input.current.jumpHeld = true
        }}
        onPointerUp={() => {
          input.current.jumpHeld = false
        }}
        onPointerCancel={() => {
          input.current.jumpHeld = false
        }}
        onLostPointerCapture={() => {
          input.current.jumpHeld = false
        }}
      >
        {t('jump')}
      </button>
    </div>
  )
}
