import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Settings, UserCog, UserMinus, Shield, ShieldAlert, Loader2 } from "lucide-react";

interface Member {
  id: string; // This is the unique row ID in club_members table
  student_id: string;
  role: 'member' | 'admin';
  profiles: {
    full_name: string;
    email: string;
  };
}

export const ManageMembersModal = ({ clubId, clubName }: { clubId: string, clubName: string }) => {
  const { profile } = useAuth(); // Logged in user
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Only allow College Admins OR Club Admins to see this button
  // Note: We need to check if *this* user is an admin of *this* club, 
  // but for simplicity in this component, we'll let the DB RLS handle the security.
  // Visually, we hide it if they are just a student.
  const canManage = profile?.role === 'college_admin' || profile?.role === 'club_admin';

  useEffect(() => {
    if (open) fetchMembers();
  }, [open]);

  const fetchMembers = async () => {
    setLoading(true);
    // Fetch members joined in this club + their profile names
    const { data, error } = await supabase
      .from('club_members')
      .select('id, student_id, role, profiles(full_name, email)')
      .eq('club_id', clubId);

    if (error) console.error(error);
    else setMembers(data as any || []);
    
    setLoading(false);
  };

  const handlePromote = async (memberRowId: string, currentRole: string, studentName: string) => {
    const newRole = currentRole === 'member' ? 'admin' : 'member';
    
    // Optimistic UI update
    setMembers(prev => prev.map(m => m.id === memberRowId ? { ...m, role: newRole as any } : m));

    const { error } = await supabase
      .from('club_members')
      .update({ role: newRole })
      .eq('id', memberRowId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      fetchMembers(); // Revert on error
    } else {
      toast({ 
        title: newRole === 'admin' ? "Promoted! 🌟" : "Demoted", 
        description: `${studentName} is now a ${newRole}.` 
      });
    }
  };

  const handleKick = async (memberRowId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to kick ${studentName} from the club?`)) return;

    setMembers(prev => prev.filter(m => m.id !== memberRowId));

    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('id', memberRowId);

    if (error) {
       toast({ variant: "destructive", title: "Error", description: error.message });
       fetchMembers();
    } else {
       toast({ title: "Removed", description: `${studentName} was removed.` });
    }
  };

  if (!canManage) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" /> Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage {clubName} Members</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="space-y-4 mt-2">
            {members.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No members yet.</p>
            ) : (
              members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border">
                  <div>
                    <p className="font-semibold text-sm">{m.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{m.profiles?.email}</p>
                    {m.role === 'admin' && (
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit mt-1">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Promote/Demote Button */}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={m.role === 'member' ? "text-muted-foreground hover:text-primary" : "text-accent hover:text-destructive"}
                      onClick={() => handlePromote(m.id, m.role, m.profiles?.full_name)}
                      title={m.role === 'member' ? "Promote to Admin" : "Demote to Member"}
                    >
                      {m.role === 'member' ? <Shield className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    </Button>

                    {/* Kick Button */}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-red-600"
                      onClick={() => handleKick(m.id, m.profiles?.full_name)}
                      title="Remove from Club"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};