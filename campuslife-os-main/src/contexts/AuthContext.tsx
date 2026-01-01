import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check (Runs on Refresh)
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user ?? null);

        // CRITICAL FIX: Stop loading immediately after getting session.
        // We do NOT wait for the profile fetch to finish.
        setLoading(false); 

        if (session?.user) {
          fetchProfile(session.user.id); // Run in background
        }
      } catch (error) {
        console.error("Auth Init Error:", error);
        setLoading(false); // Ensure we never get stuck
      }
    };

    initAuth();

    // 2. Real-time Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If we just logged in, we might be loading. Stop it now.
      setLoading(false);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};