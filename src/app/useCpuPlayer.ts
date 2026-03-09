import { useCallback, useEffect, useRef, useState } from 'react'

import { CPU_DELAY_MS, TOKENS } from '../domain/constants.ts'
import type { Board, Difficulty, WorkerResponse } from '../domain/types.ts'
import useWebWorker from './useWebWorker.ts'

interface UseCpuPlayerConfig {
  turn: string
  board: Board
  isGameOver: boolean
  onCpuMove: (index: number) => void
}

interface UseCpuPlayerReturn {
  difficulty: Difficulty
  handleSetDifficulty: (level: Difficulty) => void
  cancelPendingMove: () => void
}

const useCpuPlayer = ({
  turn,
  board,
  isGameOver,
  onCpuMove,
}: UseCpuPlayerConfig): UseCpuPlayerReturn => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const cpuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const createWorker = useCallback(
    () =>
      new Worker(new URL('../workers/ai.worker.ts', import.meta.url), {
        type: 'module',
      }),
    [],
  )
  const { postMessage, setOnMessage, workerRef } = useWebWorker(createWorker)

  useEffect(() => {
    if (turn !== TOKENS.CPU) return
    if (isGameOver) return

    const worker = workerRef.current

    setOnMessage((event: MessageEvent<WorkerResponse>) => {
      const { index, error } = event.data
      if (error) {
        console.error('AI Worker error:', error)
        return
      }
      if (index === undefined || index === null) return

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

  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current !== null) {
        clearTimeout(cpuTimeoutRef.current)
        cpuTimeoutRef.current = null
      }
    }
  }, [])

  const handleSetDifficulty = useCallback((level: Difficulty) => {
    setDifficulty(level)
  }, [])

  const cancelPendingMove = useCallback(() => {
    if (cpuTimeoutRef.current !== null) {
      clearTimeout(cpuTimeoutRef.current)
      cpuTimeoutRef.current = null
    }
  }, [])

  return { difficulty, handleSetDifficulty, cancelPendingMove }
}

export default useCpuPlayer
