import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { Plus, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [{ title: "Orders — King Water Admin" }, { name: "robots", content: "noindex" }],
  }),
});

type Order = {
  id: string;
  fullId: string;
  customer: string;
  email: string;
  pack: string;
  date: string;
  status: "Pending" | "Delivered";
  cashback: number;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone_number: string;
};

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [packSelect, setPackSelect] = useState("15 cans");
  const [customPack, setCustomPack] = useState("");
  const [customCashback, setCustomCashback] = useState(0);

  // New order form state
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({ name: "", phone: "", email: "" });
  
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, ordered_at, quantity, total_amount, users(name, email), products(name)")
      .order("ordered_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error.message);
      setLoading(false);
      return;
    }

    const mapped: Order[] = (data ?? []).map((o: any) => ({
      id: o.id.slice(0, 8).toUpperCase(),
      fullId: o.id,
      customer: o.users?.name ?? "Unknown",
      email: o.users?.email ?? "",
      pack: o.products?.name ?? `${o.quantity} cans`,
      date: o.ordered_at?.split("T")[0] ?? "",
      status: o.status === "Delivered" ? "Delivered" : "Pending",
      cashback: o.total_amount ?? 0,
    }));

    setOrders(mapped);
    setLoading(false);
  }

  async function fetchCustomers() {
    const { data } = await supabase.from("users").select("id, name, email, phone_number").order("name");
    if (data) setAllCustomers(data);
  }

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const filtered = useMemo(
    () =>
      orders.filter((o) =>
        (o.customer + o.email + o.date).toLowerCase().includes(q.toLowerCase()),
      ),
    [q, orders],
  );

  const handleMarkDelivered = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "Delivered" })
      .eq("id", orderId);
      
    if (error) {
      alert("Error updating order: " + error.message);
    } else {
      await fetchOrders();
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return allCustomers;
    const lower = customerSearch.toLowerCase();
    return allCustomers.filter(c => 
      c.name?.toLowerCase().includes(lower) || 
      c.email?.toLowerCase().includes(lower) || 
      c.phone_number?.includes(lower)
    );
  }, [allCustomers, customerSearch]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalUserId = selectedCustomer?.id;

    if (isNewCustomer) {
      const { data: newUser, error: newUserErr } = await supabase.from("users").insert({
        name: newCustomerData.name,
        phone_number: newCustomerData.phone,
        email: newCustomerData.email,
        password_hash: "admin_created_no_password"
      }).select("id").single();

      if (newUserErr) {
        alert("Error creating new customer: " + newUserErr.message);
        setSaving(false);
        return;
      }
      finalUserId = newUser.id;
    }

    if (!finalUserId) {
      alert("Please select or create a customer first.");
      setSaving(false);
      return;
    }

    const packName = packSelect === "Custom" ? customPack : packSelect;
    const cashbackAmt = packSelect === "Custom" ? customCashback : packSelect === "15 cans" ? 50 : 100;

    // Find a product that matches the pack name, or use first product
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .ilike("name", `%${packName}%`)
      .limit(1);

    const productId = products?.[0]?.id || null;

    let qty = 1;
    if (packSelect === "15 cans") qty = 15;
    else if (packSelect === "30 cans") qty = 30;
    else {
      const match = customPack.match(/\d+/);
      if (match) qty = parseInt(match[0], 10);
    }

    const { error } = await supabase.from("orders").insert({
      user_id: finalUserId,
      product_id: productId,
      quantity: qty,
      total_amount: cashbackAmt,
      status: "Pending",
      ordered_at: new Date(newDate).toISOString(),
    });

    if (error) {
      alert("Error creating order: " + error.message);
    } else {
      await fetchOrders();
      await fetchCustomers();
      setOpen(false);
      
      // Reset state
      setSelectedCustomer(null);
      setCustomerSearch("");
      setIsNewCustomer(false);
      setNewCustomerData({ name: "", phone: "", email: "" });
      setPackSelect("15 cans");
      setCustomPack("");
      setCustomCashback(0);
    }
    setSaving(false);
  };

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

      <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading orders…</div>
        ) : (
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
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.status} />
                      {o.status === "Pending" && (
                        <button
                          onClick={() => handleMarkDelivered(o.fullId)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-900">₹{o.cashback}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                    {loading ? "Loading…" : "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Add New Order</h3>
                <p className="text-xs text-slate-500">Create an order on behalf of a customer.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleCreateOrder}>
              <div>
                <label className="text-xs font-medium text-slate-700">Customer</label>
                {!isNewCustomer ? (
                  <div className="mt-1 relative border border-slate-300 rounded-md overflow-hidden bg-white focus-within:border-[#8E2A6B] focus-within:ring-1 focus-within:ring-[#8E2A6B]">
                    {selectedCustomer ? (
                      <div className="flex items-center justify-between p-2 text-sm bg-slate-50">
                        <div>
                          <div className="font-semibold">{selectedCustomer.name}</div>
                          <div className="text-xs text-slate-500">{selectedCustomer.phone_number}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(null)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search name, phone, or email..."
                          className="w-full px-3 py-2 text-sm outline-none"
                        />
                        {customerSearch && (
                          <div className="max-h-40 overflow-y-auto border-t border-slate-200">
                            {filteredCustomers.map(c => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCustomer(c);
                                  setCustomerSearch("");
                                }}
                                className="w-full text-left p-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                              >
                                <div className="text-sm font-medium">{c.name}</div>
                                <div className="text-xs text-slate-500">{c.phone_number} · {c.email}</div>
                              </button>
                            ))}
                            {filteredCustomers.length === 0 && (
                              <div className="p-3 text-center text-xs text-slate-500">
                                No customers found.
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNewCustomer(true)}
                          className="w-full p-2 text-xs font-semibold text-[#8E2A6B] bg-plum/5 hover:bg-plum/10 text-center border-t border-slate-200"
                        >
                          + Add New Customer
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 p-3 border border-slate-300 rounded-md bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#8E2A6B]">New Customer Details</span>
                      <button
                        type="button"
                        onClick={() => setIsNewCustomer(false)}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <input
                        required={isNewCustomer}
                        placeholder="Full Name"
                        value={newCustomerData.name}
                        onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B]"
                      />
                    </div>
                    <div>
                      <input
                        required={isNewCustomer}
                        placeholder="Phone Number"
                        value={newCustomerData.phone}
                        onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email (Optional)"
                        value={newCustomerData.email}
                        onChange={e => setNewCustomerData({...newCustomerData, email: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#8E2A6B]"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Pack type</label>
                <select
                  value={packSelect}
                  onChange={(e) => setPackSelect(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                >
                  <option value="15 cans">15 cans</option>
                  <option value="30 cans">30 cans</option>
                  <option value="Custom">Custom...</option>
                </select>
              </div>
              {packSelect === "Custom" && (
                <div>
                  <label className="text-xs font-medium text-slate-700">Custom Pack Description</label>
                  <input
                    value={customPack}
                    onChange={(e) => setCustomPack(e.target.value)}
                    required
                    type="text"
                    placeholder="e.g. 50 cans, Event setup, etc."
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-700">Order date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                />
              </div>
              <div className="rounded-md bg-slate-50 px-3 py-2">
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Cashback for this order (₹)
                </label>
                {packSelect === "Custom" ? (
                  <input
                    type="number"
                    required
                    min="0"
                    value={customCashback}
                    onChange={(e) => setCustomCashback(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
                  />
                ) : (
                  <div className="font-semibold text-[#8E2A6B] text-lg">
                    ₹{packSelect === "15 cans" ? 50 : 100}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-[#8E2A6B] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#75225a] disabled:opacity-60"
                >
                  {saving ? "Creating…" : "Create order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
