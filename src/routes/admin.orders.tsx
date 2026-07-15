import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { Plus, Search, X } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Orders — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

type Order = {
  id: string;
  customer: string;
  email: string;
  pack: "15 cans" | "30 cans";
  date: string;
  status: "Pending" | "Delivered";
  cashback: number;
};

const seed: Order[] = [
  { id: "ORD-2841", customer: "Ritika Sharma", email: "ritika@example.com", pack: "30 cans", date: "2026-07-15", status: "Pending", cashback: 90 },
  { id: "ORD-2840", customer: "Anushka Rao", email: "anushka@example.com", pack: "15 cans", date: "2026-07-15", status: "Delivered", cashback: 40 },
  { id: "ORD-2839", customer: "Farah Khan", email: "farah@example.com", pack: "30 cans", date: "2026-07-14", status: "Delivered", cashback: 90 },
  { id: "ORD-2838", customer: "Mihir Patel", email: "mihir@example.com", pack: "15 cans", date: "2026-07-14", status: "Delivered", cashback: 40 },
  { id: "ORD-2837", customer: "Karthik Nair", email: "karthik@example.com", pack: "30 cans", date: "2026-07-13", status: "Delivered", cashback: 90 },
  { id: "ORD-2836", customer: "Neha Bansal", email: "neha@example.com", pack: "15 cans", date: "2026-07-13", status: "Pending", cashback: 40 },
  { id: "ORD-2835", customer: "Zoya Ahmed", email: "zoya@example.com", pack: "30 cans", date: "2026-07-12", status: "Delivered", cashback: 90 },
  { id: "ORD-2834", customer: "Devansh Gupta", email: "devansh@example.com", pack: "15 cans", date: "2026-07-12", status: "Delivered", cashback: 40 },
];

function OrdersPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [pack, setPack] = useState<"15 cans" | "30 cans">("15 cans");

  const filtered = useMemo(
    () =>
      seed.filter((o) =>
        (o.customer + o.email + o.date).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <AdminShell
      title="Orders"
      description="All customer orders across packs."
      actions={
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a]"
        >
          <Plus size={14} /> Add New Order
        </button>
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or date…"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Pack</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Cashback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs text-slate-600">{o.id}</td>
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{o.customer}</div>
                  <div className="text-xs text-slate-500">{o.email}</div>
                </td>
                <td className="px-5 py-3 text-slate-700">{o.pack}</td>
                <td className="px-5 py-3 text-slate-600">{o.date}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right font-medium text-slate-900">₹{o.cashback}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No orders match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Add New Order</h3>
                <p className="text-xs text-slate-500">Create an order on behalf of a customer.</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
              <div>
                <label className="text-xs font-medium text-slate-700">Customer</label>
                <input placeholder="Search customer name or phone…" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Pack type</label>
                <select value={pack} onChange={(e) => setPack(e.target.value as "15 cans" | "30 cans")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]">
                  <option>15 cans</option>
                  <option>30 cans</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Order date</label>
                <input type="date" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
              </div>
              <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Cashback for this order: <span className="font-semibold text-[#8E2A6B]">₹{pack === "15 cans" ? 40 : 90}</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a]">Create order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
