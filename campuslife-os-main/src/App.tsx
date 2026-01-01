import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Complaints from "./pages/Complaints";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
// Import the ProtectedRoute component (we will create this next)
import { ProtectedRoute } from "./components/common/ProtectedRoute";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap BrowserRouter with AuthProvider */}
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes: Only accessible if authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/events" element={<Events />} />
              <Route path="/dashboard/clubs" element={<Clubs />} />
              <Route path="/dashboard/complaints" element={<Complaints />} />
              <Route path="/dashboard/announcements" element={<Announcements />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
