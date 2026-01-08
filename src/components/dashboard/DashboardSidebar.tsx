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
  X,
  QrCode,
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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* LOGO */}
      <div
        className={`h-20 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between px-6"
        } border-b border-border/50`}
      >
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg">CampusLife</span>
          )}
        </Link>

        {!isMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* SCAN TICKETS (ADMINS) */}
        {(profile?.role === "club_admin" ||
          profile?.role === "college_admin") && (
          <Link
            to="/dashboard/scan"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <QrCode className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Scan Tickets</span>}
          </Link>
        )}
      </div>

      {/* BOTTOM LINKS */}
      <div className="p-3 border-t border-border/50 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl ${
              isCollapsed ? "justify-center" : ""
            } ${
              location.pathname === item.path
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* USER PROFILE (UPDATED) */}
      <div
        className={`p-4 border-t border-border/50 ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm shrink-0 border border-accent/20 overflow-hidden">
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

          {!isCollapsed && (
            <div>
              <p className="text-sm font-semibold truncate">
                {profile?.full_name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role?.replace("_", " ") || "Student"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="font-bold">
          CampusLife
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full bg-card border-r z-30 hidden lg:block transition-all ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 h-full w-72 bg-card z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
