import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { Check, X, Search, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/cashback")({
  component: CashbackPage,
  head: () => ({ meta: [{ title: "Cashback Claims — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

// Matches exactly what Supabase will return when querying cashback_claims with a join on users
type CashbackClaimJoined = {
  id: string;
  user_id: string;
  pack_type: "15 cans" | "30 cans";
  cashback_amount: number;
  status: "pending" | "paid";
  created_at: string;
  user: {
    name: string;
    mobile_number: string;
    email: string;
    upi_id: string;
  };
};

const initialClaims: CashbackClaimJoined[] = [
  { 
    id: "CLM-0912", user_id: "USR-001", pack_type: "30 cans", cashback_amount: 100, status: "pending", created_at: "2026-07-16T10:15:00Z",
    user: { name: "Ritika Sharma", mobile_number: "+91 9876543210", email: "ritika@example.com", upi_id: "ritika@ybl" }
  },
  { 
    id: "CLM-0911", user_id: "USR-002", pack_type: "15 cans", cashback_amount: 50, status: "paid", created_at: "2026-07-15T14:30:00Z",
    user: { name: "Anushka Rao", mobile_number: "+91 9876543211", email: "anushka@example.com", upi_id: "anushka@axl" }
  },
  { 
    id: "CLM-0910", user_id: "USR-003", pack_type: "30 cans", cashback_amount: 100, status: "pending", created_at: "2026-07-15T09:45:00Z",
    user: { name: "Farah Khan", mobile_number: "+91 9876543212", email: "farah@example.com", upi_id: "farah@sbi" }
  }
];

const tabs = ["all", "pending", "paid"] as const;

function CashbackPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [q, setQ] = useState("");
  const [viewClaim, setViewClaim] = useState<CashbackClaimJoined | null>(null);

  const filtered = useMemo(
    () => {
      let result = initialClaims;
      if (tab !== "all") {
        result = result.filter(c => c.status === tab);
      }
      if (q.trim()) {
        const query = q.toLowerCase();
        result = result.filter(c => 
          c.user.name.toLowerCase().includes(query) || 
          c.user.mobile_number.includes(query) || 
          c.user.upi_id.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)
        );
      }
      return result;
    },
    [tab, q]
  );

  return (
    <AdminShell title="Cashback Claims" description="Review and fulfill customer cashback requests via UPI.">
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
            placeholder="Search by name, UPI or phone..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Claim ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Pack & Amount</th>
              <th className="px-5 py-3">UPI ID</th>
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
                  <div className="text-slate-700 capitalize">{c.pack_type}</div>
                  <div className="font-medium text-[#8E2A6B] mt-0.5">₹{c.cashback_amount}</div>
                </td>
                <td className="px-5 py-3 font-medium text-slate-700">{c.user.upi_id}</td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status === "paid" ? "Delivered" : "Pending"} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setViewClaim(c)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="View Details">
                      <Info size={16} />
                    </button>
                    {c.status === "pending" && (
                      <button className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                        <Check size={12} /> Mark Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No claims match your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setViewClaim(null)}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Claim {viewClaim.id}</h3>
                <p className="text-sm text-slate-500">Requested on {new Date(viewClaim.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewClaim(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            <div className="mt-5 space-y-4">
              <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Customer Details</div>
                <div className="font-medium text-slate-900">{viewClaim.user.name}</div>
                <div className="text-sm text-slate-600 mt-1">{viewClaim.user.email}</div>
                <div className="text-sm text-slate-600">{viewClaim.user.mobile_number}</div>
                <div className="text-xs text-slate-400 mt-1">User ID: {viewClaim.user_id}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Amount</div>
                  <div className="text-2xl font-bold text-[#8E2A6B]">₹{viewClaim.cashback_amount}</div>
                  <div className="text-xs text-slate-500 mt-1 capitalize">For {viewClaim.pack_type}</div>
                </div>
                <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</div>
                  <div className="mt-1">
                    <StatusBadge status={viewClaim.status === "paid" ? "Delivered" : "Pending"} />
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-emerald-50 p-4 border border-emerald-100">
                <div className="text-xs text-emerald-800 uppercase tracking-wider font-semibold mb-1">Transfer Details (UPI)</div>
                <div className="font-mono text-lg text-emerald-900 break-all">{viewClaim.user.upi_id}</div>
              </div>
            </div>

            {viewClaim.status === "pending" && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <button className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                  <Check size={16} /> Mark as Paid
                </button>
                <p className="text-xs text-center text-slate-500 mt-3">
                  Please ensure you have completed the UPI transfer before marking as paid.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
