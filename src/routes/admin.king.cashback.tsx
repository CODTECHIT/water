import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { Check, X, Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/cashback")({
  component: CashbackPage,
  head: () => ({
    meta: [{ title: "Cashback Claims — King Water Admin" }, { name: "robots", content: "noindex" }],
  }),
});

type CashbackClaimJoined = {
  id: string; // display ID
  fullId: string; // original UUID
  user_id: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  claimed_at: string;
  user: {
    name: string;
    mobile_number: string;
    email: string;
    upi_id: string;
  };
};

const tabs = ["all", "pending", "paid", "rejected"] as const;

function CashbackPage() {
  const [claims, setClaims] = useState<CashbackClaimJoined[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [q, setQ] = useState("");
  const [viewClaim, setViewClaim] = useState<CashbackClaimJoined | null>(null);
  const [updating, setUpdating] = useState(false);

  async function fetchClaims() {
    setLoading(true);
    const { data, error } = await supabase
      .from("cashback_claims")
      .select("id, user_id, amount, status, claimed_at, users(name, phone_number, email)")
      .order("claimed_at", { ascending: false });

    if (error) {
      console.error("Error fetching claims:", error.message);
      setLoading(false);
      return;
    }

    const mapped: CashbackClaimJoined[] = (data ?? []).map((c: any) => ({
      id: c.id.slice(0, 8).toUpperCase(),
      fullId: c.id,
      user_id: c.user_id,
      amount: c.amount,
      status: (c.status ?? "Pending").toLowerCase() as any,
      claimed_at: c.claimed_at,
      user: {
        name: c.users?.name ?? "Unknown",
        mobile_number: c.users?.phone_number ?? "",
        email: c.users?.email ?? "",
        upi_id: "N/A (Not in DB)", // Adjust if UPI ID is added to users
      },
    }));

    setClaims(mapped);
    setLoading(false);
  }

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    // Find the claim in state to get the full original ID
    const claim = claims.find((c) => c.id === id);
    if (claim && claim.fullId) {
       await supabase.from("cashback_claims").update({ status: newStatus, processed_at: new Date().toISOString() }).eq("id", claim.fullId);
       await fetchClaims();
    }
    setViewClaim(null);
    setUpdating(false);
  };


  const filtered = useMemo(() => {
    let result = claims;
    if (tab !== "all") {
      result = result.filter((c) => c.status === tab);
    }
    if (q.trim()) {
      const query = q.toLowerCase();
      result = result.filter(
        (c) =>
          c.user.name.toLowerCase().includes(query) ||
          c.user.mobile_number.includes(query) ||
          c.id.toLowerCase().includes(query),
      );
    }
    return result;
  }, [tab, q, claims]);

  return (
    <AdminShell
      title="Cashback Claims"
      description="Review and fulfill customer cashback requests."
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex rounded-md border border-slate-200 bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                tab === t ? "bg-[#8E2A6B] text-white" : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
        {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading claims…</div>
        ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Claim ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.id}</td>
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{c.user.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.user.mobile_number}</div>
                </td>
                <td className="px-5 py-3">
                  <div className="font-medium text-[#8E2A6B] mt-0.5">₹{c.amount}</div>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(c.claimed_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status === "paid" ? "Delivered" : c.status === "rejected" ? "Cancelled" : "Pending"} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setViewClaim(c)}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="View Details"
                    >
                      <Info size={16} />
                    </button>
                    {c.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateStatus(c.id, 'Paid')} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                          <Check size={12} /> Mark Paid
                        </button>
                        <button onClick={() => handleUpdateStatus(c.id, 'Rejected')} className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors">
                          <X size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">
                  No claims match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {viewClaim && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setViewClaim(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Claim {viewClaim.id}</h3>
                <p className="text-sm text-slate-500">
                  Requested on {new Date(viewClaim.claimed_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewClaim(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Customer Details
                </div>
                <div className="font-medium text-slate-900">{viewClaim.user.name}</div>
                <div className="text-sm text-slate-600 mt-1">{viewClaim.user.email}</div>
                <div className="text-sm text-slate-600">{viewClaim.user.mobile_number}</div>
                <div className="text-xs text-slate-400 mt-1">User ID: {viewClaim.user_id}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Amount
                  </div>
                  <div className="text-2xl font-bold text-[#8E2A6B]">
                    ₹{viewClaim.amount}
                  </div>
                </div>
                <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Status
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={viewClaim.status === "paid" ? "Delivered" : viewClaim.status === "rejected" ? "Cancelled" : "Pending"} />
                  </div>
                </div>
              </div>
            </div>

            {viewClaim.status === "pending" && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button 
                  disabled={updating}
                  onClick={() => handleUpdateStatus(viewClaim.id, 'Paid')}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  <Check size={16} /> Mark as Paid
                </button>
                <p className="text-xs text-center text-slate-500 mt-3">
                  Please ensure you have completed the transfer before marking as paid.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
