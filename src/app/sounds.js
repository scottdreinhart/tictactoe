/**
 * sounds.js — App-level sound synthesis via Web Audio API
 *
 * Factory functions that create and play short synthesized tones
 * using browser AudioContext. Lives in the app layer because it
 * depends on browser APIs (domain must be platform-agnostic).
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
 * Navigation (keyboard, WASD, swipe, swipe) — subtle tick sound for focus movement
 * Higher pitch, faster attack, minimal presence
 */
export const playNavSound = () => {
  playTone(800, 0.05, 'sine', 0.08)
}

/**
 * Tap / Cell selection — satisfying press feedback (thicker than nav)
 * Middle pitch, slightly longer sustain
 */
export const playTapSound = () => {
  playTone(650, 0.07, 'sine', 0.1)
}

/**
 * Win music — triumphant fanfare with harmonics (~2 s)
 * Ascending C-major arpeggio capped by a bright sustained chord.
 */
export const playWinMusic = () => {
  const ctx = getContext()
  const t = ctx.currentTime

  // Melody notes: C4 → E4 → G4 → C5, then a final major chord
  const melody = [
    { freq: 261.63, start: 0,    dur: 0.25 },  // C4
    { freq: 329.63, start: 0.2,  dur: 0.25 },  // E4
    { freq: 392.0,  start: 0.4,  dur: 0.25 },  // G4
    { freq: 523.25, start: 0.6,  dur: 0.6  },  // C5 (sustained)
  ]

  // Final chord: C5 + E5 + G5 together
  const chord = [
    { freq: 523.25, start: 0.9, dur: 0.9 },  // C5
    { freq: 659.25, start: 0.9, dur: 0.9 },  // E5
    { freq: 783.99, start: 0.9, dur: 0.9 },  // G5
  ]

  melody.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, t + start)
    gain.gain.setValueAtTime(0.1, t + start)
    gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + start)
    osc.stop(t + start + dur)
  })

  chord.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t + start)
    gain.gain.setValueAtTime(0.12, t + start)
    gain.gain.linearRampToValueAtTime(0.08, t + start + dur * 0.6)
    gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + start)
    osc.stop(t + start + dur)
  })
}

/**
 * Loss music — sombre descending minor phrase (~2 s)
 * Descending E-minor walk down finishing on a low sustained note.
 */
export const playLossMusic = () => {
  const ctx = getContext()
  const t = ctx.currentTime

  // Descending melody: E4 → D4 → C4 → B3 → low G3
  const notes = [
    { freq: 329.63, start: 0,    dur: 0.35 },  // E4
    { freq: 293.66, start: 0.3,  dur: 0.35 },  // D4
    { freq: 261.63, start: 0.6,  dur: 0.35 },  // C4
    { freq: 246.94, start: 0.9,  dur: 0.35 },  // B3
    { freq: 196.0,  start: 1.2,  dur: 0.8  },  // G3 (sustained)
  ]

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t + start)
    gain.gain.setValueAtTime(0.14, t + start)
    gain.gain.linearRampToValueAtTime(0.06, t + start + dur * 0.5)
    gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + start)
    osc.stop(t + start + dur)
  })

  // Subtle minor third drone underneath the last note
  const drone = ctx.createOscillator()
  const droneGain = ctx.createGain()
  drone.type = 'triangle'
  drone.frequency.setValueAtTime(233.08, t + 1.2) // Bb3 — minor colour
  droneGain.gain.setValueAtTime(0.06, t + 1.2)
  droneGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0)
  drone.connect(droneGain)
  droneGain.connect(ctx.destination)
  drone.start(t + 1.2)
  drone.stop(t + 2.0)
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
