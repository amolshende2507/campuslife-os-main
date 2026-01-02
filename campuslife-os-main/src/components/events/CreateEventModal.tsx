import { useState, useEffect } from "react";
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

export const CreateEventModal = ({ onEventCreated }: { onEventCreated: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Stores the list of clubs this user manages
  const [myAdminClubs, setMyAdminClubs] = useState<{id: string, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    club_id: "",
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    category: "Tech",
    image_url: ""
  });

  // Check which clubs I am an Admin of
  useEffect(() => {
    const fetchAdminRights = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('club_members')
        .select('club_id, clubs(name)')
        .eq('student_id', user.id)
        .eq('role', 'admin'); // Only fetch clubs where I am admin

      if (data && data.length > 0) {
        // Format data nicely
        const clubs = data.map((item: any) => ({
          id: item.club_id,
          name: item.clubs.name
        }));
        setMyAdminClubs(clubs);
        // Default to first club
        setFormData(prev => ({ ...prev, club_id: clubs[0].id }));
      }
    };
    fetchAdminRights();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine Date and Time into ISO string
      const finalDate = new Date(`${formData.date}T${formData.time}`).toISOString();

      const { error } = await supabase.from('events').insert({
        club_id: formData.club_id,
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        date: finalDate,
        category: formData.category,
        image_url: formData.image_url || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80"
      });

      if (error) throw error;

      toast({ title: "Event Created! 🎉", description: "It is now live on the dashboard." });
      setOpen(false);
      onEventCreated(); // Refresh parent list
      
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // If user is not an admin of ANY club, don't show the button
  if (myAdminClubs.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="gap-2">
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <Label>Organizing Club</Label>
            <Select 
              value={formData.club_id} 
              onValueChange={(val) => setFormData({...formData, club_id: val})}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {myAdminClubs.map(club => (
                  <SelectItem key={club.id} value={club.id}>{club.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Event Title</Label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Venue</Label>
            <Input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
             <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData({...formData, category: val})}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Publish Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};