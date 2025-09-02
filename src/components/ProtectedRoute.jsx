import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireBusiness = false,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, isBusiness, isAdmin } = useAuth();
  const location = useLocation();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (requireAuth && !isAuthenticated()) {
      toast.error("Please login to access this page");
      setRedirect(<Navigate to="/login" state={{ from: location }} replace />);
    } else if (requireBusiness && !isBusiness()) {
      toast.error("This page is only accessible to business users");
      setRedirect(<Navigate to="/" replace />);
    } else if (requireAdmin && !isAdmin()) {
      toast.error("This page is only accessible to administrators");
      setRedirect(<Navigate to="/" replace />);
    } else {
      setRedirect(null);
    }
  }, [
    requireAuth,
    requireBusiness,
    requireAdmin,
    isAuthenticated,
    isBusiness,
    isAdmin,
    location,
  ]);

  if (redirect) return redirect;
  return children;
};

export default ProtectedRoute;
