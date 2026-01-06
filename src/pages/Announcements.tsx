import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, BookOpen, Building, Calendar, Users, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { supabase } from "@/lib/supabase";
import { CreateAnnouncementModal } from "@/components/dashboard/CreateAnnouncementModal";
import { useAuth } from "@/contexts/AuthContext";

const categories = ["All", "Academic", "Events", "Placement", "Facility", "General"];

// Icons map
const getIcon = (cat: string) => {
  switch (cat) {
    case "Academic": return BookOpen;
    case "Events": return Calendar;
    case "Facility": return Building;
    case "Placement": return Users;
    default: return Bell;
  }
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useAuth(); // ✅ Auth profile

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      setAnnouncements(data || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = announcements.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ✅ DELETE HANDLER
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchAnnouncements();
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-muted-foreground">
            Latest updates from the campus admin.
          </p>
        </motion.div>

        <CreateAnnouncementModal onCreated={fetchAnnouncements} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "hero" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-secondary/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((item) => {
              const Icon = getIcon(item.category);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border/50 p-6 flex gap-4 relative group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {item.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* ✅ DELETE BUTTON */}
                  {profile?.role === "college_admin" && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <EmptyState
              icon={Bell}
              title="No announcements"
              description="Check back later."
              emoji="📭"
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Announcements;
