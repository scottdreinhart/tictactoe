import { useCallback, useEffect, useRef, useState } from 'react'
import { TOKENS, CPU_DELAY_MS } from '../domain/constants.js'
import useWebWorker from './useWebWorker.js'

/**
 * useCpuPlayer — Application hook
 *
 * Manages AI difficulty selection and CPU move scheduling via Web Worker.
 * Split from useTicTacToe to isolate CPU / AI concerns.
 *
 * @param {{
 *   turn: string,
 *   board: Array<null|string>,
 *   isGameOver: boolean,
 *   onCpuMove: (index: number) => void,
 *   onResetCleanup: () => void,
 * }} config
 *
 * @returns {{ difficulty, handleSetDifficulty }}
 */
const useCpuPlayer = ({ turn, board, isGameOver, onCpuMove }) => {
  const [difficulty, setDifficulty] = useState('medium')
  const cpuTimeoutRef = useRef(null)

  const createWorker = useCallback(
    () =>
      new Worker(new URL('../workers/ai.worker.js', import.meta.url), {
        type: 'module',
      }),
    [],
  )
  const { postMessage, setOnMessage, workerRef } = useWebWorker(createWorker)

  // Schedule CPU move when turn switches to CPU
  // Schedule CPU move when turn switches to CPU
  useEffect(() => {
    if (turn !== TOKENS.CPU) return
    if (isGameOver) return

    const worker = workerRef.current

    setOnMessage((event) => {
      const { index, error } = event.data
      if (error) {
        // eslint-disable-next-line no-console
        console.error('AI Worker error:', error)
        return
      }

      cpuTimeoutRef.current = setTimeout(() => {
        onCpuMove(index)
        cpuTimeoutRef.current = null
      }, CPU_DELAY_MS)
    })

    postMessage({
      board,
      difficulty,
      cpuToken: TOKENS.CPU,
      humanToken: TOKENS.HUMAN,
    })

    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
      if (worker) {
        worker.onmessage = null
      }
    }
  }, [turn, isGameOver, difficulty, board, onCpuMove, postMessage, setOnMessage, workerRef])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
    }
  }, [])

  const handleSetDifficulty = useCallback((level) => {
    setDifficulty(level)
  }, [])

  /** Cancel any pending CPU move (call on game reset). */
  const cancelPendingMove = useCallback(() => {
    if (cpuTimeoutRef.current !== null) {
      clearTimeout(cpuTimeoutRef.current)
      cpuTimeoutRef.current = null
    }
  }, [])

  return { difficulty, handleSetDifficulty, cancelPendingMove }
}

export default useCpuPlayer
