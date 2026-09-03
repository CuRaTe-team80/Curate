$content = @"
import './App.css'
import './styles/theme.css'
import './styles/enhance.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Board from './components/Board'
import BoardsList from './pages/BoardsList'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'
import { useState } from 'react'

function App() {
  const [view, setView] = useState('landing')
  const [selectedBoard, setSelectedBoard] = useState(null)

  function handleSelectBoard(board) {
    setSelectedBoard(board)
    setView('board')
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="app">
          <Navbar currentView={view} onNavigate={setView} />
          {view === 'landing' && (
            <Landing onGetStarted={() => setView('boards')} onNavigate={setView} />
          )}
          {view === 'boards' && <BoardsList onSelectBoard={handleSelectBoard} />}
          {view === 'board' && <Board boardId={selectedBoard ? selectedBoard.id : null} />}
          {view === 'dashboard' && <Dashboard />}
          {view === 'login' && <Login onSuccess={() => setView('board')} />}
          {view === 'register' && <Register onSuccess={() => setView('board')} />}
          <Footer />
          <Toast />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
"@
Set-Content -Path App.jsx -Value $content -Encoding utf8