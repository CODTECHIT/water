import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";
import { Check, X, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/king/qr-scans")({
  component: QRScansPage,
  head: () => ({
    meta: [{ title: "Pending QR Scans — King Water Admin" }, { name: "robots", content: "noindex" }],
  }),
});

type QRRequest = {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  upi_id: string;
  pack_type: string;
  status: string;
  submitted_at: string;
};

function QRScansPage() {
  const [requests, setRequests] = useState<QRRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("qr_requests")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching QR requests:", error.message);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (req: QRRequest) => {
    setProcessing(req.id);
    
    // 1. Check if user exists and has orders
    let userId = null;
    let hasOrders = false;
    
    const { data: existingUsers } = await supabase
      .from("users")
      .select("id")
      .eq("phone_number", req.phone_number)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id;
      // Check if they have past orders
      const { data: pastOrders } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .limit(1);
      
      if (pastOrders && pastOrders.length > 0) {
        hasOrders = true;
      }
    }

    if (!hasOrders) {
      const proceed = confirm("Warning: No existing orders found for this phone number. Do you still want to approve this cashback request and create an account?");
      if (!proceed) {
        setProcessing(null);
        return;
      }
    }

    // 2. Create User if they don't exist
    if (!userId) {
      const { data: newUser, error: newUserErr } = await supabase.from("users").insert({
        name: req.full_name,
        phone_number: req.phone_number,
        email: req.email || null,
        password_hash: "qr_auto_created"
      }).select("id").single();

      if (newUserErr) {
        alert("Error creating user: " + newUserErr.message);
        setProcessing(null);
        return;
      }
      userId = newUser.id;
    }

    // 3. Create Cashback Claim ONLY (Do NOT create an order)
    const amt = req.pack_type?.includes("15") ? 50 : req.pack_type?.includes("30") ? 100 : 50;
    
    const { error: claimErr } = await supabase.from("cashback_claims").insert({
      user_id: userId,
      amount: amt,
      status: "pending"
    });

    if (claimErr) {
      alert("Error creating cashback claim: " + claimErr.message);
      setProcessing(null);
      return;
    }

    // 4. Mark QR Request as Approved
    await supabase.from("qr_requests").update({ status: "Approved" }).eq("id", req.id);
    
    await fetchRequests();
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this QR scan request?")) return;
    setProcessing(id);
    await supabase.from("qr_requests").update({ status: "Rejected" }).eq("id", id);
    await fetchRequests();
    setProcessing(null);
  };

  const filtered = requests.filter(r => 
    r.full_name?.toLowerCase().includes(q.toLowerCase()) || 
    r.phone_number?.includes(q)
  );

  return (
    <AdminShell
      title="Pending QR Scans"
      description="Review cashback requests submitted via the public QR code."
    >
      <div className="mb-4">
        <div className="relative w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#8E2A6B] focus:ring-1 focus:ring-[#8E2A6B]"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
        {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading requests…</div>
        ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Customer Info</th>
              <th className="px-5 py-3">UPI ID</th>
              <th className="px-5 py-3">Pack Type</th>
              <th className="px-5 py-3">Submitted At</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-900">{r.full_name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.phone_number}</div>
                  {r.email && <div className="text-xs text-slate-500">{r.email}</div>}
                </td>
                <td className="px-5 py-3 font-medium text-slate-700">{r.upi_id}</td>
                <td className="px-5 py-3 text-slate-600">{r.pack_type}</td>
                <td className="px-5 py-3 text-slate-600">
                  {new Date(r.submitted_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={r.status === "Approved" ? "Delivered" : r.status === "Rejected" ? "Cancelled" : "Pending"} />
                </td>
                <td className="px-5 py-3">
                  {r.status === "Pending" && (
                    <div className="flex justify-end gap-2">
                      <button 
                        disabled={processing === r.id}
                        onClick={() => handleApprove(r)} 
                        className="inline-flex items-center gap-1 rounded-md bg-[#8E2A6B] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#722156] transition-colors disabled:opacity-50"
                      >
                        <Check size={12} /> Approve & Create Claim
                      </button>
                      <button 
                        disabled={processing === r.id}
                        onClick={() => handleReject(r.id)} 
                        className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </AdminShell>
  );
}
