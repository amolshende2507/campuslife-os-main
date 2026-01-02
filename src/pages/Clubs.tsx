import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Users, Calendar, ExternalLink, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

// Interface matches our Supabase Table + Counts
interface Club {
  id: string;
  name: string;
  full_name: string;
  description: string;
  logo_emoji: string;
  primary_theme_color: string;
  // Supabase count queries return an array like [{ count: 12 }]
  club_members: { count: number }[]; 
  events: { count: number }[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Clubs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClubIds, setMyClubIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "joined">("all");

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Clubs with Counts (Members & Events)
      // Note: We use select with count modifier
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select(`
          *,
          club_members(count),
          events(count)
        `);

      if (clubsError) throw clubsError;
      setClubs(clubsData || []);

      // 2. Fetch My Memberships
      const { data: myData, error: myError } = await supabase
        .from('club_members')
        .select('club_id')
        .eq('student_id', user!.id);

      if (myError) throw myError;
      setMyClubIds(myData.map(row => row.club_id));

    } catch (error: any) {
      console.error("Error loading clubs:", error);
      toast({ variant: "destructive", title: "Failed to load clubs", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Join / Leave
  const handleToggleMembership = async (clubId: string, clubName: string) => {
    setActionLoadingId(clubId);
    const isJoined = myClubIds.includes(clubId);

    try {
      if (isJoined) {
        // LEAVE CLUB
        const { error } = await supabase
          .from('club_members')
          .delete()
          .eq('club_id', clubId)
          .eq('student_id', user!.id);
        
        if (error) throw error;
        
        setMyClubIds(prev => prev.filter(id => id !== clubId));
        toast({ title: `Left ${clubName}`, description: "You will no longer receive updates." });
      } else {
        // JOIN CLUB
        const { error } = await supabase
          .from('club_members')
          .insert({ club_id: clubId, student_id: user!.id });
        
        if (error) throw error;

        setMyClubIds(prev => [...prev, clubId]);
        toast({ title: `Joined ${clubName}! 🚀`, description: "Welcome to the community." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Action Failed", description: error.message });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter Logic
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.full_name && club.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const isJoined = myClubIds.includes(club.id);
    const matchesFilter = filter === "all" || (filter === "joined" && isJoined);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Clubs & Committees</h1>
        <p className="text-muted-foreground">Find your tribe and join the communities you love 🎯</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search clubs..." className="pl-10 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={filter === "all" ? "hero" : "secondary"} size="sm" onClick={() => setFilter("all")}>All Clubs</Button>
          <Button variant={filter === "joined" ? "hero" : "secondary"} size="sm" onClick={() => setFilter("joined")}>My Clubs</Button>
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredClubs.map((club) => {
              const isJoined = myClubIds.includes(club.id);
              const isLoadingAction = actionLoadingId === club.id;
              
              // Extract counts safely
              const memberCount = club.club_members?.[0]?.count || 0;
              const eventCount = club.events?.[0]?.count || 0;

              // Dynamic Gradient based on theme preference
              const gradient = club.primary_theme_color === 'accent' 
                ? "from-emerald-500 to-teal-600" 
                : "from-indigo-500 to-purple-600";

              return (
                <motion.div key={club.id} variants={item} layout className="bg-card rounded-2xl border border-border/50 overflow-hidden group hover:shadow-lg transition-all">
                  {/* Header */}
                  <div className={`h-20 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                  </div>

                  <div className="p-6 -mt-8 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-card shadow-lg flex items-center justify-center text-3xl border border-border/50">
                        {club.logo_emoji || "🛡️"}
                      </div>
                      {isJoined && (
                        <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Joined
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{club.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 h-8 line-clamp-2">{club.full_name || club.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><Users className="w-4 h-4" /> <span>{memberCount + (isJoined ? 1 : 0)}</span></div>
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> <span>{eventCount} events</span></div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={isJoined ? "secondary" : "hero"}
                        size="sm"
                        className="w-full"
                        disabled={isLoadingAction}
                        onClick={() => handleToggleMembership(club.id, club.name)}
                      >
                        {isLoadingAction ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isJoined ? (
                          "Leave"
                        ) : (
                          "Join Club"
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredClubs.length === 0 && (
        <EmptyState icon={Users} title="No clubs found" description="Try changing your search filters." emoji="🤔" />
      )}
    </DashboardLayout>
  );
};

export default Clubs;