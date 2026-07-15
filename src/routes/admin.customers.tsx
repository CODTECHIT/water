import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Search, X } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
  head: () => ({ meta: [{ title: "Customers — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

type Customer = {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalCashback: number;
  joined: string;
  lastOrder: string;
  history: { id: string; pack: string; date: string; cashback: number }[];
};

const customers: Customer[] = [
  { id: "C-001", name: "Ritika Sharma", email: "ritika@example.com", totalOrders: 18, totalCashback: 1080, joined: "2025-03-12", lastOrder: "2026-07-15",
    history: [
      { id: "ORD-2841", pack: "30 cans", date: "2026-07-15", cashback: 90 },
      { id: "ORD-2790", pack: "30 cans", date: "2026-06-28", cashback: 90 },
      { id: "ORD-2731", pack: "15 cans", date: "2026-06-10", cashback: 40 },
    ] },
  { id: "C-002", name: "Anushka Rao", email: "anushka@example.com", totalOrders: 9, totalCashback: 420, joined: "2025-08-04", lastOrder: "2026-07-15",
    history: [
      { id: "ORD-2840", pack: "15 cans", date: "2026-07-15", cashback: 40 },
      { id: "ORD-2712", pack: "15 cans", date: "2026-06-01", cashback: 40 },
    ] },
  { id: "C-003", name: "Farah Khan", email: "farah@example.com", totalOrders: 24, totalCashback: 1740, joined: "2024-11-20", lastOrder: "2026-07-14",
    history: [
      { id: "ORD-2839", pack: "30 cans", date: "2026-07-14", cashback: 90 },
      { id: "ORD-2801", pack: "30 cans", date: "2026-07-01", cashback: 90 },
    ] },
  { id: "C-004", name: "Mihir Patel", email: "mihir@example.com", totalOrders: 6, totalCashback: 240, joined: "2026-01-15", lastOrder: "2026-07-14", history: [] },
  { id: "C-005", name: "Karthik Nair", email: "karthik@example.com", totalOrders: 15, totalCashback: 990, joined: "2025-05-22", lastOrder: "2026-07-13", history: [] },
  { id: "C-006", name: "Neha Bansal", email: "neha@example.com", totalOrders: 4, totalCashback: 160, joined: "2026-04-01", lastOrder: "2026-07-13", history: [] },
];

function CustomersPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = useMemo(
    () => customers.filter((c) => (c.name + c.email).toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <AdminShell title="Customers" description="CRM — all King Water customers.">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3 text-right">Orders</th>
              <th className="px-5 py-3 text-right">Cashback Earned</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-5 py-3 text-slate-600">{c.email}</td>
                <td className="px-5 py-3 text-right text-slate-700">{c.totalOrders}</td>
                <td className="px-5 py-3 text-right font-medium text-slate-900">₹{c.totalCashback.toLocaleString()}</td>
                <td className="px-5 py-3 text-slate-600">{c.joined}</td>
                <td className="px-5 py-3 text-slate-600">{c.lastOrder}</td>
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
                <h3 className="text-base font-semibold text-slate-900">{selected.name}</h3>
                <p className="text-xs text-slate-500">{selected.email} · Joined {selected.joined}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Total Orders</div>
                <div className="text-lg font-semibold text-slate-900">{selected.totalOrders}</div>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Total Cashback</div>
                <div className="text-lg font-semibold text-[#8E2A6B]">₹{selected.totalCashback.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order & cashback history</h4>
              <div className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-200">
                {selected.history.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">No recent history recorded.</div>
                )}
                {selected.history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <div className="font-mono text-xs text-slate-500">{h.id}</div>
                      <div className="text-slate-800">{h.pack} · {h.date}</div>
                    </div>
                    <div className="font-medium text-slate-900">+₹{h.cashback}</div>
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
