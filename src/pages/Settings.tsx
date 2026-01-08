import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User, Mail, Shield, Ticket, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketModal } from "@/components/events/TicketModal";

// NEW imports
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    if (profile) fetchMyEvents();
  }, [profile]);

  const fetchMyEvents = async () => {
    const { data } = await supabase
      .from("event_registrations")
      .select("event_id, events(*)")
      .eq("student_id", profile!.id);

    if (data) {
      setMyEvents(data.map((row: any) => row.events));
    }
  };

  // NEW: Handle Avatar Upload
  const updateAvatar = async (url: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", profile!.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Refreshing to show changes.",
      });

      // Temporary solution — ideally update AuthContext instead
      window.location.reload();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* 1. Identity Card */}
        <div className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* AVATAR SECTION */}
          <div className="w-32 flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm relative group">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                  {profile?.full_name?.[0] || "U"}
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium pointer-events-none">
                Change
              </div>
            </div>

            {/* Image uploader */}
            <div className="w-full max-w-[150px]">
              <ImageUpload folder="avatars" onUpload={updateAvatar} />
            </div>
          </div>

          {/* USER DETAILS */}
          <div className="space-y-2 flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile?.full_name}</h2>

            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              {profile?.email}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground capitalize">
              <Shield className="w-4 h-4" />
              Role: {profile?.role?.replace("_", " ")}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              College ID: {profile?.college_code || "N/A"}
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
                <div
                  key={event.id}
                  className="bg-card border rounded-xl p-4 flex justify-between items-center hover:border-accent/50 transition-all"
                >
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.venue}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTicket(event)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    View
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
