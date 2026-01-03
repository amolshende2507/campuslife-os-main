import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export const AdminComplaintView = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    // Admin sees ALL complaints
    const { data } = await supabase
      .from('complaints')
      .select('*, profiles(full_name, email)') // Join profile to see who sent it (if not anon)
      .order('submitted_at', { ascending: false });
    setComplaints(data || []);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('complaints')
      .update({ 
        status: newStatus,
        resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Status Updated" });
      fetchAllComplaints();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Incoming Complaints (Faculty View)</h2>
      <div className="grid gap-4">
        {complaints.map((c) => (
          <div key={c.id} className="p-4 border rounded-xl bg-card flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">{c.title}</span>
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">{c.category}</span>
                {c.is_anonymous ? (
                  <span className="text-xs text-orange-500 font-mono">Anonymous</span>
                ) : (
                  <span className="text-xs text-blue-500">{c.profiles?.full_name}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{c.description}</p>
              <div className="text-xs text-muted-foreground">
                Status: <span className="uppercase font-semibold">{c.status}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {c.status !== 'resolved' && (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(c.id, 'resolved')}>
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Resolve
                </Button>
              )}
              {c.status !== 'in_review' && c.status !== 'resolved' && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(c.id, 'in_review')}>
                  <Clock className="w-4 h-4 mr-1" /> Review
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

//verification