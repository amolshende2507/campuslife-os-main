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
  Menu,
  X,
  Search,
  BookOpen,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- MENU CONFIG ---------------- */

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Events", path: "/dashboard/events" },
  { icon: Users, label: "Clubs", path: "/dashboard/clubs" },
  { icon: MessageSquare, label: "Complaints", path: "/dashboard/complaints" },
  { icon: Bell, label: "Announcements", path: "/dashboard/announcements" },
  { icon: Search, label: "Lost & Found", path: "/dashboard/lost-found" },
  { icon: BookOpen, label: "Resources", path: "/dashboard/resources" },
];

const bottomItems = [
  { icon: Settings, label: "My Profile", path: "/dashboard/settings" },
];

/* ---------------- COMPONENT ---------------- */

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  /* ---------------- SIDEBAR CONTENT ---------------- */

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* ---------- LOGO ---------- */}
      <div className="h-20 flex items-center px-6 border-b border-border/50">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg leading-none">
              Campus<span className="text-primary">Life</span>
            </span>
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
              OS
            </span>
          </div>
        </Link>
      </div>

      {/* ---------- NAVIGATION ---------- */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {(profile?.role === "club_admin" ||
          profile?.role === "college_admin") && (
          <Link
            to="/dashboard/scan"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <QrCode className="w-5 h-5 shrink-0" />
            <span className="font-medium">Scan Tickets</span>
          </Link>
        )}
      </nav>

      {/* ---------- BOTTOM ACTIONS ---------- */}
      <div className="p-3 border-t border-border/50 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* ---------- USER PROFILE ---------- */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm border border-accent/20 overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(profile?.full_name || "User")
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {profile?.full_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize truncate">
              {profile?.role?.replace("_", " ") || "Student"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------- RENDER ---------------- */

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          Campus<span className="text-primary">Life</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border/50 z-30 hidden lg:block">
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-card z-50 shadow-2xl lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
