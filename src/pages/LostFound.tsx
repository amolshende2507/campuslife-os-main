import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Search, MapPin, Phone, Tag, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function LostFound() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<'lost' | 'found'>('lost');
  const [open, setOpen] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState({
    title: "", description: "", location: "", contact_info: "", image_url: "", type: "lost"
  });

  useEffect(() => {
    fetchItems();
  }, [filter]); // Re-fetch when tab changes

  const fetchItems = async () => {
    const { data } = await supabase
      .from('lost_items')
      .select('*')
      .eq('college_code', profile?.college_code)
      .eq('type', filter)
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    setItems(data || []);
  };

  const handleSubmit = async () => {
    await supabase.from('lost_items').insert({
      ...newItem,
      type: filter, // Insert based on current tab
      user_id: profile!.id,
      college_code: profile?.college_code
    });
    setOpen(false);
    fetchItems();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lost & Found</h1>
          <p className="text-muted-foreground">Don't spam WhatsApp. Post it here.</p>
        </div>
        
        {/* Toggle & Add Button */}
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-xl">
          <Button 
            variant={filter === 'lost' ? 'default' : 'ghost'} 
            onClick={() => setFilter('lost')}
            className="rounded-lg"
          >
            Lost Items
          </Button>
          <Button 
            variant={filter === 'found' ? 'default' : 'ghost'} 
            onClick={() => setFilter('found')}
            className="rounded-lg"
          >
            Found Items
          </Button>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="w-4 h-4 mr-2" /> Post Item</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-bold mb-4">Post {filter === 'lost' ? 'Lost' : 'Found'} Item</h2>
            <div className="space-y-3">
              <Input placeholder="What is it? (e.g. Blue Bottle)" onChange={e => setNewItem({...newItem, title: e.target.value})} />
              <Input placeholder="Where? (e.g. Library 2nd Floor)" onChange={e => setNewItem({...newItem, location: e.target.value})} />
              <Input placeholder="Contact (Phone/Instagram)" onChange={e => setNewItem({...newItem, contact_info: e.target.value})} />
              <ImageUpload folder="lost-found" onUpload={(url) => setNewItem({...newItem, image_url: url})} />
              <Button onClick={handleSubmit} className="w-full">Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="h-48 bg-secondary/30 relative">
              {item.image_url ? (
                <img src={item.image_url} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold uppercase ${item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {item.type}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" /> {item.location}
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                <Button size="sm" variant="outline" onClick={() => alert(`Contact: ${item.contact_info}`)}>
                  <Phone className="w-3 h-3 mr-2" /> Contact
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}