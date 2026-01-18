import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Complaints from "./pages/Complaints";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TicketScanner from "./pages/Scanner";
import LostFound from "./pages/LostFound";
import Resources from "./pages/Resources";
import StaticPage from "./pages/StaticPage";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES (No Sidebar, has Top Navbar) */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/p/:type" element={<StaticPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* PROTECTED ROUTES (Has Sidebar via DashboardLayout inside the pages) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/dashboard/events" element={<Events />} />
              <Route path="/dashboard/clubs" element={<Clubs />} />
              <Route path="/dashboard/complaints" element={<Complaints />} />
              <Route path="/dashboard/announcements" element={<Announcements />} />
              <Route path="/dashboard/lost-found" element={<LostFound />} />
              <Route path="/dashboard/scan" element={<TicketScanner />} />
              <Route path="/dashboard/resources" element={<Resources />} />

              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


//basic mvp