import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext"; // We need the user!
import { Search, Calendar, Clock, MapPin, Users, Sparkles, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

// Data Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image_url: string;
  clubs: {
    name: string;
  };
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Events = () => {
  const { user } = useAuth(); // Get current logged in user
  const { toast } = useToast();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null); // For button loading state

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = ["All", "Tech", "Cultural", "Sports", "Career", "Workshop"];

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchMyRegistrations();
    }
  }, [user]);

  // 1. Fetch All Events
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`*, clubs ( name )`)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch User's Existing Registrations
  const fetchMyRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('student_id', user!.id);

      if (error) throw error;
      
      // Store just the IDs in a simple array
      const ids = data.map(row => row.event_id);
      setRegisteredEventIds(ids);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  // 3. Handle Registration Click
  const handleRegister = async (eventId: string, eventTitle: string) => {
    if (registeredEventIds.includes(eventId)) return; // Already registered

    setRegisteringId(eventId); // Show loading spinner on button

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          student_id: user!.id,
          status: 'registered'
        });

      if (error) throw error;

      // Success! Update local state immediately
      setRegisteredEventIds(prev => [...prev, eventId]);
      
      toast({
        title: "Registered Successfully! 🎟️",
        description: `You are going to ${eventTitle}.`,
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message
      });
    } finally {
      setRegisteringId(null);
    }
  };

  // Filter Logic
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      time: date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground">Discover and register for exciting campus events 🎉</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-10 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "hero" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => {
              const { month, day, time, fullDate } = formatDate(event.date);
              const isRegistered = registeredEventIds.includes(event.id);
              const isRegistering = registeringId === event.id;

              return (
                <motion.div
                  key={event.id}
                  variants={item}
                  layout
                  className={`bg-card rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isRegistered ? "border-accent/50 shadow-lg shadow-accent/5" : "border-border/50 hover:shadow-xl"
                  }`}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-white text-xs font-medium border border-white/10">{event.category}</span>
                    </div>
                    {isRegistered && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Check className="w-3 h-3" /> Registered
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">Organized by <span className="font-medium text-foreground">{event.clubs?.name}</span></p>
                    </div>

                    <div className="space-y-2 mb-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> <span>{time} • {fullDate}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> <span>{event.venue}</span></div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" /> <span>Open to all</span>
                      </div>
                      
                      <Button 
                        variant={isRegistered ? "secondary" : "hero"} 
                        size="sm" 
                        disabled={isRegistered || isRegistering}
                        onClick={() => handleRegister(event.id, event.title)}
                        className="min-w-[100px]"
                      >
                        {isRegistering ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isRegistered ? (
                          "Going ✓"
                        ) : (
                          "Register Now"
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

      {!loading && filteredEvents.length === 0 && (
        <EmptyState icon={Calendar} title="No events found" description="Try adjusting your filters or check back later." emoji="📅" />
      )}
    </DashboardLayout>
  );
};

export default Events;