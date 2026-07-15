import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { ShoppingCart, Wallet, Users, FlaskConical, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

const stats = [
  { label: "Orders This Month", value: "482", delta: "+12.4%", icon: ShoppingCart },
  { label: "Pending Cashback Claims", value: "37", delta: "6 new today", icon: Wallet },
  { label: "Total Customers", value: "1,284", delta: "+28 this week", icon: Users },
  { label: "Latest TDS Report", value: "Jul 14, 2026", delta: "Uploaded by Priya", icon: FlaskConical },
];

const activity = [
  { id: "ORD-2841", who: "Ritika Sharma", type: "Order · 30 cans", when: "10 min ago", status: "Pending" as const },
  { id: "CLM-0912", who: "Vikas Menon", type: "Cashback claim ₹90", when: "24 min ago", status: "Pending" as const },
  { id: "ORD-2840", who: "Anushka Rao", type: "Order · 15 cans", when: "1 h ago", status: "Delivered" as const },
  { id: "CLM-0911", who: "Devansh Gupta", type: "Cashback claim ₹40", when: "1 h ago", status: "Approved" as const },
  { id: "ORD-2839", who: "Farah Khan", type: "Order · 30 cans", when: "2 h ago", status: "Delivered" as const },
  { id: "ORD-2838", who: "Mihir Patel", type: "Order · 15 cans", when: "3 h ago", status: "Delivered" as const },
  { id: "CLM-0910", who: "Sana Iyer", type: "Cashback claim ₹90", when: "4 h ago", status: "Rejected" as const },
  { id: "ORD-2837", who: "Karthik Nair", type: "Order · 30 cans", when: "5 h ago", status: "Delivered" as const },
  { id: "ORD-2836", who: "Neha Bansal", type: "Order · 15 cans", when: "6 h ago", status: "Pending" as const },
  { id: "ORD-2835", who: "Zoya Ahmed", type: "Order · 30 cans", when: "8 h ago", status: "Delivered" as const },
];

function DashboardPage() {
  return (
    <AdminShell title="Dashboard" description="Overview of today's operations">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500">{s.delta}</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[#8E2A6B]/10 text-[#8E2A6B]">
                <s.icon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            <p className="text-xs text-slate-500">Latest orders and claims across the platform.</p>
          </div>
          <button className="inline-flex items-center gap-1 text-xs font-medium text-[#8E2A6B] hover:underline">
            View all <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activity.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{r.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{r.who}</td>
                  <td className="px-5 py-3 text-slate-600">{r.type}</td>
                  <td className="px-5 py-3 text-slate-500">{r.when}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
