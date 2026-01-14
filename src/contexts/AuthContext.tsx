import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { GraduationCap } from "lucide-react";

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
      {loading ? (
        // GLOBAL LOADING SCREEN
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl animate-pulse">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Loading Campus...
              </p>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
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