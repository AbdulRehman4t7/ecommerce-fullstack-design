"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = await resetPassword(email);
    if (err) setError(err);
    else setSent(true);
  };

  return (
    <AuthLayout title="Reset your password">
      {sent ? (
        <p className="text-sm text-success">
          Check your email for a reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div>
            <label className="mb-1 block text-xs text-grey-text">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Send Reset Link
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
