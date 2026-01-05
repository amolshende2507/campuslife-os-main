import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getGreeting, getTimeEmoji } from "@/lib/greeting";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

/* -------------------- STATIC DATA (UNCHANGED) -------------------- */

const upcomingEvents = [
  {
    id: 1,
    title: "Tech Hackathon 2024",
    club: "COMPSA",
    date: "Jan 15, 2024",
    time: "9:00 AM",
    venue: "Main Auditorium",
    registered: true,
    isToday: false,
  },
  {
    id: 2,
    title: "Annual Cultural Fest",
    club: "Cultural Committee",
    date: "Jan 20, 2024",
    time: "4:00 PM",
    venue: "Open Air Theatre",
    registered: false,
    isToday: true,
  },
  {
    id: 3,
    title: "Career Workshop",
    club: "Placement Cell",
    date: "Jan 22, 2024",
    time: "2:00 PM",
    venue: "Seminar Hall B",
    registered: true,
    isToday: false,
  },
];

const announcements = [
  { id: 1, title: "Exam Schedule Released", category: "Academic", time: "2 hours ago", isNew: true },
  { id: 2, title: "Library Timings Extended", category: "Facility", time: "5 hours ago", isNew: true },
  { id: 3, title: "Sports Day Registration Open", category: "Events", time: "1 day ago", isNew: false },
];

const todayHighlights = [
  { label: "2 events happening this week", emoji: "🎉" },
  { label: "1 new announcement today", emoji: "📢" },
  { label: "You're all caught up!", emoji: "✨" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* -------------------- DASHBOARD -------------------- */

const Dashboard = () => {
  const { user, profile } = useAuth();

  const [stats, setStats] = useState({
    events: 0,
    clubs: 0,
    complaints: 0,
    announcements: 0,
  });

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    const [events, clubs, complaints, announcements] = await Promise.all([
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

    setStats({
      events: events.count || 0,
      clubs: clubs.count || 0,
      complaints: complaints.count || 0,
      announcements: announcements.count || 0,
    });
  };

  /* 🔥 Dynamic Stat Cards */
  const statCards = [
    {
      icon: Calendar,
      label: "Total Events",
      value: stats.events.toString(),
      color: "primary",
      highlight: "Campus wide",
    },
    {
      icon: Users,
      label: "Clubs Joined",
      value: stats.clubs.toString(),
      color: "accent",
      highlight: "Active memberships",
    },
    {
      icon: MessageSquare,
      label: "Active Complaints",
      value: stats.complaints.toString(),
      color: "primary",
      highlight: "In progress",
    },
    {
      icon: Bell,
      label: "Announcements",
      value: stats.announcements.toString(),
      color: "accent",
      highlight: "Latest updates",
    },
  ];

  const userName = profile?.full_name || "Student";

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {getGreeting()}, {userName}! {getTimeEmoji()}
        </h1>
        <p className="text-muted-foreground">See what's happening on campus today</p>
      </motion.div>

      {/* Highlights */}
      <div className="flex flex-wrap gap-2 mb-6">
        {todayHighlights.map((h, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-sm font-medium border border-primary/10"
          >
            {h.emoji} {h.label}
          </span>
        ))}
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={item} className="bg-card rounded-2xl p-5 border">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                stat.color === "primary"
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/10 text-accent"
              }`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs mt-1 font-medium">{stat.highlight}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* REST OF YOUR UI REMAINS UNCHANGED */}
      {/* Upcoming Events, Announcements & Quick Actions stay exactly as before */}
    </DashboardLayout>
  );
};

export default Dashboard;
