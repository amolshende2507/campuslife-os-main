import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User, Mail, Shield, Ticket, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketModal } from "@/components/events/TicketModal";

export default function Settings() {
  const { profile } = useAuth();
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    if (profile) fetchMyEvents();
  }, [profile]);

  const fetchMyEvents = async () => {
    // Fetch events the user is registered for
    const { data } = await supabase
      .from('event_registrations')
      .select('event_id, events(*)')
      .eq('student_id', profile!.id);
    
    if (data) {
      // Flatten the structure
      setMyEvents(data.map((row: any) => row.events));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* 1. Identity Card */}
        <div className="bg-card border rounded-2xl p-6 flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
            {profile?.full_name?.[0] || "U"}
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" /> {profile?.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground capitalize">
              <Shield className="w-4 h-4" /> Role: {profile?.role?.replace('_', ' ')}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" /> College ID: {profile?.college_code || "N/A"}
            </div>
          </div>
        </div>

        {/* 2. Ticket Wallet */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-accent" /> My Tickets
          </h2>
          
          {myEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myEvents.map((event) => (
                <div key={event.id} className="bg-card border rounded-xl p-4 flex justify-between items-center group hover:border-accent/50 transition-all">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{event.venue}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedTicket(event)}>
                    <QrCode className="w-4 h-4 mr-2" /> View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
              You haven't registered for any events yet.
            </div>
          )}
        </div>
      </div>

      {selectedTicket && (
        <TicketModal 
          isOpen={!!selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          event={selectedTicket} 
        />
      )}
    </DashboardLayout>
  );
}