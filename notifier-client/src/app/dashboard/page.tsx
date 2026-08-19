"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Boxes,
  CircleAlert,
  Clock3,
  KeyRound,
  Plus,
  Send,
} from "lucide-react";
import { useState } from "react";
import {
  NotifierShell,
  PageHeader,
  StatCard,
} from "@/components/notifier-shell";

export default function DashboardPage() {
  const [isSending, setIsSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<string | null>(null);

  const handleSendTestSms = async () => {
    setIsSending(true);
    setSendMessage(null);

    try {
      const response = await fetch("/api/test-sms", { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message ?? "Unable to send test SMS.");
      setSendMessage("Test SMS accepted for delivery.");
    } catch (error) {
      setSendMessage(
        error instanceof Error ? error.message : "Unable to send the test SMS.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <NotifierShell>
      <PageHeader
        title="Good morning, Ansh"
        description="Monitor and manage your notification infrastructure."
        action={
          <Link
            href="/events/create"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus size={16} />
            Create event
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total notifications"
          value="—"
          hint="No delivery data yet"
          icon={Bell}
          tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        />
        <StatCard
          label="Sent"
          value="—"
          hint="Awaiting your first send"
          icon={ArrowUpRight}
        />
        <StatCard
          label="Failed"
          value="—"
          hint="No failures recorded"
          icon={CircleAlert}
          tone="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
        />
        <StatCard
          label="Pending"
          value="—"
          hint="Queue is clear"
          icon={Clock3}
          tone="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
        />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent notifications</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your latest delivery attempts will appear here.
              </p>
            </div>
            <Link
              href="/notifications"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted">
              <Bell size={19} className="text-muted-foreground" />
            </div>
            <h3 className="font-medium">No notifications yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create an event and trigger it from your application to start
              monitoring delivery.
            </p>
            <Link
              href="/docs"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Read the integration guide <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold">Quick actions</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Common workspace tasks
          </p>
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={handleSendTestSms}
              disabled={isSending}
              className="flex w-full items-center gap-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-left text-sm hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} className="text-primary" />
              <span className="flex-1">
                {isSending ? "Sending test SMS..." : "Send test SMS"}
              </span>
            </button>
            {sendMessage && (
              <p className="px-1 text-xs text-muted-foreground">{sendMessage}</p>
            )}
            <Link
              href="/events/create"
              className="flex items-center gap-3 rounded-md border p-3 text-sm hover:bg-muted"
            >
              <Boxes size={17} className="text-primary" />
              <span className="flex-1">Create an event</span>
              <ArrowUpRight size={15} className="text-muted-foreground" />
            </Link>
            <Link
              href="/api-keys"
              className="flex items-center gap-3 rounded-md border p-3 text-sm hover:bg-muted"
            >
              <KeyRound size={17} className="text-primary" />
              <span className="flex-1">Generate API key</span>
              <ArrowUpRight size={15} className="text-muted-foreground" />
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-3 rounded-md border p-3 text-sm hover:bg-muted"
            >
              <Bell size={17} className="text-primary" />
              <span className="flex-1">View documentation</span>
              <ArrowUpRight size={15} className="text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>
    </NotifierShell>
  );
}
