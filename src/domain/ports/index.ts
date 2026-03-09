/**
 * Domain Ports barrel export.
 * Re-exports all port interfaces (abstractions for external dependencies).
 *
 * Usage: import { StoragePort, SoundPort } from '@/domain/ports'
 */

export type { AiMoveRequest, AiMoveResponse, AiWorkerPort } from './AiWorkerPort.ts'
export type { HapticsPort } from './HapticsPort.ts'
export type { RandomSource } from './RandomSource.ts'
export type { SoundPort } from './SoundPort.ts'
export type { StoragePort } from './StoragePort.ts'
export type { TimerPort } from './TimerPort.ts'
