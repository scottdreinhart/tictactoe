/**
 * sounds.js — Domain-level sound synthesis via Web Audio API
 *
 * Pure factory functions that create and play short synthesized tones.
 * No external audio files — everything is generated on the fly.
 * Zero React dependencies.
 */

let audioCtx = null

/**
 * Lazily create / resume the AudioContext.
 * Must be called from a user-gesture handler the first time
 * (browser autoplay policy).
 */
const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Play a short tone.
 * @param {number} frequency  Hz
 * @param {number} duration   seconds
 * @param {string} type       oscillator type
 * @param {number} volume     0–1
 */
const playTone = (frequency, duration, type = 'sine', volume = 0.15) => {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

/**
 * Move placement — short soft click/pop
 */
export const playMoveSound = () => {
  playTone(600, 0.08, 'sine', 0.12)
}

/**
 * Win — triumphant ascending arpeggio (3 notes)
 */
export const playWinSound = () => {
  const ctx = getContext()
  const notes = [523.25, 659.25, 783.99] // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + i * 0.12)
    osc.stop(ctx.currentTime + i * 0.12 + 0.3)
  })
}

/**
 * Draw — neutral descending two-note tone
 */
export const playDrawSound = () => {
  const ctx = getContext()
  const notes = [440, 349.23] // A4, F4
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)

    gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.25)
  })
}
