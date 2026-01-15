import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, Users, School } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Visual only
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"student" | "club_admin" | "college_admin">("student");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Perform Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 2. SECURITY CHECK: Verify Role
      // We fetch the profile immediately to check if they are in the right portal
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // 3. Compare Selected Tab vs Actual DB Role
      if (profile?.role !== selectedTab) {
        // If mismatch, sign them out immediately
        await supabase.auth.signOut();

        toast({
          variant: "destructive",
          title: "Access Denied 🚫",
          description: `This account is not a ${selectedTab.replace('_', ' ')}. Please use the correct login tab.`,
        });
        setLoading(false);
        return;
      }

      // 4. Success
      toast({ title: "Welcome back!", description: "Logging you in..." });
      navigate("/dashboard");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials.",
      });
    } finally {
      setLoading(false);
    }
  };
   // NEW: Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">Campus<span className="text-primary">Life</span> OS</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-6">Login to your account.</p>

          {/* VISUAL ROLE SELECTOR */}
          {/* ROLE SELECTOR */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <button 
              type="button" onClick={() => setSelectedTab("student")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedTab === 'student' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-secondary'}`}
            >
              <GraduationCap className={`w-6 h-6 ${selectedTab === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium">Student</span>
            </button>

            <button 
              type="button" onClick={() => setSelectedTab("club_admin")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedTab === 'club_admin' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:bg-secondary'}`}
            >
              <Users className={`w-6 h-6 ${selectedTab === 'club_admin' ? 'text-accent' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium">Club Lead</span>
            </button>

            <button 
              type="button" onClick={() => setSelectedTab("college_admin")}
              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedTab === 'college_admin' ? 'border-destructive bg-destructive/5 ring-1 ring-destructive' : 'border-border hover:bg-secondary'}`}
            >
              <School className={`w-6 h-6 ${selectedTab === 'college_admin' ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium">Faculty</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" className="pl-10 h-12" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 h-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-accent items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4">Your campus, simplified.</h2>
          <p className="text-white/80">Everything you need to manage your academic and social life in one place.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;