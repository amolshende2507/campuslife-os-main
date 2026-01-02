import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, BookOpen, Building, Calendar, Users, PartyPopper } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";

const announcements = [
  {
    id: 1,
    title: "End Semester Examination Schedule Released",
    content: "The examination schedule for the Winter 2024 semester has been released. All students are requested to check the exam portal for their individual timetables. Contact the examination cell for any discrepancies.",
    category: "Academic",
    author: "Examination Cell",
    date: "2 hours ago",
    isNew: true,
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Library Timings Extended During Exams",
    content: "The central library will remain open from 7 AM to 12 AM during the examination period (Jan 15 - Feb 10). Night reading room facilities are available for hostel students.",
    category: "Facility",
    author: "Library Committee",
    date: "5 hours ago",
    isNew: true,
    icon: Building,
  },
  {
    id: 3,
    title: "Annual Sports Day Registration Open",
    content: "Registration for Annual Sports Day 2024 is now open. Interested students can register through the sports portal. Last date for registration is January 25, 2024.",
    category: "Events",
    author: "Sports Committee",
    date: "1 day ago",
    isNew: true,
    icon: Calendar,
  },
  {
    id: 4,
    title: "Placement Drive: TCS & Infosys",
    content: "TCS and Infosys will be visiting our campus on February 5-6, 2024. Eligible students from CSE, IT, and ECE branches can apply through the placement portal by January 28.",
    category: "Placement",
    author: "Training & Placement Cell",
    date: "2 days ago",
    isNew: false,
    icon: Users,
  },
  {
    id: 5,
    title: "Fee Payment Deadline Extended",
    content: "The deadline for semester fee payment has been extended to January 31, 2024. Students who have not paid their fees are requested to do so at the earliest to avoid late fees.",
    category: "Administrative",
    author: "Accounts Department",
    date: "3 days ago",
    isNew: false,
    icon: Building,
  },
  {
    id: 6,
    title: "Tech Hackathon Winners Announced",
    content: "Congratulations to Team Binary Wizards for winning the 24-hour hackathon! Special mentions to Team CodeCrafters and Team DevStorm for their innovative solutions.",
    category: "Events",
    author: "COMPSA",
    date: "4 days ago",
    isNew: false,
    icon: Calendar,
  },
];

const categories = ["All", "Academic", "Events", "Placement", "Facility", "Administrative"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Announcements = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [readAnnouncements, setReadAnnouncements] = useState<number[]>([]);

  const handleRead = (id: number) => {
    if (!readAnnouncements.includes(id)) {
      setReadAnnouncements(prev => [...prev, id]);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesCategory =
      selectedCategory === "All" || announcement.category === selectedCategory;
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Academic":
        return "bg-primary/10 text-primary border-primary/20";
      case "Events":
        return "bg-accent/10 text-accent border-accent/20";
      case "Placement":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Facility":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Administrative":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const newCount = filteredAnnouncements.filter(a => a.isNew && !readAnnouncements.includes(a.id)).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Announcements</h1>
          {newCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold"
            >
              {newCount} new
            </motion.span>
          )}
        </div>
        <p className="text-muted-foreground">
          {newCount > 0 
            ? `You have ${newCount} unread announcement${newCount > 1 ? 's' : ''} 📬`
            : "You're all caught up! 🎉"}
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
            placeholder="Search announcements..."
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
                className="flex-shrink-0 btn-press"
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Announcements List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredAnnouncements.map((announcement) => {
            const isUnread = announcement.isNew && !readAnnouncements.includes(announcement.id);
            
            return (
              <motion.div
                key={announcement.id}
                variants={item}
                layout
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => handleRead(announcement.id)}
                className={`bg-card rounded-2xl border p-6 cursor-pointer transition-all ${
                  isUnread 
                    ? "border-primary/30 shadow-md" 
                    : "border-border/50 hover:border-border"
                }`}
                style={{
                  boxShadow: isUnread ? "0 0 20px -8px hsl(var(--primary) / 0.2)" : undefined
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${getCategoryColor(
                      announcement.category
                    )}`}
                  >
                    <announcement.icon className="w-5 h-5" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isUnread && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2.5 h-2.5 rounded-full bg-primary" 
                          />
                        )}
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 border ${getCategoryColor(
                          announcement.category
                        )}`}
                      >
                        {announcement.category}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {announcement.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredAnnouncements.length === 0 && (
        <EmptyState 
          icon={Bell}
          title="Nothing new here… yet 👀"
          description="Check back later for important updates and news from campus."
          emoji="📭"
        />
      )}
    </DashboardLayout>
  );
};

export default Announcements;
