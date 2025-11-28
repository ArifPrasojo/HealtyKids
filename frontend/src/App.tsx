import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import Materi from './pages/Materi'
import Quiz from './pages/Quiz'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/quiz" element={<Quiz />} />
        {/* Tambahkan route lain sesuai kebutuhan */}
      </Routes>
    </Router>
  )
}

export default App
