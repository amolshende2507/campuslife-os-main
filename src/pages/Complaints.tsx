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
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminComplaintView } from "@/components/dashboard/AdminComplaintView";
import { ImageUpload } from "@/components/ui/image-upload";

// Database Shape
interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "submitted" | "in_review" | "resolved" | "closed";
  is_anonymous: boolean;
  submitted_at: string;
  resolved_at: string | null;
  image_url?: string | null;
}

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

const Complaints = () => {
  const { user, profile } = useAuth();
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
    image_url: "",
    isAnonymous: true,
  });

  useEffect(() => {
    if (user) fetchMyComplaints();
  }, [user]);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("student_id", user!.id)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.description) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all details.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("complaints").insert({
        student_id: user!.id,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || null,
        is_anonymous: formData.isAnonymous,
        status: "submitted",
      });

      if (error) throw error;

      setShowForm(false);
      setShowSuccess(true);
      setFormData({
        category: "",
        title: "",
        description: "",
        image_url: "",
        isAnonymous: true,
      });

      fetchMyComplaints();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "in_review":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "closed":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "resolved":
        return "✓ Resolved";
      case "in_review":
        return "In Review";
      case "closed":
        return "Closed";
      default:
        return "Submitted";
    }
  };

  if (profile?.role === "college_admin") {
    return (
      <DashboardLayout>
        <AdminComplaintView />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM */}
        <div className="bg-card rounded-2xl border p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-lg font-semibold">Submit a Complaint</h2>
            {!showForm && (
              <Button variant="hero" size="sm" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-1" /> New Complaint
              </Button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <Label>Upload Proof (Optional)</Label>
                <ImageUpload
                  folder="complaints"
                  onUpload={(url) =>
                    setFormData((prev) => ({ ...prev, image_url: url }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAnonymous: e.target.checked,
                    })
                  }
                />
                <Label className="flex items-center gap-1">
                  Keep me Anonymous <Lock className="w-3 h-3" />
                </Label>
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Report"
                )}
              </Button>
            </form>
          )}
        </div>

        {/* HISTORY */}
        <div className="bg-card rounded-2xl border p-6">
          <h2 className="text-lg font-semibold mb-4">My History</h2>

          {loading ? (
            <p>Loading...</p>
          ) : complaints.length ? (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-secondary/30 border"
                >
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {c.description}
                  </p>
                  {c.image_url && (
                    <img
                      src={c.image_url}
                      alt="proof"
                      className="mt-3 rounded-lg max-h-40"
                    />
                  )}
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full border ${getStatusColor(
                      c.status
                    )}`}
                  >
                    {getStatusLabel(c.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={AlertCircle}
              title="No complaints"
              description="You haven't submitted any complaints yet."
              emoji="✨"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Complaints;
