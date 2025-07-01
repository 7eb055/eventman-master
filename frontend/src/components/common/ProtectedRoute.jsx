import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getToken, getCurrentUser } from '../../services/auth';

/**
 * ProtectedRoute component for role-based access control.
 * @param {ReactNode} children - The component to render if access is allowed.
 * @param {Array<string>} roles - Allowed roles for this route.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  // Always check localStorage for token and user
  const token = getToken();
  const currentUser = getCurrentUser();

  if (loading) return null; // or a loading spinner
  if (!token || !currentUser) return <Navigate to="/sign-in" replace />;
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
