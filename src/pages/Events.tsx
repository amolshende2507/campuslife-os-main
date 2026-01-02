import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase"; // Import Supabase
import { Search, Calendar, Clock, MapPin, Users, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

// Define the shape of our Event data from Supabase
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image_url: string;
  clubs: {
    name: string; // We will fetch the club name via a join
  };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]); // State for real events
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Hardcoded categories for filter buttons
  const categories = ["All", "Tech", "Cultural", "Sports", "Career", "Workshop"];

  // 1. Fetch Events from Supabase
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // The Magic Query: Fetch events AND the related club name
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          clubs ( name )
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching events",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Filter Logic (Client Side for now)
  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper to format date nicely
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
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground">
          Discover and register for exciting campus events 🎉
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedCategory === category ? "hero" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Events Grid */
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => {
              const { month, day, time, fullDate } = formatDate(event.date);
              
              return (
                <motion.div
                  key={event.id}
                  variants={item}
                  layout
                  whileHover={{ y: -8 }}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image_url || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-white text-xs font-medium border border-white/10">
                        {event.category}
                      </span>
                    </div>

                    {/* Date pill */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg overflow-hidden text-center min-w-[50px]">
                        <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">
                          {month}
                        </div>
                        <div className="px-2 py-1">
                          <span className="text-xl font-bold text-foreground">{day}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Organized by <span className="font-medium text-foreground">{event.clubs?.name}</span>
                      </p>
                    </div>

                    <div className="space-y-2 mb-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{time} • {fullDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                       {/* Placeholder for attendees count (Future: Fetch real count) */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>0 registered</span>
                      </div>
                      
                      <Button variant="hero" size="sm" className="shadow-lg shadow-primary/20">
                        Register Now
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
        <EmptyState 
          icon={Calendar}
          title="No events found"
          description="Try adjusting your filters or search terms."
          emoji="🔍"
        />
      )}
    </DashboardLayout>
  );
};

export default Events;