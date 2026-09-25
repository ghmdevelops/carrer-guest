import { useEffect, useRef, type RefObject } from 'react'

export interface InputState {
  left: boolean
  right: boolean
  jumpHeld: boolean
  jumpQueued: boolean
}

const LEFT_KEYS = new Set(['ArrowLeft', 'KeyA'])
const RIGHT_KEYS = new Set(['ArrowRight', 'KeyD'])
const JUMP_KEYS = new Set(['Space', 'ArrowUp', 'KeyW'])

function emptyState(): InputState {
  return { left: false, right: false, jumpHeld: false, jumpQueued: false }
}

export function useInput(enabled: boolean): RefObject<InputState> {
  const input = useRef<InputState>(emptyState())

  useEffect(() => {
    if (!enabled) {
      input.current = emptyState()
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat && !LEFT_KEYS.has(event.code) && !RIGHT_KEYS.has(event.code)) {
        if (JUMP_KEYS.has(event.code)) event.preventDefault()
        return
      }
      if (LEFT_KEYS.has(event.code)) input.current.left = true
      else if (RIGHT_KEYS.has(event.code)) input.current.right = true
      else if (JUMP_KEYS.has(event.code)) {
        if (!input.current.jumpHeld) input.current.jumpQueued = true
        input.current.jumpHeld = true
      } else return
      event.preventDefault()
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (LEFT_KEYS.has(event.code)) input.current.left = false
      else if (RIGHT_KEYS.has(event.code)) input.current.right = false
      else if (JUMP_KEYS.has(event.code)) input.current.jumpHeld = false
      else return
      event.preventDefault()
    }

    const onBlur = () => {
      input.current = emptyState()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [enabled])

  return input
}
