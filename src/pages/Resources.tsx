import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, UploadCloud, Search, BookOpen, Loader2, Trash2, FileCheck, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Resources() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filters
  const [filterBranch, setFilterBranch] = useState("CSE");
  const [filterYear, setFilterYear] = useState("FY");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Form
  const [formData, setFormData] = useState({
    title: "", subject: "", type: "notes", file: null as File | null
  });

  // Check if user has Admin rights
  const isAdmin = profile?.role === 'college_admin' || profile?.role === 'club_admin';

  useEffect(() => {
    if(profile) fetchResources();
  }, [filterBranch, filterYear, profile]);

  const fetchResources = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('resources')
      .select('*, profiles(full_name)')
      .eq('college_code', profile?.college_code)
      .eq('branch', filterBranch)
      .eq('year', filterYear)
      .order('created_at', { ascending: false });
    
    setResources(data || []);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!formData.file || !formData.title || !formData.subject) {
      toast({ variant: "destructive", title: "Missing fields" });
      return;
    }

    setUploading(true);
    try {
      // 1. Upload File to Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('academic-files')
        .upload(fileName, formData.file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage.from('academic-files').getPublicUrl(fileName);

      // 3. Insert into Database
      const { error: dbError } = await supabase.from('resources').insert({
        title: formData.title,
        subject: formData.subject,
        branch: filterBranch,
        year: filterYear,
        type: formData.type,
        file_url: urlData.publicUrl,
        uploader_id: user!.id, // Important for "My Delete" check
        college_code: profile?.college_code
      });

      if (dbError) throw dbError;

      toast({ title: "Uploaded Successfully! 📚" });
      setIsDialogOpen(false);
      setFormData({ title: "", subject: "", type: "notes", file: null }); // Reset
      fetchResources();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!window.confirm("Delete this resource? This cannot be undone.")) return;

    // Optimistic UI Update (Remove immediately)
    setResources(prev => prev.filter(r => r.id !== id));

    try {
      // 1. Delete DB Row
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;

      // 2. (Optional) Delete from Storage to save space
      // We extract the filename from the URL
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('academic-files').remove([fileName]);
      }

      toast({ title: "Resource Deleted" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: "You might not have permission." });
      fetchResources(); // Revert UI if failed
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredList = resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Icon Helper
  const getIcon = (type: string) => {
    switch(type) {
      case 'pyq': return { icon: FileCheck, color: 'text-orange-600 bg-orange-100' };
      case 'assignment': return { icon: FileType, color: 'text-purple-600 bg-purple-100' };
      default: return { icon: FileText, color: 'text-blue-600 bg-blue-100' };
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" /> Academic Vault
          </h1>
          <p className="text-muted-foreground">Share notes, PYQs, and assignments.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2 shadow-lg shadow-primary/20">
              <UploadCloud className="w-4 h-4" /> Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Material</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Input placeholder="Title (e.g. Unit 3 Notes)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <Input placeholder="Subject (e.g. Data Structures)" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              
              <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="notes">Lecture Notes</SelectItem>
                  <SelectItem value="pyq">PYQ / Question Paper</SelectItem>
                  <SelectItem value="assignment">Assignment Solution</SelectItem>
                </SelectContent>
              </Select>

              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                <input type="file" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" accept=".pdf,.doc,.docx,.ppt" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} />
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Uploading to: <span className="font-bold text-primary">{filterBranch} - {filterYear}</span>
              </div>

              <Button onClick={handleUpload} className="w-full" disabled={uploading}>
                {uploading ? <Loader2 className="animate-spin" /> : "Upload PDF"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTERS */}
      <div className="bg-card border p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-4 shadow-sm">
        <Select value={filterBranch} onValueChange={setFilterBranch}>
          <SelectTrigger className="w-[180px] bg-background"><SelectValue placeholder="Branch" /></SelectTrigger>
          <SelectContent>
            {['CSE', 'ECE', 'MECH', 'CIVIL', 'AI/DS'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterYear} onValueChange={setFilterYear}>
          <SelectTrigger className="w-[180px] bg-background"><SelectValue placeholder="Year" /></SelectTrigger>
          <SelectContent>
            {['FY', 'SY', 'TY', 'Final'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by title..." className="pl-9 bg-background" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-secondary/50 rounded-xl animate-pulse" />)}</div>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredList.map((res) => {
              const { icon: Icon, color } = getIcon(res.type);
              // Logic: Show Delete if (Admin) OR (I uploaded it)
              const canDelete = isAdmin || res.uploader_id === user?.id;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={res.id} 
                  className="bg-card border p-4 rounded-2xl flex items-center justify-between group hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate pr-4">{res.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-secondary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{res.subject}</span>
                        <span className="truncate">by {res.profiles?.full_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => handleDownload(res.file_url)} title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    {/* DELETE BUTTON */}
                    {canDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(res.id, res.file_url)}
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 text-3xl shadow-sm">📂</div>
          <p className="font-medium">No resources found.</p>
          <p className="text-sm opacity-70">Be the hero who uploads the first note for {filterBranch} {filterYear}!</p>
        </div>
      )}
    </DashboardLayout>
  );
}