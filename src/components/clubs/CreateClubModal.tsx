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
import { Plus, Loader2 } from "lucide-react";

export const CreateClubModal = ({ onCreated }: { onCreated: () => void }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    description: "",
    logo_emoji: "🛡️",
    primary_theme_color: "primary"
  });

  // Only College Admin can see this
  if (profile?.role !== 'college_admin') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('clubs').insert({
        name: formData.name,
        full_name: formData.full_name,
        description: formData.description,
        logo_emoji: formData.logo_emoji,
        primary_theme_color: formData.primary_theme_color,
        college_code: profile?.college_code
      });

      if (error) throw error;

      toast({ title: "Club Created! 🎉", description: "Students can now join this club." });
      setOpen(false);
      setFormData({ name: "", full_name: "", description: "", logo_emoji: "🛡️", primary_theme_color: "primary" });
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
        <Button variant="hero" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Add New Club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Club</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label>Acronym / Short Name</Label>
              <Input placeholder="e.g. GDSC" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <Input className="text-center text-2xl" placeholder="🛡️" maxLength={2} value={formData.logo_emoji} onChange={e => setFormData({ ...formData, logo_emoji: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="e.g. Google Developer Student Clubs" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="What is this club about?" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Theme Color</Label>
            <Select value={formData.primary_theme_color} onValueChange={(val) => setFormData({ ...formData, primary_theme_color: val })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Indigo / Purple (Primary)</SelectItem>
                <SelectItem value="accent">Teal / Emerald (Accent)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create Club"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};