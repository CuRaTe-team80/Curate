import './App.css'
import './styles/theme.css'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Board from './components/Board'
import Dashboard from './pages/Dashboard'
import { useState } from 'react'

function App() {
  const [view, setView] = useState('landing')

  return (
    <div className="app">
      <Navbar currentView={view} onNavigate={setView} />
      {view === 'landing' && <Landing onGetStarted={() => setView('board')} />}
      {view === 'board' && <Board />}
      {view === 'dashboard' && <Dashboard />}
    </div>
  )
}

export default App