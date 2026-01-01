import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Import Auth
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Events", path: "/dashboard/events" },
  { icon: Users, label: "Clubs", path: "/dashboard/clubs" },
  { icon: MessageSquare, label: "Complaints", path: "/dashboard/complaints" },
  { icon: Bell, label: "Announcements", path: "/dashboard/announcements" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth(); // Get real profile and signOut function
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Helper to get initials (e.g., "Rahul Sharma" -> "RS")
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <>
      {/* Mobile Header (Keep existing code, just showing Sidebar logic mainly) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-lg border-b border-border z-50 flex items-center justify-between px-4">
         {/* ... (Keep Mobile Header code as is) ... */}
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card/95 backdrop-blur-lg border-r border-border z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } hidden lg:flex flex-col`}
      >
        {/* Logo Section (Keep as is) */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {/* ... (Keep Logo code as is) ... */}
        </div>

        {/* Navigation (Keep as is) */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map((item, index) => {
             const isActive = location.pathname === item.path;
             return (
               // ... (Keep existing Nav Item code) ...
               <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                 <Link to={item.path} className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    <item.icon className="w-5 h-5" />
                    <AnimatePresence>
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </AnimatePresence>
                 </Link>
               </motion.div>
             );
          })}
        </nav>

        {/* Bottom Items & Logout */}
        <div className="py-4 px-3 border-t border-border space-y-1">
          {bottomItems.map((item) => (
             // ... (Keep existing Settings link) ...
             <div key={item.path}></div> // Placeholder for brevity
          ))}
          
          {/* Real Logout Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>

        {/* Real User Profile */}
        <div className="p-4 border-t border-border">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold shadow-lg">
              {getInitials(profile?.full_name || "User")}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium text-sm truncate">
                    {profile?.full_name || "Loading..."}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email || "Student"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;