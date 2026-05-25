"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  id = "password",
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-border px-3 py-2 pr-10 text-sm outline-none focus:border-primary"
        minLength={8}
        required
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-text"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
