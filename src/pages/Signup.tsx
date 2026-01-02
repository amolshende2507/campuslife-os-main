import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase"; // Import Supabase
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Import Toast
import { GraduationCap, Mail, Lock, User, Building, Eye, EyeOff, Check, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    collegeCode: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call Supabase Sign Up
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name, // This is sent to our SQL trigger
            college_code: formData.collegeCode
          },
        },
      });

      if (error) throw error;

      // 2. Success!
      toast({
        title: "Account created successfully! 🎉",
        description: "Welcome to CampusLife OS. You have been logged in.",
      });

      // 3. Redirect to Dashboard
      navigate("/dashboard");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... Keep the existing features array ...
  const features = [
    "Unlimited event registrations",
    "Join and follow clubs",
    "Anonymous complaint submission",
    "Personalized announcements",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual (Keep as is) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent via-accent/90 to-primary items-center justify-center p-12 relative overflow-hidden">
         {/* ... (Your existing visual code) ... */}
         <div className="relative z-10 text-white max-w-md">
           <div className="w-20 h-20 mb-8 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Start your journey today</h2>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">
              Campus<span className="text-primary">Life</span> OS
            </span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Join the revolution.</p>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="collegeCode">College Code</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="collegeCode"
                      value={formData.collegeCode}
                      onChange={handleChange}
                      placeholder="e.g., COEP2024"
                      className="pl-10 h-12 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Rahul Sharma"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <Button type="button" variant="hero" className="w-full h-12" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@college.edu"
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1 h-12" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;