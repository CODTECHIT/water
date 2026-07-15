import { createFileRoute, Link } from "@tanstack/react-router";
import { Chrome } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({
    meta: [
      { title: "Admin Login — King Water" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function AdminLogin() {
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

        <Link
          to="/admin"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Chrome size={18} className="text-[#8E2A6B]" />
          Sign in with Google
        </Link>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized personnel only. Access is logged.
        </p>
      </div>
    </div>
  );
}
