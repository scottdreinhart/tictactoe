import React from 'react'
import ReactDOM from 'react-dom/client'
import TicTacToeGame from './ui/organisms/TicTacToeGame.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TicTacToeGame />
  </React.StrictMode>
)

/* Register service worker for offline / instant-repeat-visit caching */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
