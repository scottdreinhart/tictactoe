/**
 * App Adapters barrel export.
 * Re-exports all concrete adapter implementations of domain ports.
 *
 * Usage: import { LocalStorageAdapter, WebAudioSoundAdapter } from '@/app/adapters'
 */

export { BrowserHapticsAdapter } from './BrowserHapticsAdapter.ts'
export { BrowserRandomSource } from './BrowserRandomSource.ts'
export { BrowserTimerAdapter } from './BrowserTimerAdapter.ts'
export { createInMemoryStorageAdapter } from './InMemoryStorageAdapter.ts'
export { LocalStorageAdapter } from './LocalStorageAdapter.ts'
export { NullHapticsAdapter } from './NullHapticsAdapter.ts'
export { NullSoundAdapter } from './NullSoundAdapter.ts'
export { WebAudioSoundAdapter } from './WebAudioSoundAdapter.ts'
export { createWebWorkerAiAdapter } from './WebWorkerAiAdapter.ts'
