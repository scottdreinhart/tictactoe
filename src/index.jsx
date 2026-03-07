import React from 'react'
import ReactDOM from 'react-dom/client'
import TicTacToeGame from './ui/organisms/TicTacToeGame.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TicTacToeGame />
  </React.StrictMode>
)
