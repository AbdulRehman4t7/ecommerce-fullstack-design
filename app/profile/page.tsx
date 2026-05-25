"use client";

import PageShell from "@/components/layout/PageShell";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl p-8 text-center text-grey-text">Loading...</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-semibold">My Profile</h1>
        <div className="mt-6 rounded-lg border border-border bg-white p-6">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-grey-text">Full Name</dt>
              <dd className="font-medium">{profile?.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-grey-text">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-grey-text">Role</dt>
              <dd className="font-medium capitalize">{profile?.role ?? "user"}</dd>
            </div>
            <div>
              <dt className="text-grey-text">Country</dt>
              <dd className="font-medium">{profile?.country ?? "Pakistan"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </PageShell>
  );
}
