import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
  head: () => ({ meta: [{ title: "Products & Pricing — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

function ProductsPage() {
  const [rows, setRows] = useState([
    { key: "15", label: "15 Cans Pack", price: 750, cashback: 50 },
    { key: "30", label: "30 Cans Pack", price: 1400, cashback: 100 },
  ]);

  const update = (key: string, field: "price" | "cashback", value: number) =>
    setRows((r) => r.map((row) => (row.key === key ? { ...row, [field]: value } : row)));

  return (
    <AdminShell
      title="Products & Pricing"
      description="Update pack pricing and cashback amounts."
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a]">
          <Save size={14} /> Save Changes
        </button>
      }
    >
      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Pack</th>
              <th className="px-5 py-3">Price (₹)</th>
              <th className="px-5 py-3">Cashback per order (₹)</th>
              <th className="px-5 py-3">Effective margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.key}>
                <td className="px-5 py-4 font-medium text-slate-900">{r.label}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">₹</span>
                    <input
                      type="number"
                      value={r.price}
                      onChange={(e) => update(r.key, "price", Number(e.target.value))}
                      className="w-32 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                    />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">₹</span>
                    <input
                      type="number"
                      value={r.cashback}
                      onChange={(e) => update(r.key, "cashback", Number(e.target.value))}
                      className="w-32 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                    />
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700">₹{r.price - r.cashback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Changes apply to new orders only. Existing orders keep their locked-in cashback amounts.
      </p>
    </AdminShell>
  );
}
