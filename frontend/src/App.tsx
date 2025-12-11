import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/siswa/DashboardPage'
import Dashboard from './pages/admin/Dashbboard' // Import Dashboard admin
import Materi from './pages/siswa/Materi'
import Quiz from './pages/siswa/Quiz'
import Result from './pages/siswa/Result'
import Login from './pages/Login'
import LoadingScreen from './components/ui/LoadingScreen'
import HealthMatchingGamePage from './pages/siswa/HealthMatchingGamePage'
import GameCrossword from './pages/siswa/GameCrossword'
import MateriHome from './pages/siswa/MateriHome'
import GameHome from './pages/siswa/GameHome'
import ProtectedRoute from './routes/ProtectedRoute'
import ManageMateri from './pages/admin/ManageMateri'
import SubMateri from './pages/admin/SubMateri'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'siswa' | null>(null); // Tambah state untuk role

  useEffect(() => {
    // Check if user is logged in (check localStorage, token, etc.)
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole') as 'admin' | 'siswa' | null; // Ambil role dari localStorage
    
    if (token && isLoggedIn && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogin = (role: 'admin' | 'siswa') => { // Update handleLogin untuk menerima role
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('authToken', 'dummy-token'); // In real app, use actual JWT token
    localStorage.setItem('userRole', role); // Simpan role
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole'); // Hapus role
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
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              {userRole === 'admin' ? 
                <Dashboard onLogout={handleLogout} /> : 
                <DashboardPage onLogout={handleLogout} />
              }
            </ProtectedRoute>
          } 
        />
        
        <Route 
        path="/admin/submateri"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
            {userRole === 'admin' ? <SubMateri /> : <Navigate to="/dashboard" replace />}
          </ProtectedRoute>
        }
        />

        <Route 
          path="/admin/managemateri" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
              {userRole === 'admin' ? <ManageMateri /> : <Navigate to="/dashboard" replace />}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/materi" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Materi />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Quiz />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/result" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Result />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/game/matching" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HealthMatchingGamePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/game/crossword" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GameCrossword />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/materihome" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MateriHome onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/gamehome" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <GameHome onLogout={handleLogout} />
            </ProtectedRoute>
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
