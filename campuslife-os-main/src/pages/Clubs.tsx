import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";

const clubs = [
  {
    id: 1,
    name: "COMPSA",
    fullName: "Computer Science Students Association",
    description: "The tech hub of our college. We organize hackathons, coding competitions, and tech talks.",
    members: 234,
    events: 12,
    logo: "🖥️",
    color: "primary",
    isJoined: true,
    isActiveThisWeek: true,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: 2,
    name: "Cultural Committee",
    fullName: "Cultural Activities Committee",
    description: "Bringing art, music, and dance to campus life. Join us for unforgettable performances.",
    members: 189,
    events: 8,
    logo: "🎭",
    color: "accent",
    isJoined: true,
    isActiveThisWeek: true,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    name: "Photography Club",
    fullName: "Lens & Light Photography Club",
    description: "Capture moments, tell stories. From photo walks to professional workshops.",
    members: 98,
    events: 6,
    logo: "📸",
    color: "primary",
    isJoined: false,
    isActiveThisWeek: false,
    gradient: "from-orange-500 to-pink-600",
  },
  {
    id: 4,
    name: "Debate Society",
    fullName: "Parliamentary Debate Society",
    description: "Voice your opinions, sharpen your arguments. Represent the college in national debates.",
    members: 67,
    events: 5,
    logo: "🎤",
    color: "accent",
    isJoined: false,
    isActiveThisWeek: false,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: 5,
    name: "Sports Committee",
    fullName: "College Sports Committee",
    description: "From cricket to athletics, we manage all inter-college sports events and teams.",
    members: 156,
    events: 15,
    logo: "⚽",
    color: "primary",
    isJoined: true,
    isActiveThisWeek: true,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: 6,
    name: "Entrepreneurship Cell",
    fullName: "E-Cell",
    description: "Building the next generation of entrepreneurs. Pitch competitions, mentorship & more.",
    members: 112,
    events: 7,
    logo: "🚀",
    color: "accent",
    isJoined: false,
    isActiveThisWeek: true,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: 7,
    name: "Robotics Club",
    fullName: "Robotics & Automation Club",
    description: "Build, program, compete. From line followers to humanoid robots.",
    members: 78,
    events: 4,
    logo: "🤖",
    color: "primary",
    isJoined: true,
    isActiveThisWeek: false,
    gradient: "from-slate-500 to-zinc-600",
  },
  {
    id: 8,
    name: "Literary Society",
    fullName: "Creative Writing & Literary Society",
    description: "Poetry, prose, and everything in between. Annual magazine and open mics.",
    members: 54,
    events: 3,
    logo: "📚",
    color: "accent",
    isJoined: false,
    isActiveThisWeek: false,
    gradient: "from-amber-500 to-orange-600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const Clubs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "joined">("all");
  const [joinedClubs, setJoinedClubs] = useState<number[]>(
    clubs.filter(c => c.isJoined).map(c => c.id)
  );

  const handleJoin = (clubId: number) => {
    setJoinedClubs(prev =>
      prev.includes(clubId)
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    );
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const isJoined = joinedClubs.includes(club.id);
    const matchesFilter = filter === "all" || (filter === "joined" && isJoined);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Clubs & Committees</h1>
        <p className="text-muted-foreground">
          Find your tribe and join the communities you love 🎯
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
            placeholder="Search clubs..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === "all" ? "hero" : "secondary"}
              size="sm"
              onClick={() => setFilter("all")}
              className="btn-press"
            >
              All Clubs
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === "joined" ? "hero" : "secondary"}
              size="sm"
              onClick={() => setFilter("joined")}
              className="btn-press"
            >
              My Clubs
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Clubs Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredClubs.map((club) => {
            const isJoined = joinedClubs.includes(club.id);
            
            return (
              <motion.div
                key={club.id}
                variants={item}
                layout
                whileHover={{ y: -8 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden group"
              >
                {/* Gradient Header */}
                <div className={`h-20 bg-gradient-to-br ${club.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
                  
                  {club.isActiveThisWeek && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Active this week
                      </span>
                    </motion.div>
                  )}
                </div>

                <div className="p-6 -mt-8 relative">
                  {/* Logo & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl bg-card shadow-lg flex items-center justify-center text-2xl border border-border/50"
                    >
                      {club.logo}
                    </motion.div>
                    {isJoined && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Joined
                      </motion.span>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{club.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{club.fullName}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {club.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{club.members}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{club.events} events</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={isJoined ? "secondary" : "hero"}
                        size="sm"
                        className="w-full btn-press"
                        onClick={() => handleJoin(club.id)}
                      >
                        {isJoined ? "View Club" : "Join Club"}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredClubs.length === 0 && (
        <EmptyState 
          icon={Users}
          title="You haven't joined any clubs… yet 😉"
          description="Explore the clubs above and find your community!"
          emoji="🎪"
        />
      )}
    </DashboardLayout>
  );
};

export default Clubs;
