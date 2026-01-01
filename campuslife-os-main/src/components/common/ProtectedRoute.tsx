// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react"; // Import a loading spinner

// A simple loading spinner component
const FullPageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext

  if (loading) {
    return <FullPageSpinner />; // Show a spinner while checking auth status
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child routes (e.g., Dashboard, Events)
  return <Outlet />;
};