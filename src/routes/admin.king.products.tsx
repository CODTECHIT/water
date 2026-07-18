import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products & Pricing — King Water Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Product = {
  id: string;
  name: string;
  price: number;
  cashback_amount: number;
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, cashback_amount")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const update = (id: string, field: "price" | "cashback_amount", value: number) =>
    setProducts((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));

  const handleSave = async () => {
    setSaving(true);
    let hasError = false;
    for (const p of products) {
      const { error } = await supabase
        .from("products")
        .update({
          price: p.price,
          cashback_amount: p.cashback_amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", p.id);
      
      if (error) {
        console.error("Error updating product:", error);
        hasError = true;
      }
    }
    setSaving(false);
    if (hasError) {
      alert("There was an error saving some changes.");
    } else {
      alert("Products updated successfully!");
    }
  };

  return (
    <AdminShell
      title="Products & Pricing"
      description="Update pack pricing and cashback amounts."
      actions={
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a] disabled:opacity-50"
        >
          <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      }
    >
      <div className="rounded-lg border border-slate-200 bg-white">
        {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading products…</div>
        ) : (
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
            {products.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-4 font-medium text-slate-900">{r.name}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">₹</span>
                    <input
                      type="number"
                      value={r.price}
                      onChange={(e) => update(r.id, "price", Number(e.target.value))}
                      className="w-32 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                    />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">₹</span>
                    <input
                      type="number"
                      value={r.cashback_amount}
                      onChange={(e) => update(r.id, "cashback_amount", Number(e.target.value))}
                      className="w-32 rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                    />
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700">₹{r.price - r.cashback_amount}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                  No products found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Changes apply to new orders only. Existing orders keep their locked-in cashback amounts.
      </p>
    </AdminShell>
  );
}
