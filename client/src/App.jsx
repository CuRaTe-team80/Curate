import './App.css'
import './styles/theme.css'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Board from './components/Board'
import { useState } from 'react'

function App() {
  const [view, setView] = useState('landing')
  return (
    <div className="app">
      <Navbar />
      {view === 'landing' ? <Landing onGetStarted={() => setView('board')} /> : <Board />}
    </div>
  )
}

export default App