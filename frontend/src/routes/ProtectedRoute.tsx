import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole?: 'admin' | 'siswa' | null;
  requiredRole?: 'admin' | 'siswa';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  userRole,
  requiredRole
}) => {
  // Jika tidak authenticated, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada requiredRole dan userRole tidak match, redirect ke dashboard
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika semua ok, render children
  return <>{children}</>;
};

export default ProtectedRoute;