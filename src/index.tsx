/*
 * Tic-Tac-Toe Game
 * Copyright © 2026 Scott Reinhart. All Rights Reserved.
 * PROPRIETARY & CONFIDENTIAL
 * Unauthorized reproduction, distribution, or use is strictly prohibited.
 * See LICENSE file for full terms and conditions.
 */

import './styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { SoundProvider } from './app/SoundContext'
import { ThemeProvider } from './app/ThemeContext'
import { ErrorBoundary } from './ui/atoms/ErrorBoundary'
import TicTacToeGame from './ui/organisms/TicTacToeGame.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <ErrorBoundary>
          <TicTacToeGame />
        </ErrorBoundary>
      </SoundProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

/* Register service worker for offline / instant-repeat-visit caching */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
