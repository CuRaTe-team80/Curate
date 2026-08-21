import './App.css'
import './styles/theme.css'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Board from './components/Board'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/Toast'
import { useState } from 'react'

function App() {
  const [view, setView] = useState('landing')

  return (
    <ToastProvider>
      <div className="app">
        <Navbar currentView={view} onNavigate={setView} />

        {view === 'landing' && (
          <Landing onGetStarted={() => setView('board')} />
        )}

        {view === 'board' && <Board />}

        {view === 'dashboard' && <Dashboard />}

        <Toast />
      </div>
    </ToastProvider>
  )
}

export default App