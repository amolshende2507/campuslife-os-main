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
import { Megaphone, Loader2, Paperclip, X } from "lucide-react";

export const CreateAnnouncementModal = ({ onCreated }: { onCreated: () => void }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    file: null as File | null
  });

  if (profile?.role !== 'college_admin') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = null;

      // 1. Upload File (If exists)
      if (formData.file) {
        const fileExt = formData.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('notice-attachments')
          .upload(fileName, formData.file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('notice-attachments')
          .getPublicUrl(fileName);
          
        fileUrl = data.publicUrl;
      }

      // 2. Create Announcement Record
      const { error } = await supabase.from('announcements').insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author_id: user!.id,
        college_code: profile?.college_code,
        attachment_url: fileUrl // Save the PDF link
      });

      if (error) throw error;

      toast({ title: "Announcement Posted! 📢" });
      setOpen(false);
      setFormData({ title: "", content: "", category: "General", file: null });
      onCreated();
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Campus Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. End Semester Exam Schedule" />
          </div>

          <div className="space-y-2">
            <Label>Details (Rich Text)</Label>
            <Textarea 
              required 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              className="h-32"
              placeholder="Type the full message here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["General", "Academic", "Events", "Facility", "Placement", "Exam"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Attachment (PDF/Img)</Label>
              <div className="relative">
                <Input 
                  type="file" 
                  className="pl-8 text-sm file:text-primary file:font-semibold hover:file:bg-primary/10"
                  accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
                  onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})}
                />
                <Paperclip className="w-4 h-4 absolute left-2.5 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Post Announcement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};