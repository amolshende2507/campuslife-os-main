import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Events", path: "/dashboard/events" },
  { icon: Users, label: "Clubs", path: "/dashboard/clubs" },
  { icon: MessageSquare, label: "Complaints", path: "/dashboard/complaints" },
  { icon: Bell, label: "Announcements", path: "/dashboard/announcements" },
];

const bottomItems = [
  { icon: Settings, label: "My Profile", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  
  // State for Desktop Collapse and Mobile Menu
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* --- LOGO SECTION --- */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-border/50`}>
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Campus<span className="text-primary">Life</span></span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">OS</span>
            </div>
          )}
        </Link>
        
        {/* Desktop Collapse Button */}
        {!isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        )}
      </div>

      {/* --- NAVIGATION --- */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${!isActive && "group-hover:text-primary transition-colors"}`} />
              
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="p-3 border-t border-border/50 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              isCollapsed ? 'justify-center' : ''
            } ${location.pathname === item.path ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* --- USER PROFILE (Mini) --- */}
      <div className={`p-4 border-t border-border/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm shrink-0 border border-accent/20">
            {getInitials(profile?.full_name || "User")}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{profile?.role?.replace('_', ' ') || "Student"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. MOBILE TOP BAR (Visible only on small screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Campus<span className="text-primary">Life</span></span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* 2. DESKTOP SIDEBAR (Visible only on large screens) */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r border-border/50 z-30 transition-all duration-300 hidden lg:block ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* 3. MOBILE DRAWER (Slide-in) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-card z-50 lg:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Force expand state for mobile view */}
              <div className="h-full pt-2">
                 {/* Hack: Pass isCollapsed=false logic by rendering content directly */}
                 <SidebarContent /> 
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;