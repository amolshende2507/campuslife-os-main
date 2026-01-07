import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TicketScanner = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("Ready to scan");
  const [studentDetails, setStudentDetails] = useState<any>(null);

  // Security: Only Admins can access
  if (profile?.role === 'student') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">Only Club Admins or Faculty can scan tickets.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleScan = async (text: string) => {
    if (!text || loading || status === 'success') return;

    setLoading(true);
    setStatus('idle');

    try {
      // 1. Parse QR Data
      const ticketData = JSON.parse(text); 
      // Expected format: { eventId, studentId, ... }

      if (!ticketData.eventId || !ticketData.studentId) {
        throw new Error("Invalid QR Code format");
      }

      // 2. Verify Registration in Supabase
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*, events(title), profiles(full_name, college_code)')
        .eq('event_id', ticketData.eventId)
        .eq('student_id', ticketData.studentId)
        .single();

      if (error || !data) {
        throw new Error("Registration not found! (Student is not registered)");
      }

      // 3. Check for Duplicate Entry
      if (data.status === 'attended') {
         setStatus('error');
         setMessage(`ALREADY SCANNED: ${data.profiles.full_name}`);
         setLoading(false);
         return;
      }

      // 4. Mark as Attended (Check-in)
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({ status: 'attended' })
        .eq('id', data.id);

      if (updateError) throw updateError;

      // 5. Success
      setStatus('success');
      setMessage(`Verified: ${data.profiles.full_name}`);
      setStudentDetails({
        event: data.events.title,
        name: data.profiles.full_name,
        college: data.profiles.college_code
      });
      
      // Play a beep sound (Optional)
      // new Audio('/beep.mp3').play();

    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(error.message || "Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setStatus('idle');
    setMessage("Ready to scan");
    setStudentDetails(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Ticket Scanner</h1>
          <p className="text-muted-foreground">Scan student QR codes for entry</p>
        </div>

        {/* Camera View */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl bg-black">
          {status === 'idle' && (
            <Scanner 
              onResult={(text) => handleScan(text)} 
              onError={(error) => console.log(error?.message)}
              options={{ delayBetweenScanAttempts: 500 }}
              components={{ audio: false, finder: false }} // Custom UI
            />
          )}

          {/* Overlay UI for Status */}
          {status !== 'idle' && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-6 text-center animate-in fade-in zoom-in">
                {status === 'success' ? (
                  <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" />
                ) : (
                  <XCircle className="w-20 h-20 text-destructive mb-4" />
                )}
                
                <h2 className={`text-2xl font-bold mb-2 ${status === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
                  {status === 'success' ? "ACCESS GRANTED" : "ACCESS DENIED"}
                </h2>
                
                <p className="font-medium text-lg mb-1">{message}</p>
                
                {studentDetails && (
                  <div className="bg-secondary/50 p-3 rounded-lg mt-2 text-sm">
                    <p><strong>Event:</strong> {studentDetails.event}</p>
                    <p><strong>ID:</strong> {studentDetails.college}</p>
                  </div>
                )}

                <Button onClick={resetScanner} size="lg" className="mt-6 w-full">
                  <RefreshCw className="w-4 h-4 mr-2" /> Scan Next
                </Button>
             </div>
          )}

          {/* Scanning Animation Line */}
          {status === 'idle' && (
             <div className="absolute inset-0 pointer-events-none">
               <div className="w-full h-1 bg-primary/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-[scan_2s_infinite]" />
               <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-xl" />
             </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center gap-2 text-primary">
            <Loader2 className="animate-spin" /> Verifying...
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TicketScanner;