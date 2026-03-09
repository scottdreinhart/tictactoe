/**
 * Adapter: WebWorkerAiAdapter
 *
 * Production implementation of AiWorkerPort using a Web Worker.
 * Wraps the existing ai.worker.ts behind the port contract.
 */
import type { AiMoveRequest, AiMoveResponse, AiWorkerPort } from '@/domain/ports'

export const createWebWorkerAiAdapter = (): AiWorkerPort => {
  const worker = new Worker(new URL('../../workers/ai.worker.ts', import.meta.url), {
    type: 'module',
  })

  let resultHandler: ((response: AiMoveResponse) => void) | null = null

  worker.onmessage = (event: MessageEvent<AiMoveResponse>) => {
    resultHandler?.(event.data)
  }

  return {
    requestMove(request: AiMoveRequest): void {
      worker.postMessage(request)
    },

    onResult(handler: (response: AiMoveResponse) => void): void {
      resultHandler = handler
    },

    dispose(): void {
      resultHandler = null
      worker.terminate()
    },
  }
}
