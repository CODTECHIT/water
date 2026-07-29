import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { 
  Package, 
  Droplet, 
  Wallet, 
  Clock, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { SiteLayout } from "@/components/king/SiteLayout";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [cashback, setCashback] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      // Find the customer ID from public.users by matching the logged-in email
      const { data: publicUsers } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .limit(1);
        
      const customerId = publicUsers?.[0]?.id || session.user.id;

      // Fetch user's orders using the correct customer ID
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', customerId)
        .order('ordered_at', { ascending: false, nullsFirst: false });
      
      if (ordersData) setOrders(ordersData);

      // Fetch cashback claims
      const { data: cashbackData } = await supabase
        .from('cashback_claims')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });
        
      if (cashbackData) setCashback(cashbackData);
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const totalAccrued = orders.filter(o => o.status === 'Delivered').reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
  const totalClaimed = cashback.filter(c => c.status === 'Paid' || c.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalCashback = totalAccrued - totalClaimed;
  const pendingCashback = cashback.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif text-slate-900">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Customer'}.
              </h1>
              <p className="mt-1 text-slate-500">
                Manage your deliveries, view TDS reports, and track cashback.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'overview' 
                    ? 'bg-white shadow-sm border border-slate-200 text-[#8E2A6B] font-medium' 
                    : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5" />
                    <span>Overview</span>
                  </div>
                  {activeTab === 'overview' && <ChevronRight className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'orders' 
                    ? 'bg-white shadow-sm border border-slate-200 text-[#8E2A6B] font-medium' 
                    : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Droplet className="h-5 w-5" />
                    <span>My Deliveries</span>
                  </div>
                  {activeTab === 'orders' && <ChevronRight className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setActiveTab('cashback')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'cashback' 
                    ? 'bg-white shadow-sm border border-slate-200 text-[#8E2A6B] font-medium' 
                    : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-5 w-5" />
                    <span>Cashback Wallet</span>
                  </div>
                  {activeTab === 'cashback' && <ChevronRight className="h-4 w-4" />}
                </button>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href="/report"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-slate-600 hover:bg-white/50 hover:text-[#8E2A6B]"
                  >
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="h-5 w-5" />
                      <span>Check Water TDS</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </nav>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 text-slate-500 mb-2">
                    <Wallet className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium">Earned Cashback</span>
                  </div>
                  <div className="text-3xl font-serif text-slate-900">₹{totalCashback}</div>
                  {pendingCashback > 0 && (
                    <div className="text-xs text-slate-400 mt-1">₹{pendingCashback} pending approval</div>
                  )}
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 text-slate-500 mb-2">
                    <Droplet className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Total Orders</span>
                  </div>
                  <div className="text-3xl font-serif text-slate-900">{orders.length}</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 text-slate-500 mb-2">
                    <ShieldCheck className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Account Status</span>
                  </div>
                  <div className="text-3xl font-serif text-slate-900">Active</div>
                </div>
              </div>

              {/* Recent Orders Section */}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-medium text-slate-900">Recent Deliveries</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-sm text-[#8E2A6B] hover:underline font-medium">View all</button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                        <p>You haven't placed any orders yet.</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <Droplet className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Order #{order.id.substring(0, 8)}</p>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(order.ordered_at || order.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-600">+₹{order.total_amount}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold mt-1
                              ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                'bg-slate-100 text-slate-800'}`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Incomplete Tab states (can be expanded later) */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                  <Droplet className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Full order history will be displayed here.</p>
                </div>
              )}
              {activeTab === 'cashback' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                  <Wallet className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">Detailed cashback wallet and scan history will be displayed here.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
