import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Calendar, Clock, MapPin, Users, Loader2, Check, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

import { CreateEventModal } from "@/components/events/CreateEventModal";
import { TicketModal } from "@/components/events/TicketModal";

/* =======================
   Types
======================= */
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image_url: string;
  status?: string;
  clubs: {
    name: string;
  };
}

/* =======================
   Animations
======================= */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<Event | null>(null);

  const categories = ["All", "Tech", "Cultural", "Sports", "Career", "Workshop"];

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchMyRegistrations();
    }
  }, [user]);

  /* =======================
     Data Fetching
  ======================= */
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`*, clubs ( name )`)
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("event_id")
        .eq("student_id", user!.id);

      if (error) throw error;

      setRegisteredEventIds(data.map((row) => row.event_id));
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  /* =======================
     Register Handler
  ======================= */
  const handleRegister = async (eventId: string, eventTitle: string) => {
    if (registeredEventIds.includes(eventId)) return;

    setRegisteringId(eventId);

    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        student_id: user!.id,
        status: "registered",
      });

      if (error) throw error;

      setRegisteredEventIds((prev) => [...prev, eventId]);

      toast({
        title: "Registered Successfully! 🎟️",
        description: `You are going to ${eventTitle}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setRegisteringId(null);
    }
  };

  /* =======================
     Helpers
  ======================= */
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString("default", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fullDate: date.toLocaleDateString("default", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  };

  /* =======================
     Render
  ======================= */
  return (
    <DashboardLayout>
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
          <CreateEventModal onEventCreated={fetchEvents} />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "hero" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
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
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredEvents.map((event) => {
              const { time, fullDate } = formatDate(event.date);
              const isRegistered = registeredEventIds.includes(event.id);
              const isRegistering = registeringId === event.id;

              return (
                <motion.div
                  key={event.id}
                  variants={item}
                  layout
                  className={`bg-card rounded-2xl border overflow-hidden ${
                    isRegistered
                      ? "border-accent/50"
                      : "border-border/50 hover:shadow-xl"
                  }`}
                >
                  <div className="relative h-48">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />

                    {isRegistered && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" /> Registered
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Organized by{" "}
                      <span className="font-medium text-foreground">
                        {event.clubs?.name}
                      </span>
                    </p>

                    <div className="space-y-2 mb-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {time} • {fullDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" /> Open to all
                      </div>

                      {/* ✅ UPDATED BUTTON LOGIC */}
                      <div className="flex gap-2">
                        {isRegistered ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            onClick={() => setSelectedTicketEvent(event)}
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            View Ticket
                          </Button>
                        ) : (
                          <Button
                            variant="hero"
                            size="sm"
                            disabled={
                              isRegistering || event.status === "closed"
                            }
                            onClick={() =>
                              handleRegister(event.id, event.title)
                            }
                            className="min-w-[100px]"
                          >
                            {isRegistering ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Register Now"
                            )}
                          </Button>
                        )}
                      </div>
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
          description="Try adjusting your filters or check back later."
          emoji="📅"
        />
      )}

      {/* Ticket Modal */}
      <TicketModal
        event={selectedTicketEvent}
        onClose={() => setSelectedTicketEvent(null)}
      />
    </DashboardLayout>
  );
};

export default Events;
