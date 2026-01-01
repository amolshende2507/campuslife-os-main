import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Users, MessageSquare, Bell, ArrowRight, Clock, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getGreeting, getTimeEmoji } from "@/lib/greeting";

const stats = [
  { icon: Calendar, label: "Upcoming Events", value: "8", color: "primary", highlight: "2 this week" },
  { icon: Users, label: "Clubs Joined", value: "4", color: "accent", highlight: null },
  { icon: MessageSquare, label: "Active Complaints", value: "1", color: "primary", highlight: "In review" },
  { icon: Bell, label: "Unread Announcements", value: "3", color: "accent", highlight: "1 new today" },
];

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
  {
    id: 1,
    title: "Exam Schedule Released",
    category: "Academic",
    time: "2 hours ago",
    isNew: true,
  },
  {
    id: 2,
    title: "Library Timings Extended",
    category: "Facility",
    time: "5 hours ago",
    isNew: true,
  },
  {
    id: 3,
    title: "Sports Day Registration Open",
    category: "Events",
    time: "1 day ago",
    isNew: false,
  },
];

const todayHighlights = [
  { label: "2 events happening this week", emoji: "🎉" },
  { label: "1 new announcement today", emoji: "📢" },
  { label: "You're all caught up!", emoji: "✨" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const userName = "Rahul";

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {getGreeting()}, {userName}! {getTimeEmoji()}
        </h1>
        <p className="text-muted-foreground">
          See what's happening on campus today
        </p>
      </motion.div>

      {/* Quick Highlights */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {todayHighlights.map((highlight, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-sm font-medium border border-primary/10"
          >
            <span>{highlight.emoji}</span>
            <span>{highlight.label}</span>
          </motion.span>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-2xl p-5 border border-border/50 card-interactive group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                stat.color === "primary"
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/10 text-accent"
              }`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            {stat.highlight && (
              <p className={`text-xs font-medium mt-1 ${
                stat.color === "primary" ? "text-primary" : "text-accent"
              }`}>
                {stat.highlight}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Hot
              </span>
            </div>
            <Link to="/dashboard/events">
              <Button variant="ghost" size="sm" className="group btn-press">
                View All
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                  event.isToday 
                    ? "bg-gradient-to-r from-accent/10 to-primary/5 border border-accent/20" 
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex flex-col items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 shadow-lg">
                  <span className="text-lg leading-none">{event.date.split(" ")[1].replace(",", "")}</span>
                  <span className="text-[10px] font-normal opacity-80">
                    {event.date.split(" ")[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{event.title}</h3>
                    {event.isToday && (
                      <span className="status-badge status-today">Today</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    by {event.club}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.venue}
                    </span>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={event.registered ? "secondary" : "hero"}
                    size="sm"
                    className="flex-shrink-0 btn-press"
                  >
                    {event.registered ? "Registered ✓" : "Register"}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Announcements</h2>
            <Link to="/dashboard/announcements">
              <Button variant="ghost" size="sm" className="group btn-press">
                View All
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: -2 }}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {announcement.isNew && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2 animate-pulse" 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 truncate">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {announcement.category}
                      </span>
                      <span>{announcement.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Link to="/dashboard/complaints" className="block">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all h-full"
          >
            <MessageSquare className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Submit a Complaint</h3>
            <p className="text-sm text-muted-foreground">
              100% anonymous & safe
            </p>
          </motion.div>
        </Link>
        <Link to="/dashboard/clubs" className="block">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 hover:border-accent/40 transition-all h-full"
          >
            <Users className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-1">Explore Clubs</h3>
            <p className="text-sm text-muted-foreground">
              Find your community 🎯
            </p>
          </motion.div>
        </Link>
        <Link to="/dashboard/events" className="block">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all h-full"
          >
            <Calendar className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Browse Events</h3>
            <p className="text-sm text-muted-foreground">
              Don't miss out! 🔥
            </p>
          </motion.div>
        </Link>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
