import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingState } from "./LoadingState";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState showSpinner message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect to login page with return url
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // In a real app, you might check for admin role here
  // if (!user.isAdmin) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
}
