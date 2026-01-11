import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Calendar, Users, MessageSquare, Bell, ArrowRight, Clock, MapPin, Sparkles, ChevronRight, PlusCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getGreeting, getTimeEmoji } from "@/lib/greeting";
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
  
  // State
  const [stats, setStats] = useState({ events: 0, clubs: 0, complaints: 0, announcements: 0 });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    // 1. Fetch Counts
    const statsPromise = Promise.all([
      supabase.from('events').select('id', { count: 'exact' }).eq('college_code', profile?.college_code),
      supabase.from('club_members').select('id', { count: 'exact' }).eq('student_id', user!.id),
      supabase.from('complaints').select('id', { count: 'exact' }).eq('student_id', user!.id).neq('status', 'resolved'),
      supabase.from('announcements').select('id', { count: 'exact' }).eq('college_code', profile?.college_code)
    ]);

    // 2. Fetch Actual Content (Limit to 3 items)
    const eventsPromise = supabase
      .from('events')
      .select('*, clubs(name)')
      .eq('college_code', profile?.college_code)
      .gte('date', new Date().toISOString()) // Future events only
      .order('date', { ascending: true })
      .limit(3);

    const announcementsPromise = supabase
      .from('announcements')
      .select('*')
      .eq('college_code', profile?.college_code)
      .order('created_at', { ascending: false })
      .limit(4);

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
    { icon: Calendar, label: "Upcoming Events", value: stats.events, color: "text-blue-600 bg-blue-50 border-blue-100", link: "/dashboard/events" },
    { icon: Users, label: "My Clubs", value: stats.clubs, color: "text-emerald-600 bg-emerald-50 border-emerald-100", link: "/dashboard/clubs" },
    { icon: MessageSquare, label: "Active Issues", value: stats.complaints, color: "text-orange-600 bg-orange-50 border-orange-100", link: "/dashboard/complaints" },
    { icon: Bell, label: "Notices", value: stats.announcements, color: "text-purple-600 bg-purple-50 border-purple-100", link: "/dashboard/announcements" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* 1. HERO GREETING SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 shadow-xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {profile?.full_name?.split(' ')[0]}! {getTimeEmoji()}
              </h1>
              <p className="text-indigo-100 text-lg max-w-xl">
                You have <span className="font-bold text-white">{stats.events} events</span> coming up and <span className="font-bold text-white">{stats.announcements} new notices</span>.
              </p>
            </div>
            <Link to="/dashboard/events">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg">
                Explore Events <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </motion.div>

        {/* 2. STATS ROW */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Link to={stat.link} key={index}>
              <motion.div 
                variants={item}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-2xl border ${stat.color} flex items-center gap-4 transition-all hover:shadow-md cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                  <p className="text-xs font-medium opacity-80">{stat.label}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* --- NEW: FACULTY ANALYTICS SECTION --- */}
        {profile?.role === 'college_admin' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }}
            className="border-b border-border/50 pb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold">Campus Insights</h2>
            </div>
            <AnalyticsView />
          </motion.div>
        )}

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Events Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> What's Happening
              </h2>
              <Link to="/dashboard/events" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                View Calendar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentEvents.length > 0 ? (
              <div className="grid gap-4">
                {recentEvents.map((event) => {
                   const date = new Date(event.date);
                   return (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ y: -2 }}
                      className="group bg-card border border-border/50 rounded-2xl p-4 flex gap-4 items-center hover:border-indigo-500/30 hover:shadow-lg transition-all"
                    >
                      {/* Date Box */}
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex-shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                        <span className="text-xs font-bold uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium truncate">
                            {event.category}
                          </span>
                          <span className="text-xs text-muted-foreground">• {event.clubs?.name}</span>
                        </div>
                        <h3 className="font-bold text-lg truncate group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}</span>
                        </div>
                      </div>

                      <Link to="/dashboard/events">
                        <Button size="sm" variant="ghost" className="hidden sm:flex">Details</Button>
                      </Link>
                    </motion.div>
                   );
                })}
              </div>
            ) : (
              <div className="p-12 border border-dashed rounded-3xl text-center bg-secondary/30 flex flex-col items-center justify-center">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="font-medium">No upcoming events</p>
                <p className="text-sm text-muted-foreground mb-4">Looks like a quiet week on campus.</p>
                {(profile?.role === 'club_admin' || profile?.role === 'college_admin') && (
                   <Link to="/dashboard/events"><Button variant="outline">Create Event</Button></Link>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Widgets */}
          <div className="space-y-8">
            
            {/* Widget 1: Quick Actions */}
            <div className="bg-card border rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Quick Actions
              </h3>
              <div className="grid gap-3">
                {/* NEW: Create Event Shortcut for Club Admins */}
                {profile?.role === 'club_admin' && (
                  <Link to="/dashboard/events">
                    <Button variant="outline" className="w-full justify-start h-12 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 group">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <PlusCircle className="w-4 h-4 text-indigo-600" />
                      </div>
                      Create Event
                    </Button>
                  </Link>
                )}

                <Link to="/dashboard/complaints">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 group">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <PlusCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    Report Issue
                  </Button>
                </Link>
                <Link to="/dashboard/clubs">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 group">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    Join a Club
                  </Button>
                </Link>
                <Link to="/dashboard/settings">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 group">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <QrCode className="w-4 h-4 text-blue-600" />
                    </div>
                    My Tickets
                  </Button>
                </Link>
              </div>
            </div>

            {/* Widget 2: Notice Board */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-600" /> Notice Board
                </h2>
              </div>
              
              <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
                {recentAnnouncements.length > 0 ? (
                  <div className="divide-y divide-border/50">
                    {recentAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm line-clamp-1">{announcement.title}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{announcement.content}</p>
                      </div>
                    ))}
                    <Link to="/dashboard/announcements" className="block p-3 text-center text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
                      View all notices
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">No new notices.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;