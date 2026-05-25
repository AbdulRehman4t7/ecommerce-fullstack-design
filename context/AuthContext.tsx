"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );

  const loadProfile = useCallback(
    async (userId: string) => {
      if (!supabase) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      setProfile((data as Profile | null) ?? null);
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadProfile]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!supabase) return "Supabase is not configured";
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      return error?.message ?? null;
    },
    [supabase]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return "Supabase is not configured";
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    const redirectTo = `${window.location.origin}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string) => {
      if (!supabase) return "Supabase is not configured";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return error?.message ?? null;
    },
    [supabase]
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      isAdmin: profile?.role === "admin",
      refreshProfile,
    }),
    [
      user,
      profile,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
