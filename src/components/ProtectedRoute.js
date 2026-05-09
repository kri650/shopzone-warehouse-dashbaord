import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles.length && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
