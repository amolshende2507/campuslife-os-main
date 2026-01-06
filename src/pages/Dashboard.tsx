import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Users, MessageSquare, Bell, ArrowRight, Clock, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getGreeting, getTimeEmoji } from "@/lib/greeting";

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
  
  // State for data
  const [stats, setStats] = useState({ events: 0, clubs: 0, complaints: 0, announcements: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    // 1. Fetch Counts (Keep existing logic)
    const statsPromise = Promise.all([
      supabase.from('events').select('id', { count: 'exact' }),
      supabase.from('club_members').select('id', { count: 'exact' }).eq('student_id', user!.id),
      supabase.from('complaints').select('id', { count: 'exact' }).eq('student_id', user!.id).neq('status', 'resolved'),
      supabase.from('announcements').select('id', { count: 'exact' })
    ]);

    // 2. Fetch Actual Content (New!)
    // Get next 3 upcoming events
    const eventsPromise = supabase
      .from('events')
      .select('*, clubs(name)')
      .gte('date', new Date().toISOString()) // Only future events
      .order('date', { ascending: true })
      .limit(3);

    // Get last 3 announcements
    const announcementsPromise = supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    const [
      [eventsCount, clubsCount, complaintsCount, announcementsCount],
      { data: eventsData },
      { data: announcementsData }
    ] = await Promise.all([statsPromise, eventsPromise, announcementsPromise]);

    setStats({
      events: eventsCount.count || 0,
      clubs: clubsCount.count || 0,
      complaints: complaintsCount.count || 0,
      announcements: announcementsCount.count || 0
    });

    setRecentEvents(eventsData || []);
    setRecentAnnouncements(announcementsData || []);
    setLoading(false);
  };

  const statCards = [
    { icon: Calendar, label: "Total Events", value: stats.events, color: "text-blue-600 bg-blue-100", link: "/dashboard/events" },
    { icon: Users, label: "My Clubs", value: stats.clubs, color: "text-emerald-600 bg-emerald-100", link: "/dashboard/clubs" },
    { icon: MessageSquare, label: "Active Complaints", value: stats.complaints, color: "text-orange-600 bg-orange-100", link: "/dashboard/complaints" },
    { icon: Bell, label: "Announcements", value: stats.announcements, color: "text-purple-600 bg-purple-100", link: "/dashboard/announcements" },
  ];

  return (
    <DashboardLayout>
      {/* 1. Greeting Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {getGreeting()}, {profile?.full_name?.split(' ')[0] || "Student"}! {getTimeEmoji()}
        </h1>
        <p className="text-muted-foreground">
          Here is what's happening on campus right now.
        </p>
      </motion.div>

      {/* 2. Stats Grid (Compact) */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Link to={stat.link} key={index}>
            <motion.div 
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="bg-card border border-border/50 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upcoming Events (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Upcoming Events
            </h2>
            <Link to="/dashboard/events">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event) => {
                 const date = new Date(event.date);
                 return (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="group bg-card border border-border/50 rounded-2xl p-4 flex gap-4 items-center hover:border-primary/50 transition-all"
                  >
                    {/* Date Box */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-xl flex-shrink-0">
                      <span className="text-xs font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">by {event.clubs?.name}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}</span>
                      </div>
                    </div>

                    <Link to="/dashboard/events">
                      <Button size="sm" variant="secondary">Details</Button>
                    </Link>
                  </motion.div>
                 );
              })}
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded-2xl text-center bg-secondary/20">
              <p className="text-muted-foreground">No upcoming events scheduled.</p>
            </div>
          )}
        </div>

        {/* Right Column: Notice Board & Actions (Span 1) */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/complaints">
                <Button variant="outline" className="w-full bg-white/50 h-auto py-3 flex flex-col gap-1 hover:bg-white hover:text-primary border-primary/20">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Complaint</span>
                </Button>
              </Link>
              <Link to="/dashboard/clubs">
                <Button variant="outline" className="w-full bg-white/50 h-auto py-3 flex flex-col gap-1 hover:bg-white hover:text-accent border-accent/20">
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Join Club</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Announcements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" /> Notice Board
              </h2>
            </div>
            
            <div className="space-y-3">
              {recentAnnouncements.length > 0 ? (
                recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-card p-4 rounded-xl border border-border/50 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold line-clamp-1">{announcement.title}</span>
                      <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2">{announcement.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No new notices.</p>
              )}
              <Link to="/dashboard/announcements">
                <Button variant="link" size="sm" className="w-full text-muted-foreground">View All Notices</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;