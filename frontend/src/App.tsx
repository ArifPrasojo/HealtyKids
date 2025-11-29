import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import Materi from './pages/Materi'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import LoadingScreen from './components/ui/LoadingScreen'
import HealthMatchingGamePage from './pages/HealthMatchingGamePage'
import GameCrossword from './pages/GameCrossword'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/game/matching" element={<HealthMatchingGamePage />} />
        <Route path="/game/crossword" element={<GameCrossword />} />
        {/* Tambahkan route lain sesuai kebutuhan */}
      </Routes>
    </Router>
  )
}

export default App
