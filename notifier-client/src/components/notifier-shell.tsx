"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Boxes,
  KeyRound,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/events", label: "Events", icon: Boxes },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/api-keys", label: "API keys", icon: KeyRound },
  { href: "/docs", label: "Documentation", icon: BookOpen },
];

export function NotifierShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Browser session storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(authApi.getUser());

    const handleSessionExpired = () => router.replace("/login");
    window.addEventListener("notifier:session-expired", handleSessionExpired);

    const token = sessionStorage.getItem("notifier.accessToken");
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }

    return () =>
      window.removeEventListener(
        "notifier:session-expired",
        handleSessionExpired,
      );
  }, [pathname, router]);

  const handleLogout = () => {
    authApi.logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2 pb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bell size={17} />
            </span>
            Notifier
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Workspace
        </p>
        <nav className="space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings size={17} />
            Settings
          </Link>
          <div className="border-t pt-4">
            <div className="flex items-center gap-3 px-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                {user?.name?.slice(0, 1).toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {user?.name ?? "Loading user"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-md border px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-5 backdrop-blur lg:px-8">
          <button
            className="rounded-md p-2 hover:bg-muted lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="hidden text-sm text-muted-foreground lg:block">
            Workspace /{" "}
            <span className="text-foreground">
              {pathname.split("/")[1] || "dashboard"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              API status{" "}
              <span className="ml-1 inline-block size-1.5 rounded-full bg-emerald-500" />
            </span>
            <div className="size-8 rounded-full bg-muted text-center text-xs font-semibold leading-8">
              AS
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
        <footer className="mx-auto mt-8 max-w-7xl border-t px-5 py-7 text-xs text-muted-foreground lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-foreground">Notifier</span>{" "}
              helps teams deliver dependable customer messages.
            </p>
            <div className="flex gap-4">
              <Link href="/docs" className="hover:text-foreground">
                Documentation
              </Link>
              <Link href="/settings" className="hover:text-foreground">
                Account settings
              </Link>
              <span>API status: operational</span>
            </div>
          </div>
          <p className="mt-3">
            Keep your API keys private. Delivery activity and logs are retained
            for your workspace visibility.
          </p>
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow ?? "Notifier"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Bell;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={`rounded-md p-2 ${tone ?? "bg-muted text-foreground"}`}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SENT: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    FAILED: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    QUEUED:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    PROCESSING:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    ACTIVE:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
