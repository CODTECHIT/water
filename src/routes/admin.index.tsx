import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { ShoppingCart, Wallet, Users, FlaskConical, ArrowUpRight, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";

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
      
      {/* ACTION WIDGETS (Top Row) */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Pending Payouts Reminder */}
        <Link to={"/admin/cashback" as "/admin"} className="group block rounded-lg border border-amber-200 bg-amber-50 p-5 hover:bg-amber-100/50 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={64} className="text-amber-600" />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800">Pending Payouts</h3>
              <p className="mt-1 text-2xl font-bold text-amber-900">₹3,240</p>
              <p className="mt-1 text-xs font-medium text-amber-700">pending across 12 customers</p>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:text-amber-800">
            Process payments now <ArrowUpRight size={14} />
          </div>
        </Link>

        {/* Analytics: Top Pack */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">This Month's Top Pack</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">30 Cans</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50 text-emerald-600">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">30 Cans (68%)</span>
              <span className="text-slate-900">328 orders</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 flex">
              <div className="bg-[#8E2A6B] h-full" style={{ width: '68%' }} />
              <div className="bg-slate-300 h-full" style={{ width: '32%' }} />
            </div>
          </div>
        </div>

        {/* Analytics: Avg Cashback */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Avg Cashback per Customer</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">₹425</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-md bg-blue-50 text-blue-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-slate-500">
            Based on <span className="text-slate-900">1,284</span> active customers claiming rewards.
          </div>
        </div>
      </div>

      {/* STANDARD STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</div>
                <div className="mt-1 text-xs text-slate-500">{s.delta}</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-500">
                <s.icon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVITY TABLE */}
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
