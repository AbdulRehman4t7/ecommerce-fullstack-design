"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { signIn, signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect);
    }
  }, [loading, user, redirect, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      setError("Invalid email or password");
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <AuthLayout title="Sign in to your account">
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs text-grey-text">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs text-grey-text">
            Password
          </label>
          <PasswordInput id="password" value={password} onChange={setPassword} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-grey-text">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-grey-text">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton onClick={() => signInWithGoogle()} />

      <p className="mt-6 text-center text-sm text-grey-text">
        New customer?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
