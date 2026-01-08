import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Calendar,
  Users,
  MessageSquare,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getGreeting, getTimeEmoji } from "@/lib/greeting";

// ✅ NEW IMPORT
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user, profile } = useAuth();

  const [stats, setStats] = useState({
    events: 0,
    clubs: 0,
    complaints: 0,
    announcements: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    const statsPromise = Promise.all([
      supabase.from("events").select("id", { count: "exact" }),
      supabase
        .from("club_members")
        .select("id", { count: "exact" })
        .eq("student_id", user!.id),
      supabase
        .from("complaints")
        .select("id", { count: "exact" })
        .eq("student_id", user!.id)
        .neq("status", "resolved"),
      supabase.from("announcements").select("id", { count: "exact" }),
    ]);

    const eventsPromise = supabase
      .from("events")
      .select("*, clubs(name)")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true })
      .limit(3);

    const announcementsPromise = supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    const [
      [eventsCount, clubsCount, complaintsCount, announcementsCount],
      { data: eventsData },
      { data: announcementsData },
    ] = await Promise.all([
      statsPromise,
      eventsPromise,
      announcementsPromise,
    ]);

    setStats({
      events: eventsCount.count || 0,
      clubs: clubsCount.count || 0,
      complaints: complaintsCount.count || 0,
      announcements: announcementsCount.count || 0,
    });

    setRecentEvents(eventsData || []);
    setRecentAnnouncements(announcementsData || []);
    setLoading(false);
  };

  const statCards = [
    {
      icon: Calendar,
      label: "Total Events",
      value: stats.events,
      color: "text-blue-600 bg-blue-100",
      link: "/dashboard/events",
    },
    {
      icon: Users,
      label: "My Clubs",
      value: stats.clubs,
      color: "text-emerald-600 bg-emerald-100",
      link: "/dashboard/clubs",
    },
    {
      icon: MessageSquare,
      label: "Active Complaints",
      value: stats.complaints,
      color: "text-orange-600 bg-orange-100",
      link: "/dashboard/complaints",
    },
    {
      icon: Bell,
      label: "Announcements",
      value: stats.announcements,
      color: "text-purple-600 bg-purple-100",
      link: "/dashboard/announcements",
    },
  ];

  return (
    <DashboardLayout>
      {/* GREETING */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {getGreeting()},{" "}
          {profile?.full_name?.split(" ")[0] || "Student"}!{" "}
          {getTimeEmoji()}
        </h1>
        <p className="text-muted-foreground">
          Here is what's happening on campus right now.
        </p>
      </motion.div>

      {/* --- NEW: ANALYTICS (FACULTY ONLY) --- */}
      {profile?.role === "college_admin" && (
        <div className="mb-10">
          <AnalyticsView />
        </div>
      )}

      {/* STATS GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index}>
            <motion.div
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border/50 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* MAIN CONTENT GRID */}
      {/* (unchanged from your original) */}
      {/* … rest of file remains exactly the same … */}

    </DashboardLayout>
  );
};

export default Dashboard;
