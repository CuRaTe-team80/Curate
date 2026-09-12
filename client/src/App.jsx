import './App.css'
import './styles/theme.css'
import './styles/enhance.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Board from './components/Board'
import BoardsList from './pages/BoardsList'
import Dashboard from './pages/Dashboard'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Profile from './pages/Profile'
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
          <Navbar
            currentView={view}
            onNavigate={setView}
            onSelectBoard={handleSelectBoard}
            selectedBoard={selectedBoard}
          />

          {view === 'landing' && (
            <Landing
              onGetStarted={() => setView('boards')}
              onNavigate={setView}
            />
          )}

          {view === 'boards' && (
            <BoardsList onSelectBoard={handleSelectBoard} />
          )}

          {view === 'board' && (
  <Board
    boardId={selectedBoard ? selectedBoard.id : null}
    labels={selectedBoard ? selectedBoard.labels : null}
  />
)}

          {view === 'dashboard' && <Dashboard />}

          {view === 'notifications' && <Notifications />}

          {view === 'login' && (
            <Login onSuccess={() => setView('boards')} />
          )}

          {view === 'register' && (
            <Register onSuccess={() => setView('boards')} />
          )}

          {view === 'profile' && <Profile />}

          <Footer />
          <Toast />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
