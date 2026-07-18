import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import {
  ShoppingCart,
  Wallet,
  Users,
  FlaskConical,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard — King Water Admin" }, { name: "robots", content: "noindex" }],
  }),
});

type ActivityItem = {
  id: string;
  who: string;
  type: string;
  date: Date;
  when: string;
  status: "Pending" | "Delivered" | "Approved" | "Rejected" | "Cancelled";
};

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days} d ago`;
}

function DashboardPage() {
  const [stats, setStats] = useState({
    ordersThisMonth: 0,
    pendingClaimsCount: 0,
    pendingClaimsAmount: 0,
    totalCustomers: 0,
    latestTdsDate: "N/A",
    latestTdsBy: "N/A",
    topPackName: "N/A",
    topPackPercentage: 0,
    avgCashback: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        { count: totalCustomers },
        { data: pendingClaims },
        { data: ordersThisMonth },
        { data: tdsData },
        { data: recentOrders },
        { data: recentClaims }
      ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("cashback_claims").select("amount").eq("status", "Pending"),
        supabase.from("orders").select("quantity, products(name)").gte("ordered_at", startOfMonth.toISOString()),
        supabase.from("tds_reports").select("report_date, uploaded_by").order("report_date", { ascending: false }).limit(1).single(),
        supabase.from("orders").select("id, status, ordered_at, quantity, users(name), products(name)").order("ordered_at", { ascending: false }).limit(5),
        supabase.from("cashback_claims").select("id, status, claimed_at, amount, users(name)").order("claimed_at", { ascending: false }).limit(5)
      ]);

      const pendingClaimsCount = pendingClaims?.length || 0;
      const pendingClaimsAmount = pendingClaims?.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;
      
      const ordersCount = ordersThisMonth?.length || 0;
      let totalCansThisMonth = 0;
      
      let topPackName = "N/A";
      let topPackPercentage = 0;
      if (ordersThisMonth && ordersThisMonth.length > 0) {
        const packCounts: Record<string, number> = {};
        ordersThisMonth.forEach((o: any) => {
          const name = o.products?.name || "Custom";
          const qty = Number(o.quantity) || 0;
          packCounts[name] = (packCounts[name] || 0) + qty;
          totalCansThisMonth += qty;
        });
        
        let maxPack = "";
        let maxCount = 0;
        Object.entries(packCounts).forEach(([name, count]) => {
          if (count > maxCount) {
            maxCount = count;
            maxPack = name;
          }
        });
        
        topPackName = maxPack;
        topPackPercentage = totalCansThisMonth > 0 ? Math.round((maxCount / totalCansThisMonth) * 100) : 0;
      }

      setStats({
        ordersThisMonth: ordersCount,
        pendingClaimsCount,
        pendingClaimsAmount,
        totalCustomers: totalCustomers || 0,
        latestTdsDate: tdsData?.report_date
          ? new Date(tdsData.report_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        latestTdsBy: tdsData?.uploaded_by || "Unknown",
        topPackName,
        topPackPercentage,
        avgCashback: 0,
      });

      const combined: ActivityItem[] = [];
      
      if (recentOrders) {
        recentOrders.forEach((o: any) => {
          const d = new Date(o.ordered_at);
          combined.push({
            id: o.id.slice(0, 8).toUpperCase(),
            who: o.users?.name || "Unknown",
            type: `Order · ${o.products?.name || o.quantity + " cans"}`,
            date: d,
            when: formatTimeAgo(d),
            status: o.status === "Delivered" ? "Delivered" : "Pending",
          });
        });
      }

      if (recentClaims) {
        recentClaims.forEach((c: any) => {
          const d = new Date(c.claimed_at);
          combined.push({
            id: c.id.slice(0, 8).toUpperCase(),
            who: c.users?.name || "Unknown",
            type: `Cashback claim ₹${c.amount}`,
            date: d,
            when: formatTimeAgo(d),
            status: c.status === "Paid" ? "Delivered" : c.status === "Rejected" ? "Cancelled" : "Pending",
          });
        });
      }

      combined.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setActivity(combined.slice(0, 10));
      setLoading(false);
    }

    loadDashboard();
  }, []);

  const statCards = [
    { label: "Orders This Month", value: stats.ordersThisMonth.toString(), delta: "from start of month", icon: ShoppingCart },
    { label: "Pending Cashback Claims", value: stats.pendingClaimsCount.toString(), delta: "needs action", icon: Wallet },
    { label: "Total Customers", value: stats.totalCustomers.toString(), delta: "all time", icon: Users },
    {
      label: "Latest TDS Report",
      value: stats.latestTdsDate,
      delta: `Uploaded by ${stats.latestTdsBy}`,
      icon: FlaskConical,
    },
  ];

  return (
    <AdminShell title="Dashboard" description="Overview of today's operations">
      {/* ACTION WIDGETS (Top Row) */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Pending Payouts Reminder */}
        <Link
          to={"/admin/king/cashback"}
          className="group block rounded-lg border border-amber-200 bg-amber-50 p-5 hover:bg-amber-100/50 transition-colors relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={64} className="text-amber-600" />
          </div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800">
                Pending Payouts
              </h3>
              <p className="mt-1 text-2xl font-bold text-amber-900">₹{stats.pendingClaimsAmount}</p>
              <p className="mt-1 text-xs font-medium text-amber-700">across {stats.pendingClaimsCount} claims</p>
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
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                This Month's Top Pack
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">{stats.topPackName}</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50 text-emerald-600">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">{stats.topPackName} ({stats.topPackPercentage}%)</span>
              <span className="text-slate-900">{stats.ordersThisMonth} total orders</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 flex">
              <div className="bg-[#8E2A6B] h-full" style={{ width: `${stats.topPackPercentage}%` }} />
              <div className="bg-slate-300 h-full" style={{ width: `${100 - stats.topPackPercentage}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* STANDARD STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {s.label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {loading ? "..." : s.value}
                </div>
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
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">
                    Loading activity…
                  </td>
                </tr>
              )}
              {!loading && activity.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">
                    No recent activity found.
                  </td>
                </tr>
              )}
              {activity.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{r.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-900">{r.who}</td>
                  <td className="px-5 py-3 text-slate-600">{r.type}</td>
                  <td className="px-5 py-3 text-slate-500">{r.when}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
