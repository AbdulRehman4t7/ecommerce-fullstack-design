export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}
