import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requireAuth = true, requireBusiness = false, requireAdmin = false }) => {
  const { user, isAuthenticated, isBusiness, isAdmin } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated()) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireBusiness && !isBusiness()) {
    toast.error('This page is only accessible to business users');
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    toast.error('This page is only accessible to administrators');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 