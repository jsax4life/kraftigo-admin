 "use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Users,
  Settings,
  BarChart2,
  BriefcaseBusiness,
  Wrench,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  BadgeCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/waitlist", label: "Waitlist", icon: ListChecks },
  { href: "/admin/krafters", label: "Krafters", icon: Wrench },
  {
    href: "/admin/work-eligibility",
    label: "Work eligibility",
    icon: BadgeCheck
  },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: BriefcaseBusiness },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Client-side auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show nothing while checking auth or redirecting
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Desktop sidebar */}
      <aside
        className={`hidden flex-col border-r border-slate-800/80 bg-slate-950/80 px-3 py-4 transition-all duration-200 md:flex ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="mb-4 flex items-center gap-2 px-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
          {!collapsed && (
            <span className="text-xs font-semibold tracking-wide text-slate-100">
              Kraftigo Admin
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[10px] text-slate-400 hover:border-emerald-400 hover:text-emerald-300"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={`h-3 w-3 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 ${
                  active
                    ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="mt-auto px-2 pt-2 text-[10px] text-slate-500">
            Internal use only
          </div>
        )}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-60 border-r border-slate-800/80 bg-slate-950/95 px-3 py-4">
            <div className="mb-4 flex items-center gap-2 px-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
              <span className="text-xs font-semibold tracking-wide text-slate-100">
                Kraftigo Admin
              </span>
            </div>
            <nav className="flex flex-1 flex-col gap-1 text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 ${
                      active
                        ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/60 px-4 py-3 text-xs text-slate-300 md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="hidden text-xs font-medium text-slate-200 sm:inline">
              Kraftigo Control Center
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-1 text-[11px] text-slate-300 shadow-sm sm:flex">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search users, bookings, services…"
                className="h-6 w-full bg-transparent text-xs outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-400 hover:text-sky-300"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden flex-col text-[10px] leading-tight text-slate-300 sm:flex">
                <span className="font-medium">
                  {user?.email ?? "Admin"}
                </span>
                <span className="text-slate-500">
                  {user?.roles?.join(", ") ?? "—"}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-[11px] font-semibold text-slate-950">
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoading}
              className="hidden rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-rose-400 hover:text-rose-300 md:inline-flex"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

