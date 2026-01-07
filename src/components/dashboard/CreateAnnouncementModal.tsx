import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Loader2 } from "lucide-react";

export const CreateAnnouncementModal = ({ onCreated }: { onCreated: () => void }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General"
  });

  // Only show button if user is College Admin
  if (profile?.role !== 'college_admin') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('announcements').insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author_id: user!.id,
        college_code: profile?.college_code
      });

      if (error) throw error;

      toast({ title: "Announcement Posted! 📢" });
      setOpen(false);
      setFormData({ title: "", content: "", category: "General" });
      onCreated(); // Refresh list
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="gap-2">
          <Megaphone className="w-4 h-4" /> Post Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Post Campus Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["General", "Academic", "Events", "Facility", "Placement"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Post Now"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};