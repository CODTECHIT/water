import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FlaskConical,
  ShoppingCart,
  Users,
  Wallet,
  Package,
  LogOut,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/tds", label: "Water Quality Report", icon: FlaskConical },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/cashback", label: "Cashback Claims", icon: Wallet },
  { to: "/admin/products", label: "Products / Pricing", icon: Package },
];

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-[#8E2A6B] text-white font-semibold">
            K
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">King Water</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Admin
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as "/admin"}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  Active
                    ? "bg-[#8E2A6B] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <Link
            to={"/admin/login" as "/admin"}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={16} />
            Sign out
          </Link>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
          {actions}
          <div className="hidden items-center gap-2 md:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              AK
            </div>
            <div className="text-xs leading-tight">
              <div className="font-medium text-slate-900">Arjun Kapoor</div>
              <div className="text-slate-500">Operations</div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: "Pending" | "Delivered" | "Approved" | "Rejected";
}) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800 ring-amber-200",
    Delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 ring-rose-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
