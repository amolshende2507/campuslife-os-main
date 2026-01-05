import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Calendar, MapPin, User, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    venue: string;
    date: string;
    image_url: string;
  };
}

export const TicketModal = ({ isOpen, onClose, event }: TicketModalProps) => {
  const { profile } = useAuth();

  // Create a JSON string for the QR code (this is what scanners read)
  const ticketData = JSON.stringify({
    eventId: event.id,
    studentId: profile?.id,
    studentName: profile?.full_name,
    timestamp: new Date().toISOString()
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0">
        <div className="bg-white dark:bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          
          {/* Ticket Header (Image) */}
          <div className="h-32 relative bg-primary">
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover opacity-50" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <h2 className="text-white font-bold text-xl leading-tight">{event.title}</h2>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-6 bg-card text-card-foreground">
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Date</span>
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Time</span>
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-primary" />
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Venue</span>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  {event.venue}
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Attendee</span>
                <div className="flex items-center gap-2 font-medium">
                  <User className="w-4 h-4 text-primary" />
                  {profile?.full_name || "Student"}
                </div>
              </div>
            </div>

            {/* Dashed Line */}
            <div className="relative flex items-center h-4">
              <div className="w-4 h-8 bg-background rounded-r-full absolute -left-6" />
              <div className="flex-1 border-t-2 border-dashed border-muted" />
              <div className="w-4 h-8 bg-background rounded-l-full absolute -right-6" />
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center space-y-4 pt-2">
              <div className="p-2 bg-white rounded-xl shadow-inner">
                <QRCode 
                  value={ticketData} 
                  size={140} 
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Scan this at the entrance<br/>
                <span className="font-mono text-[10px] opacity-50">ID: {event.id.slice(0,8)}</span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};