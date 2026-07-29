import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/login")({
  component: AdminLogin,
  head: () => ({
    meta: [
      { title: "Admin Login — King Water" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else if (data.session?.user?.email !== "kingwatercompany@gmail.com") {
      await supabase.auth.signOut();
      setError("Unauthorized access.");
      setIsLoading(false);
    } else {
      navigate({ to: "/admin/king" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 font-sans">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#8E2A6B] text-lg font-semibold text-white">
            K
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            King Water Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to continue to the internal dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#8E2A6B] focus:outline-none focus:ring-1 focus:ring-[#8E2A6B]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#8E2A6B] focus:outline-none focus:ring-1 focus:ring-[#8E2A6B]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#8E2A6B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a245c] disabled:opacity-70"
          >
            <Lock size={16} />
            {isLoading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized personnel only. Access is logged.
        </p>
      </div>
    </div>
  );
}
