import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Shield,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Lock,
  PartyPopper,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";

const categories = [
  "Infrastructure",
  "Academics",
  "Hostel",
  "Canteen",
  "Library",
  "Transport",
  "Faculty",
  "Other",
];

const myComplaints = [
  {
    id: "CMP-2024-001",
    title: "Water dispenser not working in Block B",
    category: "Infrastructure",
    status: "resolved",
    date: "Jan 10, 2024",
    timeline: [
      { status: "Submitted", date: "Jan 10, 2024", done: true },
      { status: "In Review", date: "Jan 11, 2024", done: true },
      { status: "Resolved", date: "Jan 13, 2024", done: true },
    ],
  },
  {
    id: "CMP-2024-002",
    title: "Wifi connectivity issues in library",
    category: "Infrastructure",
    status: "in_review",
    date: "Jan 14, 2024",
    timeline: [
      { status: "Submitted", date: "Jan 14, 2024", done: true },
      { status: "In Review", date: "Jan 15, 2024", done: true },
      { status: "Resolved", date: "", done: false },
    ],
  },
];

const Complaints = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-accent/10 text-accent border border-accent/20";
      case "in_review":
        return "bg-primary/10 text-primary border border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "resolved":
        return "✓ Resolved";
      case "in_review":
        return "In Review";
      default:
        return "Submitted";
    }
  };

  return (
    <DashboardLayout>
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-accent text-accent-foreground rounded-2xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Complaint Submitted!</p>
              <p className="text-sm opacity-90">Your identity is safely protected 🔒</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Anonymous Complaints</h1>
        <p className="text-muted-foreground">
          Report issues safely. Your identity is always protected 🔒
        </p>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 mb-8 border border-primary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="flex items-start gap-4 relative">
          <motion.div 
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            <Shield className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">100% Anonymous & Confidential</h3>
              <Lock className="w-4 h-4 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your identity will <span className="font-semibold text-foreground">never</span> be shared with anyone. 
              All complaints are end-to-end encrypted and handled with complete confidentiality. 
              Track your complaint using the unique ID provided.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit Complaint */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Submit a Complaint</h2>
            {!showForm && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => setShowForm(true)}
                  className="btn-press"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Complaint
                </Button>
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the issue. Be specific about location, time, and impact."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attach Image (Optional)</Label>
                  <motion.div 
                    whileHover={{ scale: 1.01, borderColor: "hsl(var(--primary) / 0.5)" }}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </motion.div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 btn-press"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" variant="hero" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Submit Anonymously
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="font-medium mb-2">No complaint in progress</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button above to submit a new complaint
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* My Complaints */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <h2 className="text-lg font-semibold mb-6">My Complaints</h2>

          {myComplaints.length > 0 ? (
            <div className="space-y-4">
              {myComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-medium mb-1">{complaint.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-full bg-muted">
                          {complaint.category}
                        </span>
                        <span className="font-mono">{complaint.id}</span>
                      </div>
                    </div>
                    <motion.span
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {getStatusLabel(complaint.status)}
                    </motion.span>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 mt-4">
                    {complaint.timeline.map((step, i) => (
                      <div key={i} className="flex items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            step.done
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.done ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </motion.div>
                        {i < complaint.timeline.length - 1 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            className={`w-8 h-0.5 origin-left ${
                              step.done ? "bg-accent" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Submitted</span>
                    <span>In Review</span>
                    <span>Resolved</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={AlertCircle}
              title="No complaints submitted"
              description="That's a good sign! 😊 If you ever need to report an issue, we've got you covered."
              emoji="✨"
            />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Complaints;
