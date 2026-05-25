import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { user: null, profile: null };
  return { user, profile: await getProfile(user.id) };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; status: number; error: string }
> {
  const { user, profile } = await getSessionUser();
  if (!user) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  if (profile?.role !== "admin") {
    return { ok: false, status: 403, error: "Admin access required" };
  }
  return { ok: true, userId: user.id };
}
