import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import Materi from './pages/Materi'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Login from './pages/Login'
import LoadingScreen from './components/ui/LoadingScreen'
import HealthMatchingGamePage from './pages/HealthMatchingGamePage'
import GameCrossword from './pages/GameCrossword'
import MateriHome from './pages/MateriHome'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (check localStorage, token, etc.)
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (token && isLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authToken', 'dummy-token'); // In real app, use actual JWT token
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.clear(); // Clear all stored data
    sessionStorage.clear();
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLogin={handleLogin} /> : 
            <Navigate to="/dashboard" replace />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <DashboardPage onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/materi" 
          element={
            isAuthenticated ? 
            <Materi /> :
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/quiz" 
          element={
            isAuthenticated ? <Quiz /> :
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/result" 
          element={
            isAuthenticated ? <Result /> :
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/game/matching" 
          element={
            isAuthenticated ? 
            <HealthMatchingGamePage /> :
            <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/game/crossword" 
          element={
            isAuthenticated ? 
            <GameCrossword /> :
            <Navigate to="/login" replace />
          } 
        />

        <Route 
          path="/materihome" 
          element={
            isAuthenticated ? 
            <MateriHome onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App
