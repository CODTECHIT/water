import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Search, X, Shield, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
  head: () => ({ meta: [{ title: "Users — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

type User = {
  id: string;
  name: string;
  mobile_number: string;
  email: string;
  upi_id: string;
  role: "customer" | "admin";
  created_at: string;
};

// Derived stats for UI display (in real app, this would be an aggregate query)
type UserWithStats = User & {
  totalOrders: number;
  totalCashback: number;
  lastOrder: string;
  history: { id: string; pack: string; date: string; cashback: number }[];
};

const usersData: UserWithStats[] = [
  { id: "USR-001", name: "Ritika Sharma", email: "ritika@example.com", mobile_number: "+91 9876543210", upi_id: "ritika@ybl", role: "customer", created_at: "2025-03-12T10:00:00Z", totalOrders: 18, totalCashback: 1080, lastOrder: "2026-07-15",
    history: [
      { id: "ORD-2841", pack: "30 cans", date: "2026-07-15", cashback: 100 },
      { id: "ORD-2790", pack: "30 cans", date: "2026-06-28", cashback: 100 },
      { id: "ORD-2731", pack: "15 cans", date: "2026-06-10", cashback: 50 },
    ] },
  { id: "USR-002", name: "Anushka Rao", email: "anushka@example.com", mobile_number: "+91 9876543211", upi_id: "anushka@axl", role: "customer", created_at: "2025-08-04T14:20:00Z", totalOrders: 9, totalCashback: 420, lastOrder: "2026-07-15",
    history: [
      { id: "ORD-2840", pack: "15 cans", date: "2026-07-15", cashback: 50 },
      { id: "ORD-2712", pack: "15 cans", date: "2026-06-01", cashback: 50 },
    ] },
  { id: "USR-003", name: "Farah Khan", email: "farah@example.com", mobile_number: "+91 9876543212", upi_id: "farah@sbi", role: "customer", created_at: "2024-11-20T09:15:00Z", totalOrders: 24, totalCashback: 1740, lastOrder: "2026-07-14",
    history: [
      { id: "ORD-2839", pack: "30 cans", date: "2026-07-14", cashback: 100 },
      { id: "ORD-2801", pack: "30 cans", date: "2026-07-01", cashback: 100 },
    ] },
  { id: "USR-004", name: "Admin Arjun", email: "arjun.admin@kingwater.com", mobile_number: "+91 9876543213", upi_id: "arjun@okhdfcbank", role: "admin", created_at: "2024-01-15T11:00:00Z", totalOrders: 0, totalCashback: 0, lastOrder: "N/A", history: [] },
];

function CustomersPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<UserWithStats | null>(null);

  const filtered = useMemo(
    () => usersData.filter((c) => (c.name + c.email + c.mobile_number + c.upi_id).toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <AdminShell title="Users & Customers" description="CRM — manage all users and their details.">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, phone or UPI..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">UPI ID</th>
              <th className="px-5 py-3 text-right">Orders</th>
              <th className="px-5 py-3 text-right">Cashback</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.email}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.mobile_number}</div>
                </td>
                <td className="px-5 py-3">
                  {c.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-plum/10 px-2 py-0.5 text-xs font-semibold text-plum">
                      <Shield size={12} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      <UserIcon size={12} /> Customer
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.upi_id || "—"}</td>
                <td className="px-5 py-3 text-right text-slate-700">{c.totalOrders}</td>
                <td className="px-5 py-3 text-right font-medium text-emerald-600">₹{c.totalCashback.toLocaleString()}</td>
                <td className="px-5 py-3 text-slate-600 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  {selected.name}
                  {selected.role === 'admin' && <Shield size={14} className="text-plum" />}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{selected.email} · {selected.mobile_number}</p>
                <p className="text-xs text-slate-400 mt-1">Joined {new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
            </div>
            
            <div className="mt-5 rounded-md bg-emerald-50 p-3 border border-emerald-100">
              <div className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold mb-1">UPI ID</div>
              <div className="font-mono text-sm text-emerald-900">{selected.upi_id || "Not provided"}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Orders</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{selected.totalOrders}</div>
              </div>
              <div className="rounded-md bg-slate-50 p-3 border border-slate-100">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Cashback</div>
                <div className="text-xl font-bold text-[#8E2A6B] mt-1">₹{selected.totalCashback.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Order & cashback history</h4>
              <div className="divide-y divide-slate-100 rounded-md border border-slate-200 overflow-hidden">
                {selected.history.length === 0 && (
                  <div className="p-6 text-center text-sm text-slate-500 bg-slate-50">No history recorded.</div>
                )}
                {selected.history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 text-sm bg-white hover:bg-slate-50">
                    <div>
                      <div className="font-mono text-xs text-slate-500">{h.id}</div>
                      <div className="text-slate-800 font-medium">{h.pack}</div>
                      <div className="text-xs text-slate-400">{h.date}</div>
                    </div>
                    <div className="font-semibold text-emerald-600">+₹{h.cashback}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
