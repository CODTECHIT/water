import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Search, X, Plus, ShoppingBag, Download, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
  head: () => ({ meta: [{ title: "Customers — King Water Admin" }, { name: "robots", content: "noindex" }] }),
});

type User = {
  id: string;
  name: string;
  mobile_number: string;
  email: string;
  upi_id: string;
  created_at: string;
};

type OrderHistory = {
  id: string;
  pack: string;
  date: string;
  cashback: number;
  status: "Delivered" | "Pending";
};

type UserWithStats = User & {
  totalOrders: number;
  totalCashback: number;
  lastOrder: string;
  history: OrderHistory[];
};

const initialUsersData: UserWithStats[] = [
  { id: "USR-001", name: "Ritika Sharma", email: "ritika@example.com", mobile_number: "+91 9876543210", upi_id: "ritika@ybl", created_at: "2025-03-12T10:00:00Z", totalOrders: 21, totalCashback: 1080, lastOrder: "2026-07-15",
    history: [
      { id: "ORD-2841", pack: "30 cans", date: "2026-07-15", cashback: 100, status: "Delivered" },
      { id: "ORD-2790", pack: "30 cans", date: "2026-06-28", cashback: 100, status: "Delivered" },
      { id: "ORD-2731", pack: "15 cans", date: "2026-06-10", cashback: 50, status: "Delivered" },
    ] },
  { id: "USR-002", name: "Anushka Rao", email: "anushka@example.com", mobile_number: "+91 9876543211", upi_id: "anushka@axl", created_at: "2025-08-04T14:20:00Z", totalOrders: 12, totalCashback: 420, lastOrder: "2026-07-15",
    history: [
      { id: "ORD-2840", pack: "15 cans", date: "2026-07-15", cashback: 50, status: "Pending" },
      { id: "ORD-2712", pack: "15 cans", date: "2026-06-01", cashback: 50, status: "Delivered" },
    ] },
  { id: "USR-003", name: "Farah Khan", email: "farah@example.com", mobile_number: "+91 9876543212", upi_id: "farah@sbi", created_at: "2024-11-20T09:15:00Z", totalOrders: 24, totalCashback: 1740, lastOrder: "2026-07-14",
    history: [
      { id: "ORD-2839", pack: "30 cans", date: "2026-07-14", cashback: 100, status: "Delivered" },
      { id: "ORD-2801", pack: "30 cans", date: "2026-07-01", cashback: 100, status: "Delivered" },
    ] },
  { id: "USR-005", name: "Mihir Patel", email: "mihir@example.com", mobile_number: "+91 9876543214", upi_id: "mihir@okicici", created_at: "2026-01-10T12:00:00Z", totalOrders: 4, totalCashback: 150, lastOrder: "2026-07-10", history: [] }
];

