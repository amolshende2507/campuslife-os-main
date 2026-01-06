import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Mail, Lock, User, Building, Eye, EyeOff, Check, Loader2, Users, School } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    collegeCode: "",
    secretCode: "" // Only for Admins
  });

  const [role, setRole] = useState<"student" | "club_admin" | "college_admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Secret Code Checks (Security)
    if (role === 'college_admin' && formData.secretCode !== 'ADMIN123') {
      toast({ variant: "destructive", title: "Security Alert", description: "Invalid Faculty Code." });
      setLoading(false);
      return;
    }

    if (role === 'club_admin' && formData.secretCode !== 'CLUB123') {
      toast({ variant: "destructive", title: "Security Alert", description: "Invalid Club Code." });
      setLoading(false);
      return;
    }

    try {
      // 2. Create User in Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            college_code: formData.collegeCode,
            role: role // Triggers the SQL function we wrote
          },
        },
      });

      if (error) throw error;

      // 3. LOGIC CHANGE: Check if email confirmation is required
      if (data?.user && !data.session) {
        // Case A: Email Confirmation is ON in Supabase
        toast({
          title: "Account Created! 📧",
          description: "Please check your email to confirm your account before logging in.",
        });
        navigate("/login"); // Send them to login page
      } else {
        // Case B: Email Confirmation is OFF (Auto-login)
        // We still redirect to Login to force them to "Enter" the app properly visually
        toast({
          title: "Account Created! 🎉",
          description: "Please sign in with your new credentials.",
        });
        navigate("/login");
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent via-accent/90 to-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-white max-w-md">
          <div className="w-20 h-20 mb-8 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Start your journey today</h2>
          <p className="text-white/80 mb-6">Join the operating system for your campus life.</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3"><Check className="w-4 h-4" /> <span>Unified Campus Dashboard</span></li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4" /> <span>Event & Club Management</span></li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4" /> <span>Secure Complaint Redressal</span></li>
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">Campus<span className="text-primary">Life</span> OS</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-6">Choose your role to get started.</p>

          {/* ROLE SELECTOR */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${role === 'student' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-secondary'}`}
            >
              <GraduationCap className={`w-6 h-6 ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium">Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("club_admin")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${role === 'club_admin' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:bg-secondary'}`}
            >
              <Users className={`w-6 h-6 ${role === 'club_admin' ? 'text-accent' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium">Club Lead</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("college_admin")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${role === 'college_admin' ? 'border-destructive bg-destructive/5 ring-1 ring-destructive' : 'border-border hover:bg-secondary'}`}
            >
              <School className={`w-6 h-6 ${role === 'college_admin' ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium">Faculty</span>
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                {/* Secret Code Field (Only for Admins) */}
                {role !== 'student' && (
                  <div className="space-y-2">
                    <Label className="text-destructive font-semibold">
                      {role === 'club_admin' ? 'Club Secret Code' : 'Faculty Secret Code'}
                    </Label>
                    <Input
                      id="secretCode"
                      type="password"
                      value={formData.secretCode}
                      onChange={handleChange}
                      placeholder={role === 'club_admin' ? "Enter CLUB123" : "Enter ADMIN123"}
                      className="border-destructive/50 focus-visible:ring-destructive"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
                </div>

                <div className="space-y-2">
                  <Label>College Code</Label>
                  <Input id="collegeCode" value={formData.collegeCode} onChange={handleChange} placeholder="e.g. COEP2024" className="uppercase" />
                </div>

                <Button type="button" variant="hero" className="w-full" onClick={() => setStep(2)}>Continue</Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Create Account"}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;