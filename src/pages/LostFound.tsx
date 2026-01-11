import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Search, MapPin, Phone, MessageCircle, Plus, Trash2, ImageOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface LostItem {
  id: string;
  title: string;
  description: string;
  location: string;
  contact_info: string;
  image_url: string | null;
  type: 'lost' | 'found';
  user_id: string;
  created_at: string;
}

export default function LostFound() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  
  const [items, setItems] = useState<LostItem[]>([]);
  const [filter, setFilter] = useState<'lost' | 'found'>('lost');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState({
    title: "", description: "", location: "", contact_info: "", image_url: ""
  });

  useEffect(() => {
    if (profile) fetchItems();
  }, [profile, filter]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lost_items')
      .select('*')
      .eq('college_code', profile?.college_code)
      .eq('type', filter)
      .order('created_at', { ascending: false });
    
    setItems((data as LostItem[]) || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!newItem.title || !newItem.contact_info) {
      toast({ variant: "destructive", title: "Missing Info", description: "Title and Contact info are required." });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('lost_items').insert({
      ...newItem,
      type: filter,
      user_id: user!.id,
      college_code: profile?.college_code
    });

    setSubmitting(false);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Posted Successfully", description: "Your item is now visible." });
      setIsDialogOpen(false);
      setNewItem({ title: "", description: "", location: "", contact_info: "", image_url: "" }); // Reset
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Found it? Delete this post?")) return;

    const { error } = await supabase.from('lost_items').delete().eq('id', id);
    if (!error) {
      toast({ title: "Post Removed" });
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleContact = (contact: string) => {
    // Basic check: if it looks like a phone number, try WhatsApp
    const isPhone = /^[0-9+\s-]{10,}$/.test(contact);
    
    if (isPhone) {
      // Strip spaces/dashes for URL
      const cleanNumber = contact.replace(/[\s-]/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    } else {
      // Just copy to clipboard
      navigator.clipboard.writeText(contact);
      toast({ title: "Copied to Clipboard", description: contact });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {filter === 'lost' ? '🕵️ Lost Items' : '🎁 Found Items'}
          </h1>
          <p className="text-muted-foreground">
            {filter === 'lost' ? "Help peers find their belongings." : "Did you find something? Post it here."}
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Toggle Switch */}
          <div className="bg-secondary p-1 rounded-xl flex flex-1 md:flex-none">
            <button 
              onClick={() => setFilter('lost')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'lost' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Lost
            </button>
            <button 
              onClick={() => setFilter('found')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'found' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Found
            </button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" /> Post Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post {filter === 'lost' ? 'Lost' : 'Found'} Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Input placeholder="What is it? (e.g. Blue Water Bottle)" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Input placeholder="Location (e.g. Library 2nd Floor)" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Input placeholder="Contact (Phone / Instagram ID)" value={newItem.contact_info} onChange={e => setNewItem({...newItem, contact_info: e.target.value})} />
                  <p className="text-[10px] text-muted-foreground">Phone numbers will open in WhatsApp automatically.</p>
                </div>
                <div className="space-y-2">
                  <Textarea placeholder="Description (Optional)" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Upload Photo</span>
                  <ImageUpload folder="lost-found" onUpload={(url) => setNewItem({...newItem, image_url: url})} />
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-secondary/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const isOwner = user?.id === item.user_id;
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id} 
                  className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Image Section */}
                  <div className="h-48 bg-secondary/30 relative overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary/50">
                        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">No image provided</span>
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${item.type === 'lost' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                      {item.type}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3" /> 
                      <span className="truncate">{item.location || "Unknown Location"}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{item.description}</p>
                    )}

                    <div className="pt-4 border-t flex justify-between items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      
                      {isOwner ? (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                          onClick={() => handleContact(item.contact_info)}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" /> Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-3xl bg-secondary/10">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm text-2xl">
            {filter === 'lost' ? '🙌' : '🔍'}
          </div>
          <h3 className="text-lg font-semibold">No {filter} items</h3>
          <p className="text-muted-foreground text-sm max-w-xs text-center mt-1">
            {filter === 'lost' ? "Good news! No one has lost anything recently." : "No found items reported yet."}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}