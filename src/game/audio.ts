let ctx: AudioContext | null = null
let muted = false

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface ToneOptions {
  freq: number
  to?: number
  duration: number
  type?: OscillatorType
  gain?: number
  delay?: number
}

function tone({ freq, to, duration, type = 'square', gain = 0.06, delay = 0 }: ToneOptions) {
  const ac = context()
  if (!ac || muted) return
  const start = ac.currentTime + delay
  const osc = ac.createOscillator()
  const vol = ac.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (to !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + duration)

  vol.gain.setValueAtTime(0.0001, start)
  vol.gain.exponentialRampToValueAtTime(gain, start + 0.012)
  vol.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  osc.connect(vol).connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export const sfx = {
  jump: () => tone({ freq: 340, to: 760, duration: 0.16, gain: 0.05 }),
  bump: () => tone({ freq: 180, to: 90, duration: 0.12, type: 'triangle', gain: 0.07 }),
  coin: () => {
    tone({ freq: 988, duration: 0.07, gain: 0.045 })
    tone({ freq: 1319, duration: 0.14, gain: 0.045, delay: 0.07 })
  },
  unlock: () => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => tone({ freq, duration: 0.13, gain: 0.05, delay: i * 0.075 }))
  },
  powerUp: () => {
    const notes = [392, 523, 659, 880, 1175]
    notes.forEach((freq, i) => tone({ freq, duration: 0.11, gain: 0.05, delay: i * 0.055 }))
  },
  spin: () => tone({ freq: 220, to: 900, duration: 0.28, type: 'sawtooth', gain: 0.035 }),
  mount: () => {
    tone({ freq: 294, duration: 0.12, gain: 0.055, type: 'triangle' })
    tone({ freq: 440, duration: 0.12, gain: 0.055, type: 'triangle', delay: 0.1 })
    tone({ freq: 587, duration: 0.24, gain: 0.055, type: 'triangle', delay: 0.2 })
  },
  finish: () => {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319]
    notes.forEach((freq, i) => tone({ freq, duration: 0.2, gain: 0.05, delay: i * 0.13 }))
  },
  ui: () => tone({ freq: 620, duration: 0.06, gain: 0.035, type: 'sine' }),
}

export function setMuted(next: boolean) {
  muted = next
}

export function primeAudio() {
  context()
}