function CustomersPage() {
  const [users, setUsers] = useState<UserWithStats[]>(initialUsersData);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<UserWithStats | null>(null);

  // Add Customer State
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", mobile_number: "", email: "", upi_id: "" });
  const [duplicateWarning, setDuplicateWarning] = useState<UserWithStats | null>(null);

  // Add Order State
  const [addingOrderForUserId, setAddingOrderForUserId] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState({ date: new Date().toISOString().split('T')[0], status: "Pending" as const });
  const [packSelect, setPackSelect] = useState("15 cans");
  const [customPack, setCustomPack] = useState("");
  const [customCashback, setCustomCashback] = useState(0);

  const filtered = useMemo(
    () => users.filter((c) => (c.name + c.email + c.mobile_number + c.upi_id).toLowerCase().includes(q.toLowerCase())),
    [users, q],
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning(null);

    const existing = users.find(u => u.mobile_number === newCustomer.mobile_number || (u.email === newCustomer.email && newCustomer.email !== ""));
    if (existing) {
      setDuplicateWarning(existing);
      return;
    }

    const newUser: UserWithStats = {
      id: `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...newCustomer,
      created_at: new Date().toISOString(),
      totalOrders: 0,
      totalCashback: 0,
      lastOrder: "N/A",
      history: []
    };
    setUsers([newUser, ...users]);
    setShowAddCustomer(false);
    setNewCustomer({ name: "", mobile_number: "", email: "", upi_id: "" });
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingOrderForUserId) return;
    
    const finalPack = packSelect === "Custom" ? customPack : packSelect;
    const amount = packSelect === "15 cans" ? 50 : packSelect === "30 cans" ? 100 : customCashback;
    
    setUsers(currentUsers => currentUsers.map(user => {
      if (user.id === addingOrderForUserId) {
        const orderHistoryItem: OrderHistory = {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          pack: finalPack,
          date: newOrder.date,
          cashback: amount,
          status: newOrder.status
        };
        return {
          ...user,
          totalOrders: user.totalOrders + 1,
          totalCashback: user.totalCashback + amount,
          lastOrder: newOrder.date,
          history: [orderHistoryItem, ...user.history]
        };
      }
      return user;
    }));
    
    setAddingOrderForUserId(null);
    setNewOrder({ date: new Date().toISOString().split('T')[0], status: "Pending" });
    setPackSelect("15 cans");
    setCustomPack("");
    setCustomCashback(0);
  };

  const calculateStats = (history: OrderHistory[]) => {
    let claimed = 0;
    let pending = 0;
    history.forEach(h => {
      if (h.status === "Delivered") claimed += h.cashback;
      if (h.status === "Pending") pending += h.cashback;
    });
    return { claimed, pending };
  };

  const exportCSV = () => {
    const headers = ["Customer ID", "Name", "Email", "Mobile Number", "UPI ID", "Total Orders", "Total Cashback", "Created Date"];
    const rows = filtered.map(c => [
      c.id, c.name, c.email, c.mobile_number, c.upi_id, c.totalOrders.toString(), c.totalCashback.toString(), new Date(c.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell || ''}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `king_water_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminShell title="Customers" description="CRM — manage all customers and their details.">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, phone or UPI..."
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]" />
          </div>
          <button 
            onClick={exportCSV}
            title="Export to CSV"
            className="inline-flex h-[38px] items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
          </button>
        </div>
        <button 
          onClick={() => { setShowAddCustomer(true); setDuplicateWarning(null); }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#8E2A6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#75225a] transition-colors"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">UPI ID</th>
              <th className="px-5 py-3 text-right">Orders</th>
              <th className="px-5 py-3 text-right">Cashback</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 group">
                <td className="px-5 py-3 cursor-pointer" onClick={() => setSelected(c)}>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-slate-900 group-hover:text-[#8E2A6B] transition-colors">{c.name}</div>
                      {c.totalOrders >= 20 ? (
                        <span className="inline-flex items-center rounded-full bg-[#B8863B]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#B8863B] ring-1 ring-inset ring-[#B8863B]/20">Gold Customer</span>
                      ) : c.totalOrders >= 10 ? (
                        <span className="inline-flex items-center rounded-full bg-plum/10 px-1.5 py-0.5 text-[10px] font-bold text-plum ring-1 ring-inset ring-plum/20">Loyal Customer</span>
                      ) : null}
                    </div>
                    <div className="text-xs text-slate-500">{c.email}</div>
                    <div className="text-xs text-slate-400">{c.mobile_number}</div>
                  </div>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600 cursor-pointer" onClick={() => setSelected(c)}>{c.upi_id || "—"}</td>
                <td className="px-5 py-3 text-right text-slate-700 cursor-pointer" onClick={() => setSelected(c)}>{c.totalOrders}</td>
                <td className="px-5 py-3 text-right font-medium text-emerald-600 cursor-pointer" onClick={() => setSelected(c)}>₹{c.totalCashback.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setAddingOrderForUserId(c.id); }}
                      className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-[#8E2A6B] hover:text-[#8E2A6B] hover:bg-plum/5 transition-colors"
                    >
                      <ShoppingBag size={14} /> Add Order
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between shrink-0 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-display text-slate-900 flex items-center gap-2 mb-1">
                  {selected.name}
                  {selected.totalOrders >= 20 ? (
                    <span className="inline-flex items-center rounded-full bg-[#B8863B]/10 px-2 py-0.5 text-xs font-bold text-[#B8863B] ring-1 ring-inset ring-[#B8863B]/20">Gold Customer</span>
                  ) : selected.totalOrders >= 10 ? (
                    <span className="inline-flex items-center rounded-full bg-plum/10 px-2 py-0.5 text-xs font-bold text-plum ring-1 ring-inset ring-plum/20">Loyal Customer</span>
                  ) : null}
                </h3>
                <p className="text-sm text-slate-500">{selected.email} · {selected.mobile_number}</p>
                <p className="text-xs text-slate-400 mt-1">Joined {new Date(selected.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            <div className="overflow-y-auto shrink-1 pr-2 space-y-6">
              <div className="rounded-md bg-emerald-50 p-4 border border-emerald-100">
                <div className="text-xs text-emerald-800 uppercase tracking-wider font-semibold mb-1">UPI ID (For Cashback)</div>
                <div className="font-mono text-base text-emerald-900">{selected.upi_id || "Not provided"}</div>
              </div>

              {(() => {
                const stats = calculateStats(selected.history);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Orders</div>
                      <div className="text-2xl font-bold text-slate-900 mt-1">{selected.totalOrders}</div>
                    </div>
                    <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Cashback Claimed</div>
                      <div className="text-2xl font-bold text-[#8E2A6B] mt-1">₹{stats.claimed}</div>
                    </div>
                    <div className="rounded-md bg-amber-50 p-4 border border-amber-100">
                      <div className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold">Cashback Pending</div>
                      <div className="text-2xl font-bold text-amber-600 mt-1">₹{stats.pending}</div>
                    </div>
                  </div>
                )
              })()}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Order History</h4>
                  <button 
                    onClick={() => { setSelected(null); setAddingOrderForUserId(selected.id); }}
                    className="text-xs font-semibold text-[#8E2A6B] hover:underline"
                  >
                    + Add Order
                  </button>
                </div>
                <div className="divide-y divide-slate-100 rounded-md border border-slate-200 overflow-hidden">
                  {selected.history.length === 0 && (
                    <div className="p-6 text-center text-sm text-slate-500 bg-slate-50">No history recorded.</div>
                  )}
                  {selected.history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-4 text-sm bg-white hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">{h.pack}</span>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                            h.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {h.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">ID: {h.id} · {new Date(h.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">+₹{h.cashback}</div>
                        <div className="text-[10px] text-slate-400">Cashback</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setShowAddCustomer(false)}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowAddCustomer(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            {duplicateWarning && (
              <div className="mb-4 flex items-start gap-3 rounded-md bg-rose-50 p-3 border border-rose-100">
                <AlertTriangle size={16} className="text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-rose-800">A customer with this contact info already exists:</p>
                  <button 
                    onClick={() => { setShowAddCustomer(false); setSelected(duplicateWarning); setDuplicateWarning(null); }}
                    className="mt-1 flex items-center gap-1 text-xs font-semibold text-rose-700 hover:underline"
                  >
                    View {duplicateWarning.name} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700">Full Name</label>
                <input required type="text" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Mobile Number</label>
                <input required type="tel" value={newCustomer.mobile_number} onChange={e => setNewCustomer({...newCustomer, mobile_number: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Email</label>
                <input required type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" placeholder="rahul@example.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">UPI ID (Optional)</label>
                <input type="text" value={newCustomer.upi_id} onChange={e => setNewCustomer({...newCustomer, upi_id: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" placeholder="rahul@upi" />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddCustomer(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-md bg-[#8E2A6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#75225a]">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ORDER MODAL */}
      {addingOrderForUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setAddingOrderForUserId(null)}>
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Add Order</h3>
                <p className="text-xs text-slate-500">For {users.find(u => u.id === addingOrderForUserId)?.name}</p>
              </div>
              <button onClick={() => setAddingOrderForUserId(null)} className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700">Pack Type</label>
                <select value={packSelect} onChange={e => setPackSelect(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]">
                  <option value="15 cans">15 Cans Pack</option>
                  <option value="30 cans">30 Cans Pack</option>
                  <option value="Custom">Custom...</option>
                </select>
              </div>
              {packSelect === "Custom" && (
                <div>
                  <label className="text-xs font-medium text-slate-700">Custom Pack Description</label>
                  <input value={customPack} onChange={e => setCustomPack(e.target.value)} required type="text" placeholder="e.g. 50 cans" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-700">Order Date</label>
                <input required type="date" value={newOrder.date} onChange={e => setNewOrder({...newOrder, date: e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Status</label>
                <select value={newOrder.status} onChange={e => setNewOrder({...newOrder, status: e.target.value as any})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]">
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="rounded-md bg-slate-50 p-3 border border-slate-100">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Calculated Cashback (₹)</label>
                {packSelect === "Custom" ? (
                  <input type="number" required min="0" value={customCashback} onChange={e => setCustomCashback(Number(e.target.value))} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#8E2A6B]" />
                ) : (
                  <div className="text-xl font-bold text-[#8E2A6B] mt-1">₹{packSelect === "30 cans" ? "100" : "50"}</div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setAddingOrderForUserId(null)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-md bg-[#8E2A6B] px-4 py-2 text-sm font-medium text-white hover:bg-[#75225a]">Save Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
