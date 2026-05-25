"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types/profile";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = () => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((j) => setUsers(j.data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter((u) => {
    if (filter === "admin" && u.role !== "admin") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        (u.full_name?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const makeAdmin = async (id: string) => {
    await fetch(`/api/profiles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
    load();
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Users</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-border px-3 py-2 text-sm"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins Only</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          className="flex-1 min-w-[200px] rounded border border-border px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-page-bg text-xs text-grey-text">
            <tr>
              <th className="p-3 text-left">Avatar</th>
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {(u.full_name ?? u.email)[0]?.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">{u.full_name ?? "—"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      u.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-page-bg text-grey-text"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-grey-text">
                  {new Date(u.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-3">
                  {u.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => makeAdmin(u.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
