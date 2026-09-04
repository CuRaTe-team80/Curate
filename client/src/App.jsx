import './App.css'
import './styles/theme.css'
import './styles/enhance.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Board from './components/Board'
import Dashboard from './pages/Dashboard'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'
import { useState } from 'react'

function App() {
  const [view, setView] = useState('landing')

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="app">
          <Navbar currentView={view} onNavigate={setView} />

          {view === 'landing' && (
            <Landing
              onGetStarted={() => setView('board')}
              onNavigate={setView}
            />
          )}

          {view === 'board' && <Board />}

          {view === 'dashboard' && <Dashboard />}

          {view === 'notifications' && <Notifications />}

          {view === 'login' && (
            <Login onSuccess={() => setView('board')} />
          )}

          {view === 'register' && (
            <Register onSuccess={() => setView('board')} />
          )}

          <Footer />
          <Toast />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App