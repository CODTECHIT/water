import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/cashback")({
  component: CashbackPage,
  head: () => ({ meta: [{ title: "Cashback Claims — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

type Claim = {
  id: string;
  customer: string;
  order: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
};

const claims: Claim[] = [
  { id: "CLM-0912", customer: "Vikas Menon", order: "ORD-2830", amount: 90, status: "Pending", date: "2026-07-15" },
  { id: "CLM-0911", customer: "Devansh Gupta", order: "ORD-2828", amount: 40, status: "Approved", date: "2026-07-15" },
  { id: "CLM-0910", customer: "Sana Iyer", order: "ORD-2826", amount: 90, status: "Rejected", date: "2026-07-14" },
  { id: "CLM-0909", customer: "Ritika Sharma", order: "ORD-2822", amount: 90, status: "Approved", date: "2026-07-14" },
  { id: "CLM-0908", customer: "Anushka Rao", order: "ORD-2819", amount: 40, status: "Pending", date: "2026-07-13" },
  { id: "CLM-0907", customer: "Farah Khan", order: "ORD-2815", amount: 90, status: "Approved", date: "2026-07-13" },
  { id: "CLM-0906", customer: "Neha Bansal", order: "ORD-2811", amount: 40, status: "Pending", date: "2026-07-12" },
];

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;

function CashbackPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const filtered = useMemo(
    () => (tab === "All" ? claims : claims.filter((c) => c.status === tab)),
    [tab],
  );

  return (
    <AdminShell title="Cashback Claims" description="Review and approve customer cashback requests.">
      <div className="mb-4 inline-flex rounded-md border border-slate-200 bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t ? "bg-[#8E2A6B] text-white" : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Claim</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.id}</td>
                <td className="px-5 py-3 font-medium text-slate-900">{c.customer}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.order}</td>
                <td className="px-5 py-3 text-right font-medium text-slate-900">₹{c.amount}</td>
                <td className="px-5 py-3 text-slate-600">{c.date}</td>
                <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-3">
                  {c.status === "Pending" ? (
                    <div className="flex justify-end gap-2">
                      <button className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                        <Check size={12} /> Approve
                      </button>
                      <button className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700">
                        <X size={12} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-right text-xs text-slate-400">—</div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No claims in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
