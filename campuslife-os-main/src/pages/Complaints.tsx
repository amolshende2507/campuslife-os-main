import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Lock,
  PartyPopper,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";

// Database Shape
interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'submitted' | 'in_review' | 'resolved' | 'closed';
  is_anonymous: boolean;
  submitted_at: string;
  resolved_at: string | null;
}

const categories = [
  "Infrastructure", "Academics", "Hostel", "Canteen", "Library", "Transport", "Faculty", "Other"
];

const Complaints = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    isAnonymous: true // Default to safe
  });

  useEffect(() => {
    if (user) fetchMyComplaints();
  }, [user]);

  // 1. Fetch My Complaints
  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('student_id', user!.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.title || !formData.description) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all details." });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('complaints').insert({
        student_id: user!.id,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        is_anonymous: formData.isAnonymous,
        status: 'submitted'
      });

      if (error) throw error;

      // Success UI
      setShowForm(false);
      setShowSuccess(true);
      setFormData({ category: "", title: "", description: "", isAnonymous: true }); // Reset
      fetchMyComplaints(); // Refresh list

      setTimeout(() => setShowSuccess(false), 5000); // Hide success confetti after 5s

    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "in_review": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "closed": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default: return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "resolved": return "✓ Resolved";
      case "in_review": return "In Review";
      case "closed": return "Closed";
      default: return "Submitted";
    }
  };

  return (
    <DashboardLayout>
      {/* Success Confetti Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 right-4 z-50 bg-emerald-600 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Complaint Submitted!</p>
              <p className="text-sm opacity-90">Your identity is protected 🔒</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Anonymous Complaints</h1>
        <p className="text-muted-foreground">Report issues safely. We've got your back.</p>
      </motion.div>

      {/* Privacy Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 mb-8 border border-primary/20 relative overflow-hidden">
        <div className="flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">100% Anonymous & Secure</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you select "Anonymous", your name is hidden from the committee members viewing the complaint. Only the unique Complaint ID is visible.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border/50 p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Submit a Complaint</h2>
            {!showForm && (
              <Button variant="hero" size="sm" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-1" /> New Complaint
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="E.g., Water cooler broken" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the issue in detail..." rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input type="checkbox" id="anon" checked={formData.isAnonymous} onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})} className="w-4 h-4 rounded border-primary text-primary focus:ring-primary" />
                  <Label htmlFor="anon" className="cursor-pointer flex items-center gap-1">
                     Keep me Anonymous <Lock className="w-3 h-3 text-muted-foreground" />
                  </Label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Report"}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <div className="text-center py-10 bg-secondary/20 rounded-xl border border-dashed border-border">
                <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Click 'New Complaint' to start</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* History Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border/50 p-6 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">My History</h2>
            <Button variant="ghost" size="icon" onClick={fetchMyComplaints}><RefreshCw className="w-4 h-4" /></Button>
          </div>

          {loading ? (
             <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-24 bg-secondary/50 rounded-xl animate-pulse" />)}
             </div>
          ) : complaints.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {complaints.map((complaint) => (
                <motion.div key={complaint.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-medium mb-1">{complaint.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-full bg-background border">{complaint.category}</span>
                        <span>• {new Date(complaint.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {getStatusLabel(complaint.status)}
                    </span>
                  </div>
                  
                  {/* Timeline Visual (Simplified) */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                     <div className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="w-3 h-3" /> Submitted
                     </div>
                     <div className="w-8 h-[1px] bg-border" />
                     <div className={`flex items-center gap-1 ${complaint.status !== 'submitted' ? 'text-primary' : 'opacity-50'}`}>
                        <Clock className="w-3 h-3" /> In Review
                     </div>
                     <div className="w-8 h-[1px] bg-border" />
                     <div className={`flex items-center gap-1 ${complaint.status === 'resolved' ? 'text-emerald-600' : 'opacity-50'}`}>
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState icon={AlertCircle} title="No history" description="You haven't submitted any complaints yet." emoji="✨" />
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Complaints;