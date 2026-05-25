"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { passwordStrength } from "@/lib/utils/slug";

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!terms) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    setSubmitting(true);
    const err = await signUp(email, password, fullName);
    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <AuthLayout title="Create your account">
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-success">
          Account ban gaya! Supabase ne confirmation email bheji hai — inbox/spam kholo,
          link par click karo, phir login karo.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-grey-text">Full Name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
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
        <div>
          <label className="mb-1 block text-xs text-grey-text">Password</label>
          <PasswordInput value={password} onChange={setPassword} />
          {strength && (
            <p
              className={`mt-1 text-xs ${
                strength === "weak"
                  ? "text-red-600"
                  : strength === "medium"
                    ? "text-accent"
                    : "text-success"
              }`}
            >
              Strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs text-grey-text">Confirm Password</label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={setConfirm}
            placeholder="Confirm password"
          />
          {confirm && password !== confirm && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
          )}
        </div>
        <label className="flex items-start gap-2 text-sm text-grey-text">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-1 rounded"
            required
          />
          I agree to Terms &amp; Conditions
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-grey-text">
        <span className="h-px flex-1 bg-border" />
        or sign up with
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton onClick={() => signInWithGoogle()} />

      <p className="mt-6 text-center text-sm text-grey-text">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
